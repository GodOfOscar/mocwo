import axios from "axios";

const MNOTIFY_API_URL = "https://api.mnotify.com/api/sms/quick";

export function normalizeGhanaPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");

  if (digits.startsWith("0") && digits.length === 10) {
    return `233${digits.slice(1)}`;
  }

  if (digits.startsWith("233") && digits.length === 12) {
    return digits;
  }

  return digits;
}

export async function sendMnotifySms(recipient, message) {
  const apiKey = process.env.MNOTIFY_API_KEY;
  const normalizedRecipient = normalizeGhanaPhone(recipient);

  if (!apiKey) {
    throw new Error("MNOTIFY_API_KEY is not configured");
  }

  if (!normalizedRecipient) {
    throw new Error("Invalid phone number");
  }

  if (!message) {
    throw new Error("SMS message is required");
  }

  try {
    const response = await axios.post(
      `${MNOTIFY_API_URL}?key=${encodeURIComponent(apiKey)}`,
      {
        recipient: [normalizedRecipient],
        sender: process.env.MNOTIFY_SENDER_ID || "MOCWO",
        message,
        is_schedule: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;
    const summary = result?.summary;

    if (summary && (summary.total_rejected > 0 || summary.total_sent < 1)) {
      throw new Error(
        `mNotify rejected the SMS: ${result.message || "No messages were sent"}`
      );
    }

    if (result?.status && String(result.status).toLowerCase() !== "success") {
      throw new Error(result.message || "mNotify did not accept the SMS");
    }

    console.log("[mNotify] SMS response:", result);
    return result;
  } catch (error) {
    console.error(
      "mNotify SMS error:",
      error.response?.data || error.message
    );

    throw error;
  }
}

async function sendSmsWithRetry(recipient, message) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await sendMnotifySms(recipient, message);
    } catch (error) {
      lastError = error;
      console.error(`[mNotify] SMS attempt ${attempt}/3 failed:`, error.message);

      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw lastError;
}

export async function sendPartnershipPaymentSms({
  name,
  phone,
  amount,
  reference,
}) {
  const recipient = normalizeGhanaPhone(phone);

  if (!/^233\d{9}$/.test(recipient)) {
    throw new Error(`Invalid Ghana phone number: ${phone}`);
  }

  const message =
    `MOCWO: Dear ${name}, your partnership payment of GHS ${Number(amount).toFixed(2)} ` +
    "has been received successfully. Thank you for partnering with us. God bless you." +
    (reference ? ` Ref: ${reference}` : "");

  return sendSmsWithRetry(recipient, message);
}

export async function sendDonationPaymentSms({
  name = "Friend",
  phone,
  amount,
  reference,
}) {
  const recipient = normalizeGhanaPhone(phone);

  if (!/^233\d{9}$/.test(recipient)) {
    throw new Error(`Invalid Ghana phone number: ${phone}`);
  }

  const message =
    `MOCWO: Dear ${name}, your payment of GHS ${Number(amount).toFixed(2)} ` +
    "has been received successfully. Thank you for giving. God bless you." +
    (reference ? ` Ref: ${reference}` : "");

  return sendSmsWithRetry(recipient, message);
}