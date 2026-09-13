const pendingPayments = new Map();

export function rememberPendingPayment(payment) {
  pendingPayments.set(String(payment.transactionId), payment);

  if (payment.reference) {
    pendingPayments.set(`reference:${payment.reference}`, payment);
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
