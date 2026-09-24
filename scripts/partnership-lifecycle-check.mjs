import assert from 'node:assert/strict';
import { createPartnershipRegistration, calculateRevenue } from '../backend/services/partnershipLifecycle.js';

const partnership = createPartnershipRegistration({
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '0240000000',
  level: 'Bronze Partner',
  amount: 50,
  paymentMethod: 'mobile-money',
  message: 'First registration'
});

assert.equal(partnership.status, 'pending_payment');
assert.equal(partnership.payment_status, 'pending');
assert.ok(partnership.id);
assert.ok(partnership.payment_reference);
assert.equal(calculateRevenue([{ status: 'paid', amount: 100 }, { status: 'failed', amount: 50 }, { status: 'pending', amount: 25 }]), 100);
console.log('partnership lifecycle checks passed');
