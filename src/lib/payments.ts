export async function initiatePayment(provider: string, opts: any) {
  // opts: { amount, currency, email, phone, reference, institution_code, account_number }
  const normalizedProvider = provider?.toLowerCase();

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
      verification?.name;

    const verifiedAccountNumber =
      verification?.account_number ||
      verification?.accountNumber ||
      account_number;

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

  if (provider === "paystack") {
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
      err.error?.message || err.message || "Account verification failed"
    );
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || "Account verification failed");
  }

  return data.data?.data || data.data; // Unwrap provider response to { account_name, account_number, ... }
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
  const cleanedPhone = opts.account_number.replace(/\D/g, "");

  let accountNumber = cleanedPhone;

  // Convert Ghana local format: 0544733469 -> 233544733469
  if (cleanedPhone.startsWith("0") && cleanedPhone.length === 10) {
    accountNumber = "233" + cleanedPhone.substring(1);
  }

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
      data?.message ||
      data?.msg ||
      `LibertéPay request failed (${res.status})`
    );
  }

  if (data.status !== "SUCCESS") {
    throw new Error(
      data.msg ||
      data.message ||
      "Payment collection failed"
    );
  }

  return {
    success: true,
    transaction_id: data.data?.transaction_id || transactionId,
    reference: payload.reference,
    data: data.data,
  };
}
