import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: new URL("../.env", import.meta.url) });
dotenv.config({ path: new URL("../../.env", import.meta.url) });

const router = express.Router();

const LIBERTEPAY_BASE_URL =
  process.env.LIBERTEPAY_BASE_URL ||
  "https://360pay-merchant-api.libertepay.com";

const LIBERTEPAY_API_KEY =
  process.env.LIBERTEPAY_API_KEY || process.env.LIBERTEPAY_SECRET_KEY || "";

const headers = {
  Authorization: `Bearer ${LIBERTEPAY_API_KEY}`,
  "Content-Type": "application/json",
};

const isAcceptedProviderResponse = (data) => {
  const status = String(data?.status || "").toUpperCase();
  return data?.code === "00" || status === "SUCCESS" || status === "PENDING";
};

const sanitizeReference = (value) => {
  const base = String(value || "").trim();
  const cleaned = base.replace(/[^a-zA-Z0-9]/g, "");
  return cleaned || `PAY${Date.now()}`;
};

const normalizeAccountNumber = (value) => {
  const accountNumber = String(value || "").trim().replace(/^\+/, "");
  if (/^0\d{9}$/.test(accountNumber)) return `233${accountNumber.slice(1)}`;
  return accountNumber;
};

/**
 * STEP 1
 * Verify a mobile money account
 */
router.post("/name-verify", async (req, res) => {
  try {
    const { institution_code, account_number } = req.body;

    if (!LIBERTEPAY_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "LibertéPay secret key is not configured on the server",
      });
    }

    if (!institution_code || !account_number) {
      return res.status(400).json({
        success: false,
        message: "institution_code and account_number are required",
      });
    }

    const response = await axios.post(
      `${LIBERTEPAY_BASE_URL}/v1/payments/name-verify`,
      {
        institution_code,
        account_number,
      },
      {
        headers,
      }
    );

    console.log("LibertéPay Name Verify:", response.data);

    return res.status(response.status).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(
      "LibertéPay Name Verify Error:",
      error.response?.data || error.message
    );

    return res.status(error.response?.status || 500).json({
      success: false,
      message: "Name verification failed",
      error: error.response?.data || error.message,
    });
  }
});


/**
 * STEP 2
 * Collect money from mobile money wallet
 */
router.post("/collection", async (req, res) => {
  try {
    const {
      account_name,
      account_number,
      amount,
      institution_code,
      currency,
      reference,
      metadata,
    } = req.body;

    if (
      !account_name ||
      !account_number ||
      !amount ||
      !institution_code
    ) {
      return res.status(400).json({
        success: false,
        message:
          "account_name, account_number, amount and institution_code are required",
      });
    }

      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "amount must be a positive number",
        });
      }

      const normalizedAccountNumber = normalizeAccountNumber(account_number);
      if (!/^233\d{9}$/.test(normalizedAccountNumber)) {
        return res.status(400).json({
          success: false,
          message: "account_number must be a 12-digit number starting with '233'",
        });
      }

    // Generate your own unique transaction ID
    const transaction_id = `TXN${Date.now()}`;
    const safeReference = sanitizeReference(reference || `PAY${Date.now()}`);

    const paymentData = {
      account_name,
      account_number: normalizedAccountNumber,
      amount: numericAmount,
      institution_code,
      transaction_id,
      currency: currency || "GHS",
      reference: safeReference,
      metadata: metadata || {},
    };

    console.log("Sending collection request:", paymentData);

    const response = await axios.post(
      `${LIBERTEPAY_BASE_URL}/v1/payments/collection`,
      paymentData,
      {
        headers,
      }
    );

    console.log("LibertéPay Collection Response:", response.data);

    if (!isAcceptedProviderResponse(response.data)) {
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
    console.error(
      "LibertéPay Collection Error:",
      error.response?.data || error.message
    );

    return res.status(error.response?.status || 500).json({
      success: false,
      message: "Payment collection failed",
      error: error.response?.data || error.message,
    });
  }
});

export default router;