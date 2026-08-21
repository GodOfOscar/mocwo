export async function initiatePayment(provider: string, opts: any) {
  // opts: { amount, currency, email, phone, reference, channels }
  const normalizedProvider = provider === "libertepay" ? "expresspay" : provider;

  if (normalizedProvider === "expresspay") {
    // Call backend to create a checkout session
    const payload = {
      amount: opts.amount,
      currency: opts.currency || "GHS",
      email: opts.email,
      phone: opts.phone,
      reference: opts.reference || `EXP-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,
      channels: opts.channels || [],
      metadata: {
        ...(opts.metadata || {}),
        provider: provider === "libertepay" ? "libertepay" : "expresspay",
      },
    };

    const res = await fetch(`/create-expresspay-transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to create ${provider} transaction`);
    }

    const data = await res.json();
    if (data.checkoutUrl) {
      // Open checkout in a new window/tab
      window.open(data.checkoutUrl, "_blank");
      return { started: true, checkoutUrl: data.checkoutUrl, reference: payload.reference, provider };
    }

    return { started: false, data };
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
