import axios from "axios";

const baseUrl =
  process.env.LIBERTEPAY_BASE_URL ||
  "https://360pay-merchant-api.libertepay.com";
const apiKey =
  process.env.LIBERTEPAY_API_KEY || process.env.LIBERTEPAY_SECRET_KEY || "";

export const providerHeaders = {
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};

export const providerUrl = (path) => `${baseUrl}/v1/payments/${path}`;
export { axios, apiKey };

export const normalizeAccountNumber = (value) => {
  const accountNumber = String(value || "").trim().replace(/^\+/, "");
  if (/^0\d{9}$/.test(accountNumber)) return `233${accountNumber.slice(1)}`;
  return accountNumber;
};

export const sanitizeReference = (value) => {
  const cleaned = String(value || "").trim().replace(/[^a-zA-Z0-9]/g, "");
  return cleaned || `PAY${Date.now()}`;
};

export const isAcceptedResponse = (data) => {
  const status = String(data?.status || "").toUpperCase();
  return data?.code === "00" || status === "SUCCESS" || status === "PENDING";
};
