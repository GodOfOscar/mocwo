## Email Configuration - Environment Variables

Copy and paste these lines into your `.env` file to enable email support for prayer requests.

### Required Variables

```env
# ============================================
# EMAIL CONFIGURATION (Resend)
# ============================================

# Your Resend API key
# Get this from: https://resend.com/api-keys
# Format should be: re_xxxxxxxxxxxx
RESEND_API_KEY=re_your_api_key_here

# The sender email address (must be verified in Resend)
# Examples: noreply@church.com, prayers@church.com, admin@yourdomain.com
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Comma-separated list of email addresses that receive prayer requests
# Can add as many as needed, separated by commas (no spaces)
PRAYER_EMAIL_RECIPIENTS=admin@yourdomain.com,pastor@yourdomain.com,prayer@yourdomain.com
```

### Example Configurations

#### Example 1: Single Church Admin
```env
RESEND_API_KEY=re_abc123def456ghi789jkl
RESEND_FROM_EMAIL=noreply@church.com
PRAYER_EMAIL_RECIPIENTS=pastor@church.com
```

#### Example 2: Multiple Prayer Leaders
```env
RESEND_API_KEY=re_xyz789abc456def123ghi
RESEND_FROM_EMAIL=prayers@ministries.org
PRAYER_EMAIL_RECIPIENTS=bishop@ministries.org,pastor1@ministries.org,pastor2@ministries.org,prayer.coordinator@ministries.org
```

#### Example 3: Both Church and Personal
```env
RESEND_API_KEY=re_123abc456def789ghi
RESEND_FROM_EMAIL=noreply@fhc.org
PRAYER_EMAIL_RECIPIENTS=admin@fhc.org,personal@example.com,backup@example.com
```

### Step-by-Step Setup

1. **Go to Resend Dashboard:**
   - Visit https://resend.com
   - Sign in to your account

2. **Get API Key:**
   - Click "API Keys" or "Settings"
   - Click "Create API Key" or copy existing key
   - Copy the full key (starts with `re_`)

3. **Verify Sender Email:**
   - Go to "Domains" or "From Addresses"
   - Add your sending email (e.g., noreply@church.com)
   - Complete verification process
   - Wait for verification (usually instant)

4. **Add to .env File:**
   ```
   Open .env in your editor
   Add the three lines above
   Replace:
   - RESEND_API_KEY with your actual key
   - RESEND_FROM_EMAIL with your verified email
   - PRAYER_EMAIL_RECIPIENTS with your team's emails
   Save the file
   ```

5. **Restart Server:**
   ```bash
   npm run server
   ```

### Verification Checklist

- [ ] RESEND_API_KEY starts with "re_"
- [ ] RESEND_FROM_EMAIL is verified in Resend
- [ ] PRAYER_EMAIL_RECIPIENTS has at least one valid email
- [ ] No spaces around commas in recipient list
- [ ] All email addresses are correct
- [ ] File is saved
- [ ] Server restarted

### Format Requirements

**RESEND_API_KEY:**
- Must start with `re_`
- Usually 30+ characters long
- Should not have spaces or quotes

**RESEND_FROM_EMAIL:**
- Valid email format (user@domain.com)
- Must be verified in Resend dashboard
- Common examples:
  - noreply@yourdomain.com
  - prayers@yourdomain.com
  - admin@yourdomain.com

**PRAYER_EMAIL_RECIPIENTS:**
- Comma-separated (email1@domain.com,email2@domain.com)
- No spaces around commas
- No extra spaces at end
- Each email must be valid format

### What NOT to Do

❌ Don't add quotes: `RESEND_API_KEY="re_..."` ← Wrong
✅ Do this: `RESEND_API_KEY=re_...` ← Correct

❌ Don't add spaces: `PRAYER_EMAIL_RECIPIENTS=admin@x.com , pastor@x.com` ← Wrong
✅ Do this: `PRAYER_EMAIL_RECIPIENTS=admin@x.com,pastor@x.com` ← Correct

❌ Don't forget to restart server after changes ← Wrong
✅ Always restart: `npm run server` ← Correct

### Troubleshooting

**"Email not configured" Error:**
- Verify RESEND_API_KEY is not empty
- Verify PRAYER_EMAIL_RECIPIENTS has at least one email
- Restart server: `npm run server`

**Email not received:**
- Check PRAYER_EMAIL_RECIPIENTS spelling
- Verify email addresses are correct
- Check spam folder
- Verify Resend account has quota remaining

**Authentication error:**
- Confirm RESEND_API_KEY starts with "re_"
- Get a new key from Resend if needed
- Verify no extra spaces or characters

**Can't find Resend dashboard:**
- Visit https://resend.com/dashboard
- Log in with your email
- Click "API Keys" section

### Support

For Resend support: https://resend.com/docs
For this implementation: See EMAIL_SETUP.md

### Default Values (if not configured)

If you don't add these variables:
- Email method will show "not configured" error
- Prayer requests still save to database
- Other methods (SMS, WhatsApp) continue working
- You can add email support later

### Quick Copy-Paste Template

```
RESEND_API_KEY=
RESEND_FROM_EMAIL=
PRAYER_EMAIL_RECIPIENTS=
```

Just fill in the values after the `=` signs.

### Example Fully Populated .env

```env
# ============================================
# DATABASE
# ============================================
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyxxx
SUPABASE_SERVICE_KEY=eyxxx

# ============================================
# WHATSAPP (WhAPI)
# ============================================
WHAPI_TOKEN=xxxxx
LEADER_PHONE_NUMBER=+233xxxxx

# ============================================
# EMAIL (Resend) - NEW
# ============================================
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@church.com
PRAYER_EMAIL_RECIPIENTS=pastor@church.com,admin@church.com

# ============================================
# OTHER SERVICES
# ============================================
VITE_EXPRESSPAY_MERCHANT_ID=
VITE_EXPRESSPAY_API_KEY=
VITE_EXPRESSPAY_CHECKOUT_URL=
```

---

**Remember**: After editing .env, restart your server for changes to take effect!

```bash
# Stop the current server (Ctrl+C)
# Then run:
npm run server
```
