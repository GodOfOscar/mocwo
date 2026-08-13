export const expresspayConfig = {
  merchantId: import.meta.env.VITE_EXPRESSPAY_MERCHANT_ID || "",
  apiKey: import.meta.env.VITE_EXPRESSPAY_API_KEY || "",
  checkoutBaseUrl: import.meta.env.VITE_EXPRESSPAY_CHECKOUT_URL || "https://expresspay.example/checkout",
  currency: "GHS",
};
