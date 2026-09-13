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

const LIBERTEPAY_CALLBACK_URL =
  process.env.LIBERTEPAY_CALLBACK_URL ||
  "https://mocwo.onrender.com/api/payments/callback";

const isAcceptedProviderResponse = (data) => {
  const status = String(data?.status || data?.message?.status || data?.msg || "")
    .trim()
    .toUpperCase();
  const code = String(data?.code || data?.responseCode || "")
    .trim()
    .toUpperCase();
  const transactionMessage = String(
    data?.data?.transaction_message ||
    data?.transaction_message ||
    data?.message ||
    data?.msg ||
    ""
  )
    .trim()
    .toLowerCase();

  return code === "00" && (
    status === "SUCCESS" ||
    status === "PENDING" ||
    transactionMessage === "request processed" ||
    transactionMessage.includes("request processed") ||
    transactionMessage.includes("transaction initiated")
  );
};

const isLocalDevRequest = (req) => {
  const host = String(req?.hostname || "").toLowerCase();
  const origin = String(req?.headers?.origin || "").toLowerCase();

  return host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(origin);
};

const isMockFallbackEnabled = (req) =>
  String(process.env.LIBERTEPAY_USE_MOCK || "false").toLowerCase() === "true";

const providerLooksBlockedByIp = (error) => {
  const payload = String(
    error?.response?.data?.message ||
    error?.response?.data?.msg ||
    error?.response?.data?.error?.message ||
    error?.response?.data?.error?.msg ||
    error?.message ||
    ""
  );

  return /ip.*not allowed|not allowed to make this request|whitelist|allowlist|blocked/i.test(payload);
};

const makeMockNameVerifyPayload = (account_number, institution_code) => ({
  code: "00",
  status: "SUCCESS",
  account_name: "MOCWO Partner",
  account_number,
  institution_code,
  msg: "Mock LibertéPay verification accepted in development mode",
});

const makeMockCollectionPayload = (transaction_id, reference, account_number, amount) => ({
  code: "00",
  status: "SUCCESS",
  transaction_id,
  reference,
  account_number,
  amount,
  msg: "Mock LibertéPay collection accepted in development mode",
});

const sanitizeReference = (value) => {
  const base = String(value || "").trim();
  const cleaned = base.replace(/[^a-zA-Z0-9]/g, "");
  return cleaned || `PAY${Date.now()}`;
};

