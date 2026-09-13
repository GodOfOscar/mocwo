const normalizeGhanaPhone = (value: string) => {
  const cleaned = String(value || "").replace(/\D/g, "");
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return `233${cleaned.slice(1)}`;
  }
  return cleaned;
};

export async function initiatePayment(provider: string, opts: any) {
  // opts: { amount, currency, email, phone, reference, institution_code, account_number }
  const normalizedProvider = String(provider || "").trim().toLowerCase();

  if (normalizedProvider === "libertepay") {
    const {
      amount,
      currency = "GHS",
      email,
      phone,
      account_number,
      institution_code,
      reference,
    } = opts;

    if (!amount || !email) {
      throw new Error("Amount and email are required");
    }

    if (!account_number || !institution_code) {
      throw new Error(
        "Account number and institution code are required for LibertéPay"
      );
    }

    console.log("[LibertéPay] Starting name verification:", {
      institution_code,
      account_number,
    });

    const verification = await verifyLibertepayAccount(
      institution_code,
      account_number
    );

    console.log("[LibertéPay] Name verification successful:", verification);

    const verifiedAccountName =
      verification?.account_name ||
      verification?.accountName ||
      verification?.name ||
      verification?.data?.account_name ||
      verification?.data?.name;

    const verifiedAccountNumber =
      normalizeGhanaPhone(
        verification?.account_number ||
        verification?.accountNumber ||
        verification?.phone ||
        account_number
      );

    if (!verifiedAccountName) {
      console.error(
        "[LibertéPay] Name verification response did not contain account name:",
        verification
      );

      throw new Error(
        "Name verification succeeded but no verified account name was returned"
      );
    }

    console.log("[LibertéPay] Passing verified result to collection:", {
      account_name: verifiedAccountName,
      account_number: verifiedAccountNumber,
      institution_code,
      amount,
      currency,
    });

    return await collectLibertepayPayment({
      account_name: verifiedAccountName,
      account_number: verifiedAccountNumber,
      amount,
      institution_code,
      currency,
      email,
      reference,
    });
  }

  if (normalizedProvider === "paystack") {
    // Fallback to existing Paystack inline flow if still available
    const config: any = {
      key: opts.publicKey,
      email: opts.email,
      amount: (opts.amount || 0) * 100,
      currency: opts.currency || "GHS",
      ref: opts.reference || `PAYSTACK-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,
    };

    if (opts.phone) config.phone = opts.phone;

    const handler = (window as any).PaystackPop?.setup({
      ...config,
      onClose: opts.onClose || (() => {}),
      onSuccess: opts.onSuccess || (() => {}),
    });

    if (handler?.openIframe) handler.openIframe();
    return { started: true, provider: "paystack", reference: config.ref };
  }

  throw new Error(`Unknown payment provider: ${provider}`);
}

/**
 * LibertéPay: Verify account name
 */
export async function verifyLibertepayAccount(
  institution_code: string,
  account_number: string
) {
  const res = await fetch("/api/libertepay/name-verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      institution_code,
      account_number,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message ||
      err.error?.msg ||
      err.message ||
      err.msg ||
      "Account verification failed"
    );
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || data.msg || "Account verification failed");
  }

  const providerPayload = data.data?.data || data.data || data;

  if (!providerPayload || typeof providerPayload !== "object") {
    throw new Error("Account verification succeeded but returned an invalid payload");
  }

  return providerPayload;
}

/**
 * LibertéPay: Collect payment
 */
export async function collectLibertepayPayment(opts: {
  account_name: string;
  account_number: string;
  amount: number;
  institution_code: string;
  currency?: string;
  email?: string;
  reference?: string;
  metadata?: Record<string, any>;
}) {
  const accountNumber = normalizeGhanaPhone(opts.account_number);

  if (!/^233\d{9}$/.test(accountNumber)) {
    throw new Error(
      "Invalid Ghana mobile number. Use 0XXXXXXXXX or 233XXXXXXXXX."
    );
  }

  const transactionId =
    `MOC${Date.now()}${Math.random().toString(36).slice(2, 9)}`;
  const safeReference = String(opts.reference || transactionId)
    .replace(/[^a-zA-Z0-9]/g, "") || transactionId;

  const payload = {
    account_name: opts.account_name,
    account_number: accountNumber,
    amount: Number(opts.amount),
    institution_code: opts.institution_code,
    transaction_id: transactionId,
    currency: opts.currency || "GHS",
    reference: safeReference,
    metadata: opts.metadata || {
      email: opts.email,
    },
  };

  console.log("[LibertéPay] Collection payload:", payload);

  const res = await fetch("/api/libertepay/collection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();

  let data: any = {};

  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    console.error("[LibertéPay] Non-JSON response:", raw);
  }

  console.log("[LibertéPay] HTTP status:", res.status);
  console.log("[LibertéPay] Response:", data);

  if (!res.ok) {
    throw new Error(
      data?.error?.message ||
      data?.error?.msg ||
      data?.message ||
      data?.msg ||
      `LibertéPay request failed (${res.status})`
    );
  }

  const providerStatus = String(
    data?.status ||
    data?.data?.status ||
    data?.data?.data?.status ||
    data?.transaction_status ||
    ""
  ).toUpperCase();

  const providerCode = String(
    data?.code ||
    data?.data?.code ||
    data?.data?.data?.code ||
    data?.responseCode ||
    ""
  ).toUpperCase();

  const providerMessage = String(
    data?.msg ||
    data?.message ||
    data?.data?.msg ||
    data?.data?.message ||
    data?.data?.data?.msg ||
    data?.data?.data?.message ||
    "Payment collection failed"
  );

  const providerTransactionMessage = String(
    data?.data?.transaction_message ||
    data?.transaction_message ||
    data?.message ||
    data?.msg ||
    data?.data?.message ||
    data?.data?.msg ||
    ""
  ).trim().toLowerCase();

  if (
    providerCode === "00" &&
    (
      providerStatus === "SUCCESS" ||
      providerStatus === "PENDING" ||
      providerTransactionMessage === "request processed" ||
      providerTransactionMessage.includes("request processed") ||
      providerTransactionMessage.includes("transaction initiated")
    )
  ) {
    return {
      success: true,
      transaction_id:
        data?.transaction_id ||
        data?.data?.transaction_id ||
        data?.data?.data?.transaction_id ||
        transactionId,
      reference: payload.reference,
      status: "SUCCESS",
      message: providerMessage || "Payment request accepted by LibertyPay. Debit authorization has been initiated directly.",
      data: data?.data || data,
    };
  }

  if (providerStatus !== "SUCCESS" || providerCode !== "00") {
    throw new Error(providerMessage || "Payment collection failed");
  }

  return {
    success: true,
    transaction_id:
      data?.transaction_id ||
      data?.data?.transaction_id ||
      data?.data?.data?.transaction_id ||
      transactionId,
    reference: payload.reference,
    status: providerStatus,
    data: data?.data || data,
  };
}
