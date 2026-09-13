const pendingPayments = new Map();

export function rememberPendingPayment(payment) {
  const normalized = { ...payment };
  pendingPayments.set(String(normalized.transactionId), normalized);

  if (normalized.reference) {
    pendingPayments.set(`reference:${normalized.reference}`, normalized);
  }
}

export function findPendingPayment(transactionId, reference) {
  return (
    (transactionId && pendingPayments.get(String(transactionId))) ||
    (reference && pendingPayments.get(`reference:${reference}`)) ||
    null
  );
}

export function forgetPendingPayment(transactionId, reference) {
  const payment = findPendingPayment(transactionId, reference);
  if (!payment) return;

  pendingPayments.delete(String(payment.transactionId));
  if (payment.reference) {
    pendingPayments.delete(`reference:${payment.reference}`);
  }
}
