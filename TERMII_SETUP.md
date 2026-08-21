# Termii Integration Setup Guide

## Why Termii?

Termii is a **free, reliable SMS/WhatsApp API** that works perfectly for African phone numbers (like your +233 Ghana number). Unlike Twilio, Termii:

- ✅ **Completely Free** - No credit card required
- ✅ **SMS + WhatsApp Support** - Single API for both channels
- ✅ **High Deliverability** - Optimized for African networks
- ✅ **Easy Integration** - Simple REST API
- ✅ **Great Support** - Responsive customer service

## Quick Setup Steps

### 1. Create Termii Account (Free)
1. Visit: https://www.termii.com/
2. Click "Get Started" 
3. Sign up with your email
4. Verify your email
5. Dashboard will be ready instantly (no approval delays)

### 2. Get Your API Key
1. Log in to Termii Dashboard
2. Go to **Settings → API Credentials**
3. Copy your **API Key** (looks like: `d1a2b3c4d5e6...`)
4. This is your `TERMII_API_KEY`

### 3. Update `.env` File
Replace the placeholder in your `.env` file:

```env
# Termii Configuration
TERMII_API_KEY=your_termii_api_key_here
TERMII_SENDER_ID=MOC
LEADER_PHONE_NUMBER=+233243527174
```

That's it! Your prayer notifications will now use Termii instead of Twilio.

## How It Works

### SMS Prayer Notifications
```
User submits prayer request
    ↓
Server calls /api/sendPrayer with method="sms"
    ↓
Termii API sends SMS to leader's phone
    ↓
Leader receives prayer request
```

### WhatsApp Prayer Notifications
```
User submits prayer request
    ↓
Server calls /api/sendPrayer with method="whatsapp"
    ↓
Termii API sends WhatsApp message to leader
    ↓
Leader receives prayer request on WhatsApp
```

## API Response Examples

**Successful SMS:**
```json
{
  "message": "Prayer request sent via SMS successfully.",
  "messageId": "9121344968118715171"
}
```

**Successful WhatsApp:**
```json
{
  "message": "Prayer request sent via WhatsApp successfully.",
  "messageId": "1144144906662145671"
}
```

## Testing Your Integration

### 1. Test SMS
```bash
curl -X POST http://localhost:5000/api/sendPrayer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+233501234567",
    "location": "Accra",
    "prayer": "Please pray for my family",
    "method": "sms"
  }'
```

### 2. Test WhatsApp
```bash
curl -X POST http://localhost:5000/api/sendPrayer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phone": "+233501234567",
    "location": "Kumasi",
    "prayer": "Pray for my job interview",
    "method": "whatsapp"
  }'
```

## Troubleshooting

### "Missing API Key Error"
- Ensure `TERMII_API_KEY` is set in `.env`
- Restart your server after updating `.env`
- Command: `npm run dev`

### "Invalid phone number format"
- Phone numbers must include country code
- Ghana: +233XXXXXXXXX
- Do NOT use 0233... format

### "WhatsApp message not delivered"
- WhatsApp requires user to accept terms first
- Sender and receiver must be verified Termii users
- For testing, use a personal number you own

### "SMS not received"
- Check that `LEADER_PHONE_NUMBER` is correct in `.env`
- Verify the phone has SMS enabled (not WhatsApp-only)
- Check spam folder

## API Documentation

Full Termii API docs: https://developer.termii.com/

Key endpoints used:
- `/sms/send` - Send SMS or WhatsApp messages
- `/sender-id/list` - List sender IDs
- `/balance/check` - Check account balance

## Free Tier Limits

- **SMS**: 100-1000 free credits monthly (varies)
- **WhatsApp**: Requires WhatsApp Business Account
- **No per-message fees** after free credits

## Switching Back to Twilio (Optional)

If you ever want to switch back:

1. Update `.env` with Twilio credentials
2. Change the import in `server.js` from `axios` to `twilio`
3. Update the `/api/sendPrayer` endpoint logic

But honestly, Termii is better for Ghana! 🇬🇭

## Additional Resources

- **Termii Dashboard**: https://app.termii.com/
- **API Docs**: https://developer.termii.com/
- **Status Page**: https://status.termii.com/

Enjoy free SMS & WhatsApp notifications! 🎉
