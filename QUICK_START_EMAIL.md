# Email Support for Prayer Requests - Quick Start

## What Changed?

Prayer requests can now be sent via **Email** in addition to SMS and WhatsApp.

## Quick Setup (5 minutes)

### Step 1: Get Resend API Key
- Visit [resend.com](https://resend.com)
- Sign up and create an API key

### Step 2: Update `.env` File
Add these three lines to your `.env`:

```env
RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
PRAYER_EMAIL_RECIPIENTS=admin@yourdomain.com,pastor@yourdomain.com
PRAYER_SMS_WHATSAPP_FORWARD_NUMBER=0544733469 # Optional: for forwarding SMS/WhatsApp requests
```

### Step 3: Restart Server
```bash
npm run server
```

Done! Users can now select **📧 Email** when submitting prayer requests.

## What's New in Code?

### Backend Changes (server.js)
- Added Resend import and configuration
- Updated `/api/sendPrayer` endpoint to handle `method: 'email'`
- Creates formatted HTML email with prayer request details
- Sends to all configured email recipients

### Frontend Changes (PrayerAI.tsx)
- Added "Email" option in method selection (Step 0)
- Updated method type to include "email"
- UI shows 3 method buttons in a grid: SMS, WhatsApp, Email

### Database Changes
- Created migration: `20260131_add_email_support.sql`
- No schema changes needed (method field already supports any text)
- Added index on `method` field for better query performance

### Type Updates (api.ts)
- `PrayerRequestPayload` now accepts `method: "sms" | "whatsapp" | "email"`

## How It Works

```
User selects "Email" 
  ↓
Fills out prayer request form
  ↓
Submits (POST /api/sendPrayer with method='email')
  ↓
Server saves to database
  ↓
Server sends email via Resend API
  ↓
Prayer leaders receive formatted email
  ↓
Admin can see "email" method in dashboard
```

## Email Format

Recipients receive:
```
Subject: 🙏 New Prayer Request from [Name]

Body:
- Name
- Phone number
- Location
- Full prayer request text
- Submission timestamp
```

## Environment Variables Reference

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `RESEND_API_KEY` | Yes | `re_xxx...` | Resend authentication |
| `RESEND_FROM_EMAIL` | Yes | `noreply@church.com` | Sender email address |
| `PRAYER_EMAIL_RECIPIENTS` | Yes | `pastor@church.com,prayer@church.com` | Comma-separated recipient list |

## Testing

1. Go to Prayer AI page
2. Select **📧 Email** method
3. Fill form and submit
4. Check email inbox for prayer request
5. Server logs will show: `[EMAIL] ✅ Email sent to...`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No email received | Check PRAYER_EMAIL_RECIPIENTS is correct |
| "Email not configured" error | Verify both RESEND_API_KEY and PRAYER_EMAIL_RECIPIENTS are set |
| Email in spam folder | May need to verify domain in Resend dashboard |
| Auth error | Double-check RESEND_API_KEY (should start with `re_`) |

## Database Query

View all email-based prayer requests:
```sql
SELECT * FROM prayer_requests 
WHERE method = 'email' 
ORDER BY created_at DESC;
```

## Files Modified/Created

- ✅ `server.js` - Added email sending logic
- ✅ `src/lib/api.ts` - Updated types
- ✅ `src/pages/PrayerAI.tsx` - Added email button
- ✅ `supabase/migrations/20260131_add_email_support.sql` - Added index
- ✅ `EMAIL_SETUP.md` - Full setup documentation (this file)
- ✅ `QUICK_START.md` - This file

## Next Steps

1. Get Resend API key
2. Add environment variables
3. Restart server
4. Test with prayer request
5. Monitor admin dashboard for email requests

See `EMAIL_SETUP.md` for advanced configuration options.
