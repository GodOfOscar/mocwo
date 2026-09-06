# LibertéPay Integration Test Guide

## Test Credentials

### MoMo (Mobile Money)
- **Institution Code**: `300591`
- **Account Number**: `0246089019`

### Bank
- **Institution Code**: `300312`
- **Account Number**: `1020820171412`

## Prerequisites
- Backend server running on `http://localhost:5000`
- `LIBERTEPAY_API_KEY` set in your `.env` file
- `LIBERTEPAY_BASE_URL` set to `https://360pay-merchant-api.libertepay.com` (default)

---

## Test 1: Name Verification

Verify a mobile money account before charging.

**Endpoint**: `POST http://localhost:5000/api/libertepay/name-verify`

**Request Body** (MoMo Example):
```json
{
  "institution_code": "300591",
  "account_number": "0242875432"
}
```

**Request Body** (Bank Example):
```json
{
  "institution_code": "300312",
  "account_number": "1020820171412"
}
```

**Example from React**:
```jsx
async function verifyAccount() {
  try {
    const response = await fetch(
      "http://localhost:5000/api/libertepay/name-verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          institution_code: "058",
          account_number: "233XXXXXXXXX",
        }),
      }
    );

    const data = await response.json();
    console.log("Verification result:", data);
    
    if (data.success) {
      console.log("Account name:", data.data.account_name);
      // Proceed to payment collection
    }
  } catch (error) {
    console.error("Verification error:", error);
  }
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "account_name": "CUSTOMER NAME",
    "account_number": "233XXXXXXXXX",
    ...
  }
}
```

---

## Test 2: Payment Collection

Collect payment once account is verified.

**Endpoint**: `POST http://localhost:5000/api/libertepay/collection`

**Request Body** (MoMo Example):
```json
{
  "account_name": "TEST CUSTOMER",
  "account_number": "0242875432",
  "amount": 10,
  "institution_code": "300591",
  "currency": "GHS",
  "reference": "Test payment",
  "metadata": {
    "customer_id": "12345"
  }
}
```

**Request Body** (Bank Example):
```json
{
  "account_name": "TEST BANK CUSTOMER",
  "account_number": "1020820171412",
  "amount": 100,
  "institution_code": "300312",
  "currency": "GHS",
  "reference": "Test bank payment",
  "metadata": {
    "customer_id": "12345"
  }
}
```

**Example from React**:
```jsx
async function collectPayment(accountName, accountNumber, amount) {
  try {
    const response = await fetch(
      "http://localhost:5000/api/libertepay/collection",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_name: accountName,
          account_number: accountNumber,
          amount: amount,
          institution_code: "058",
          currency: "GHS",
          reference: `Payment from ${accountName}`,
          metadata: {
            customer_id: "12345",
          },
        }),
      }
    );

    const data = await response.json();
    console.log("Payment result:", data);

    if (data.success) {
      console.log("Transaction ID:", data.transaction_id);
      // Payment successful
    }
  } catch (error) {
    console.error("Payment error:", error);
  }
}
```

**Expected Response**:
```json
{
  "success": true,
  "transaction_id": "TXN-1756789012345",
  "data": {
    "status": "success",
    "reference": "Test payment",
    ...
  }
}
```

---

## Full Payment Flow in React

```jsx
const [accountName, setAccountName] = useState("");
const [accountNumber, setAccountNumber] = useState("");

async function handlePayment() {
  // Step 1: Verify account
  const verifyRes = await fetch(
    "http://localhost:5000/api/libertepay/name-verify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        institution_code: "058",
        account_number: accountNumber,
      }),
    }
  );

  const verifyData = await verifyRes.json();

  if (!verifyData.success) {
    alert("Account verification failed");
    return;
  }

  setAccountName(verifyData.data.account_name);

  // Step 2: Collect payment
  const payRes = await fetch(
    "http://localhost:5000/api/libertepay/collection",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_name: verifyData.data.account_name,
        account_number: accountNumber,
        amount: 10,
        institution_code: "058",
        currency: "GHS",
        reference: "Partnership Payment",
      }),
    }
  );

  const payData = await payRes.json();

  if (payData.success) {
    alert(`Payment successful! Transaction ID: ${payData.transaction_id}`);
  } else {
    alert("Payment failed");
  }
}

return (
  <div>
    <input
      type="text"
      placeholder="Enter account number"
      value={accountNumber}
      onChange={(e) => setAccountNumber(e.target.value)}
    />
    <button onClick={handlePayment}>Verify & Pay</button>
  </div>
);
```

---

## Environment Variables Required

Add to your `.env` file:
```
LIBERTEPAY_API_KEY=your_api_key_here
LIBERTEPAY_BASE_URL=https://360pay-merchant-api.libertepay.com
```

---

## Testing Without Frontend

Use cURL or any HTTP client:

**Name Verify (MoMo)**:
```bash
curl -X POST http://localhost:5000/api/libertepay/name-verify \
  -H "Content-Type: application/json" \
  -d '{
    "institution_code": "300591",
    "account_number": "0246089019"
  }'
```

**Name Verify (Bank)**:
```bash
curl -X POST http://localhost:5000/api/libertepay/name-verify \
  -H "Content-Type: application/json" \
  -d '{
    "institution_code": "300312",
    "account_number": "1020820171412"
  }'
```

**Collection (MoMo)**:
```bash
curl -X POST http://localhost:5000/api/libertepay/collection \
  -H "Content-Type: application/json" \
  -d '{
    "account_name": "TEST CUSTOMER",
    "account_number": "0246089019",
    "amount": 10,
    "institution_code": "300591",
    "currency": "GHS",
    "reference": "Test payment"
  }'
```

**Collection (Bank)**:
```bash
curl -X POST http://localhost:5000/api/libertepay/collection \
  -H "Content-Type: application/json" \
  -d '{
    "account_name": "TEST BANK CUSTOMER",
    "account_number": "1020820171412",
    "amount": 100,
    "institution_code": "300312",
    "currency": "GHS",
    "reference": "Test bank payment"
  }'
```

---

## Notes
- Your API key is **never exposed** to the frontend
- All LibertéPay calls go through your Express backend
- Transaction IDs are automatically generated in the format: `TXN-{timestamp}`
- Test with real account numbers from your MoMo network (institution code 058)
