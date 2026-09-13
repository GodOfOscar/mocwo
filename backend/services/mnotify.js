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

    return response.data;
  } catch (error) {
    console.error(
      "mNotify SMS error:",
      error.response?.data || error.message
    );

    throw error;
  }
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

  return sendMnotifySms(recipient, message);
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

  return sendMnotifySms(recipient, message);
}