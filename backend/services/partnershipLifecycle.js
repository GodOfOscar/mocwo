export function normalizePartnershipStatus(status = "") {
  const value = String(status || "").trim().toLowerCase();

  if (["pending_payment", "pending"].includes(value)) return "pending_payment";
  if (["active", "approved"].includes(value)) return "active";
  if (["payment_failed", "failed", "rejected"].includes(value)) return "payment_failed";
  if (["suspended", "cancelled", "cancelled_payment"].includes(value)) return value;

  return value || "pending_payment";
}

export function calculateRevenue(items = []) {
  return items.reduce((sum, payment) => {
    const amount = Number(payment?.amount || 0);
    return payment?.status === "paid" || payment?.status === "successful" ? sum + amount : sum;
  }, 0);
}

export function createPartnershipRegistration({
  name,
  email,
  phone = "",
  level,
  amount,
  paymentMethod = "mobile-money",
  message = "",
  paymentReference,
}) {
  const safeName = String(name || "").trim().replace(/\s+/g, " ");
  const safeReference = paymentReference || `MOCWO-PARTNER-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id: `partner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: safeName,
    email: String(email || "").trim(),
    phone: String(phone || "").trim(),
    level: String(level || "custom").trim(),
    amount: Number(amount || 0),
    payment_method: String(paymentMethod || "mobile-money").trim(),
    message: String(message || "").trim(),
    status: "pending_payment",
    payment_status: "pending",
    payment_reference: safeReference,
  };
}
