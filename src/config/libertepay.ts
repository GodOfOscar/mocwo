export const libertepayConfig = {
  publicKey: import.meta.env.VITE_LIBERTEPAY_PUBLIC_KEY || import.meta.env.VITE_EXPRESSPAY_PUBLIC_KEY || "",
  secretKey: import.meta.env.VITE_LIBERTEPAY_SECRET_KEY || import.meta.env.VITE_EXPRESSPAY_API_KEY || "",
  checkoutBaseUrl: import.meta.env.VITE_LIBERTEPAY_CHECKOUT_URL || import.meta.env.VITE_EXPRESSPAY_CHECKOUT_URL || "https://checkout.libertepay.com",
  currency: "GHS",
};