const normalizeAccountNumber = (value) => {
  const accountNumber = String(value || "").trim().replace(/^\+/, "");

  if (/^0\d{9}$/.test(accountNumber)) {
    return `233${accountNumber.slice(1)}`;
  }

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
        message: "LibertéPay API key is not configured on the server",
      });
    }

    if (!institution_code || !account_number) {
      return res.status(400).json({
        success: false,
        message: "institution_code and account_number are required",
      });
    }

    const normalizedAccountNumber =
      normalizeAccountNumber(account_number);

    if (!/^233\d{9}$/.test(normalizedAccountNumber)) {
      return res.status(400).json({
        success: false,
        message:
          "account_number must be a 12-digit number starting with '233'",
      });
    }

    const response = await axios.post(
      `${LIBERTEPAY_BASE_URL}/v1/payments/name-verify`,
      {
        institution_code,
        account_number: normalizedAccountNumber,
      },
      {
        headers,
      }
    );

    console.log("LibertéPay Name Verify:", response.data);

    const providerData = response.data;

    const successful =
      providerData?.code === "00" ||
      String(providerData?.status || "").toUpperCase() === "SUCCESS";

    if (!successful) {
      return res.status(422).json({
        success: false,
        message:
          providerData?.msg || "LibertéPay name verification failed",
        error: providerData,
      });
    }

    return res.status(200).json({
      success: true,
      data: providerData,
    });
  } catch (error) {
    console.error(
      "LibertéPay Name Verify Error:",
      error.response?.data || error.message
    );

    if (isMockFallbackEnabled(req) && providerLooksBlockedByIp(error)) {
      const normalizedAccountNumber = normalizeAccountNumber(req.body.account_number);
      return res.status(200).json({
        success: true,
        data: makeMockNameVerifyPayload(normalizedAccountNumber, req.body.institution_code),
      });
    }

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
  let normalizedAccountNumber = "";
  let numericAmount = 0;
  let reference = "";
  let transaction_id = `TXN${Date.now()}`;

  try {
    const {
      account_name,
      account_number,
      amount,
      institution_code,
      currency,
      metadata,
    } = req.body;

    reference = req.body.reference || "";

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

    numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "amount must be a positive number",
      });
    }

    normalizedAccountNumber = normalizeAccountNumber(account_number);
    if (!/^233\d{9}$/.test(normalizedAccountNumber)) {
      return res.status(400).json({
        success: false,
        message: "account_number must be a 12-digit number starting with '233'",
      });
    }

    // Generate your own unique transaction ID
    transaction_id = `TXN${Date.now()}`;
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
      callback_url: LIBERTEPAY_CALLBACK_URL,
      callbackUrl: LIBERTEPAY_CALLBACK_URL,
      webhook_url: LIBERTEPAY_CALLBACK_URL,
      notify_url: LIBERTEPAY_CALLBACK_URL,
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

    const providerStatus = String(response.data?.status || "").toUpperCase();
    const providerCode = String(response.data?.code || "").toUpperCase();
    const providerMessage = String(
      response.data?.msg ||
      response.data?.message ||
      response.data?.data?.msg ||
      response.data?.data?.message ||
      "Payment accepted by LibertyPay."
    );

    const transactionMessage = String(
      response.data?.data?.transaction_message ||
      response.data?.transaction_message ||
      response.data?.message ||
      response.data?.msg ||
      ""
    ).trim().toLowerCase();

    const requestAcceptedDirectly =
      providerCode === "00" &&
      (
        providerStatus === "SUCCESS" ||
        providerStatus === "PENDING" ||
        transactionMessage === "request processed" ||
        transactionMessage.includes("request processed") ||
        transactionMessage.includes("transaction initiated")
      );

    return res.status(200).json({
      success: true,
      transaction_id,
      data: response.data,
      status: requestAcceptedDirectly ? "SUCCESS" : (providerStatus || response.data?.status || "SUCCESS"),
      code: providerCode || response.data?.code || "00",
      msg: requestAcceptedDirectly
        ? "Payment request accepted by LibertyPay. Debit authorization has been initiated directly."
        : providerMessage,
    });
  } catch (error) {
    console.error(
      "LibertéPay Collection Error:",
      error.response?.data || error.message
    );

    const errorPayload = error?.response?.data || {};
    const providerStatus = String(errorPayload?.status || errorPayload?.data?.status || "").toUpperCase();
    const providerCode = String(errorPayload?.code || errorPayload?.data?.code || "").toUpperCase();
    const providerTransactionMessage = String(
      errorPayload?.data?.transaction_message ||
      errorPayload?.transaction_message ||
      errorPayload?.message ||
      errorPayload?.msg ||
      ""
    ).trim().toLowerCase();

    const requestAcceptedDirectly =
      error?.response?.status === 202 &&
      providerCode === "00" &&
      (
        providerStatus === "PENDING" ||
        providerStatus === "SUCCESS" ||
        providerTransactionMessage === "request processed" ||
        providerTransactionMessage.includes("request processed") ||
        providerTransactionMessage.includes("transaction initiated")
      );

    if (requestAcceptedDirectly) {
      return res.status(200).json({
        success: true,
        transaction_id,
        data: errorPayload,
        status: "SUCCESS",
        code: providerCode || "00",
        msg: "Payment request accepted by LibertyPay. Debit authorization has been initiated directly.",
      });
    }

    if (isMockFallbackEnabled(req) && providerLooksBlockedByIp(error)) {
      const mockTransactionId = `MOCK-${Date.now()}`;
      const mockReference = sanitizeReference(reference || mockTransactionId);

      return res.status(200).json({
        success: true,
        transaction_id: mockTransactionId,
        data: makeMockCollectionPayload(mockTransactionId, mockReference, normalizedAccountNumber, numericAmount),
        status: "SUCCESS",
        code: "00",
        msg: "Mock LibertéPay collection accepted in development mode",
      });
    }

    return res.status(error.response?.status || 500).json({
      success: false,
      message: "Payment collection failed",
      error: error.response?.data || error.message,
    });
  }
});

export default router;