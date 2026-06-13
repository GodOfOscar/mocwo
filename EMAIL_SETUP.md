# Gmail/Email Support for Prayer Requests

This document explains how to set up email support for prayer requests using Gmail or any email service via Resend.

## Overview

Prayer requests can now be sent via three methods:
- **SMS** - Text message notifications
- **WhatsApp** - WhatsApp message notifications  
- **Email** - Email notifications (NEW)

## Prerequisites

You need a Resend account with:
- API key
- Verified sender email domain
- Email recipients configured

## Setup Instructions

### 1. Get a Resend API Key

1. Go to [Resend.com](https://resend.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you'll need it in the next step)

### 2. Configure Environment Variables

Add these variables to your `.env` file:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
PRAYER_EMAIL_RECIPIENTS=admin@yourdomain.com,pastor@yourdomain.com,prayer@yourdomain.com

# SMS/WhatsApp Forwarding Number
PRAYER_SMS_WHATSAPP_FORWARD_NUMBER=0544733469
```

**Explanation:**
- `RESEND_API_KEY` - Your Resend API key
- `RESEND_FROM_EMAIL` - The sender email address (must be verified in Resend)
- `PRAYER_EMAIL_RECIPIENTS` - Comma-separated list of email addresses that will receive prayer requests

### 3. (Optional) Verify Your Domain in Resend

For production use:
1. In Resend dashboard, go to Domains
2. Add your domain (e.g., yourdomain.com)
3. Follow DNS verification instructions
4. Once verified, use emails like noreply@yourdomain.com

### 4. Restart Your Server

After updating environment variables:

```bash
npm run server
# or
node server.js
```

## How It Works

### User Flow

1. User accesses the Prayer AI page
2. Selects **📧 Email** as their preferred update method
3. Fills in name, phone, location, and prayer request
4. Prayer request is saved to database
5. Email is sent to configured recipients with:
   - User's name
   - User's phone number
   - User's location
   - Prayer request text
   - Timestamp

### Backend Flow

The `/api/sendPrayer` endpoint now:
1. Validates input
2. Saves prayer request to Supabase with `method: 'email'`
3. If method is 'email':
   - Sends email to all configured recipients
   - Returns success/failure status
4. Logs all activity for monitoring

## Sending Emails to Gmail

While Resend is the recommended service (most reliable), you can configure it to send to Gmail addresses.

### Important Notes:

1. **Gmail may filter emails** - Resend's infrastructure helps avoid spam filters
2. **SPF/DKIM/DMARC** - If using your own domain, properly configure these DNS records
3. **Testing** - Send a test email first before going live

### Alternative: Using Gmail SMTP

If you prefer to use Gmail's own SMTP server:

1. Install `nodemailer`:
   ```bash
   npm install nodemailer
   ```

2. Enable "Less secure app access" or use App Passwords:
   - Google Account > Security > App passwords
   - Generate a 16-character password for your app

3. Add to `.env`:
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASSWORD=your-16-char-app-password
   PRAYER_EMAIL_RECIPIENTS=prayer-leader@gmail.com
   ```

4. Update server.js to use nodemailer instead of Resend

However, **Resend is recommended** because:
- Better deliverability
- Automatic spam filter optimization
- Email templates support
- Better analytics
- Less configuration needed

## Testing

### Test Email Sending

1. Fill out the Prayer AI form with email method
2. Check configured email inboxes
3. Monitor server logs for success/failure messages

### Server Logs

When email is sent, you'll see:
```
[EMAIL] Sending prayer request via email to: admin@yourdomain.com
[EMAIL] ✅ Email sent to admin@yourdomain.com: { id: 'msg_xxx' }
```

### Database Records

All prayer requests are logged to `prayer_requests` table with:
- `method: 'email'`
- `status: 'received'`
- Full prayer text and user details

## Troubleshooting

### "Email not configured" error

**Solution:** Check that both environment variables are set:
- `RESEND_API_KEY` is not empty
- `PRAYER_EMAIL_RECIPIENTS` has at least one email

### Emails not being received

1. Check spam/junk folder
2. Verify sender email is correct
3. Ensure emails are on verified sender list in Resend
4. Check server logs for errors
5. Verify recipients' email addresses are correct

### Authentication error

1. Verify `RESEND_API_KEY` is correct (should start with `re_`)
2. Check that key has not expired
3. Create a new key if needed

## Admin Dashboard

The Admin panel now shows:
- Prayer requests with method: SMS, WhatsApp, or Email
- Filter/sort by method
- View email status alongside other requests

## Frontend Changes

The Prayer AI page now includes:
- **📧 Email** button in method selection (Step 0)
- Responsive grid layout for 3 method options
- Same user flow for all methods

## Database Schema

The `prayer_requests` table was already designed to support any method:

```sql
method TEXT NOT NULL -- 'sms', 'whatsapp', or 'email'
```

No migration needed - email is natively supported.

## Security Notes

1. **No sensitive data in emails** - Only prayer request content, not API keys
2. **SMTP credentials in env** - Never commit `.env` to git
3. **Rate limiting** - Consider adding rate limiting if high volume expected
4. **User privacy** - Prayer requests are stored securely in Supabase with RLS

## Monitoring

Monitor email sending success:

1. **Server logs** - Check terminal for [EMAIL] messages
2. **Resend Dashboard** - View email delivery stats
3. **Database** - Query `prayer_requests` table, filter by `method = 'email'`

## Future Enhancements

Possible improvements:
- [ ] Email templates with styling
- [ ] Prayer confirmation email to user
- [ ] Weekly prayer digest email
- [ ] Email analytics dashboard
- [ ] Multiple reply-to addresses
- [ ] Automatic daily/weekly digests to prayer team

## Support

For issues:
1. Check Resend API key is valid
2. Verify email addresses are correct
3. Check server logs for detailed error messages
4. Review `.env` configuration
5. Test with simple prayer request first
