import { axios, providerHeaders, providerUrl, isAcceptedResponse, normalizeAccountNumber, sanitizeReference } from "./provider.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const {
    account_name,
    account_number,
    amount,
    institution_code,
    currency,
    reference,
    metadata,
  } = req.body || {};

  if (!account_name || !account_number || !amount || !institution_code) {
    return res.status(400).json({
      success: false,
      message: "account_name, account_number, amount and institution_code are required",
    });
  }

  const numericAmount = Number(amount);
  const normalizedAccountNumber = normalizeAccountNumber(account_number);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ success: false, message: "amount must be a positive number" });
  }
  if (!/^233\d{9}$/.test(normalizedAccountNumber)) {
    return res.status(400).json({ success: false, message: "account_number must be a valid Ghana number" });
  }

  const transaction_id = `TXN${Date.now()}`;
  const paymentData = {
    account_name,
    account_number: normalizedAccountNumber,
    amount: numericAmount,
    institution_code,
    transaction_id,
    currency: currency || "GHS",
    reference: sanitizeReference(reference || `PAY${Date.now()}`),
    metadata: metadata || {},
  };

  try {
    const response = await axios.post(providerUrl("collection"), paymentData, {
      headers: providerHeaders,
    });

    if (!isAcceptedResponse(response.data)) {
      return res.status(502).json({
        success: false,
        message: response.data?.msg || "LibertéPay did not accept the collection request",
        error: response.data,
      });
    }

    return res.status(response.status).json({
      success: true,
      transaction_id,
      data: response.data,
      status: response.data?.status,
      code: response.data?.code,
      msg: response.data?.msg,
    });
  } catch (error) {
    console.error("LibertéPay Collection Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: "Payment collection failed",
      error: error.response?.data || error.message,
    });
  }
}
