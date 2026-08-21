# Email Support Implementation - Visual Overview

## User Journey

```
Prayer AI Page Loads
    ↓
Step 0: Method Selection
├── 📱 SMS
├── 💬 WhatsApp  
└── 📧 Email [NEW]
    ↓ (user selects Email)
Step 1: Enter Name
    ↓
...
Step 4: Write Prayer
    ↓
Step 5: Confirmation & Send
├── 📧 Email/📱 SMS: Show Confirmation Screen ✅
└── 💬 WhatsApp: Redirect to +233 544 733 469 🔗
    ↓
Step 3: Enter Location
    ↓
Step 4: Write Prayer
    ↓
Step 5: Confirmation & Send
    ↓
    Email sent to prayer leaders ✅
```

## System Architecture

```
┌─────────────────────────────────────────┐
│         Prayer AI Frontend              │
│    (PrayerAI.tsx - React Component)     │
│                                         │
│  Method Selection:                      │
│  [📱 SMS] [💬 WhatsApp] [📧 Email]    │
└────────────────────┬────────────────────┘
                     │
                     │ POST /api/sendPrayer
                     ↓
┌─────────────────────────────────────────┐
│         Backend Server (Node.js)        │
│        (server.js - Express)            │
│                                         │
│  /api/sendPrayer endpoint               │
│  ├─ Validate input                      │
│  ├─ Save to Supabase                    │
│  └─ If method='email':                  │
│     └─ Send via Resend API              │
└────┬────────────────────────┬───────────┘
     │                        │
     ↓                        ↓
┌──────────────────┐   ┌──────────────────┐
│    Supabase      │   │     Resend       │
│   (Database)     │   │  (Email Service) │
│                  │   │                  │
│ prayer_requests  │   │ Sends HTML Email │
│ - Stores all     │   │ to Recipients    │
│   requests       │   │                  │
│ - method='email' │   │ Configured via:  │
│                  │   │ PRAYER_EMAIL_    │
│                  │   │ RECIPIENTS       │
└──────────────────┘   └──────────────────┘
                              ↓
                     ┌──────────────────────┐
                     │   Prayer Leaders     │
                     │   Email Inboxes      │
                     │ (Gmail, Outlook, etc)│
                     └──────────────────────┘
```

## Data Flow

```
USER INPUT
│
├─ name: "John Doe"
├─ phone: "0544733469"
├─ location: "Accra"
├─ prayer: "Please pray for..."
└─ method: "email"
    │
    ↓
SERVER PROCESSING
│
├─ Validate all fields
├─ Format phone (+233544733469)
├─ Save to prayer_requests table
├─ Create HTML email body
├─ Send via Resend API
└─ Return success response
    │
    ↓
EMAIL DELIVERY
│
├─ Recipient: admin@yourdomain.com
├─ Subject: "🙏 New Prayer Request from John Doe"
├─ Body: Formatted HTML with all details
└─ Sent via: Resend Infrastructure
    │
    ↓
RESULT
│
├─ ✅ Email delivered to inbox
├─ ✅ Prayer stored in database
├─ ✅ Admin can see in dashboard
└─ ✅ Can be tracked/managed
```

## Configuration Required

```
.env File
├─ RESEND_API_KEY
│  └─ Where: Resend Dashboard > API Keys
│  └─ Format: re_xxxxxxxxxxxxx
│  └─ Required: YES
│
├─ RESEND_FROM_EMAIL
│  └─ Where: Your domain name
│  └─ Format: noreply@yourdomain.com
│  └─ Required: YES
│  └─ Verified: Must be verified in Resend
│
└─ PRAYER_EMAIL_RECIPIENTS
   └─ Where: Your team email addresses
   └─ Format: email1@domain.com,email2@domain.com
   └─ Required: YES
   └─ Examples: 
      ├─ admin@church.com
      ├─ pastor@church.com
      └─ prayer-team@church.com
```

## Code Changes Overview

```
server.js (Main Implementation)
├─ Line 11: Import Resend
├─ Lines 40-42: Email configuration
├─ Lines 46-180: Updated /api/sendPrayer endpoint
│  ├─ Check if method === "email"
│  ├─ Format email HTML body
│  ├─ Send via resend.emails.send()
│  ├─ Handle success/failure
│  └─ Log all activity
└─ Backward compatible with SMS/WhatsApp

PrayerAI.tsx (Frontend Component)
├─ Line 14: Type update: add "email"
├─ Lines 248-280: Step 0 UI update
│  ├─ Changed to 3-button grid
│  ├─ Added Email button with 📧 icon
│  └─ Purple color scheme for Email
└─ Same validation & flow for all methods

api.ts (Type Definitions)
├─ PrayerRequestPayload.method
│  └─ "sms" | "whatsapp" | "email"
└─ Updated for TypeScript safety

Database (Supabase)
├─ No schema changes needed
├─ method field accepts any text
├─ Added index for performance
└─ Works with existing RLS policies
```

## Step-by-Step Setup

```
1. GET RESEND KEY (5 min)
   ↓
   resend.com → Sign Up → Create Key → Copy

2. UPDATE .env (2 min)
   ↓
   Add:
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=noreply@...
   PRAYER_EMAIL_RECIPIENTS=...

3. RESTART SERVER (1 min)
   ↓
   npm run server

4. TEST (2 min)
   ↓
   Prayer AI → Select Email → Submit → Check inbox

Total: ~10 minutes ⏱️
```

## Success Indicators

```
✅ Server logs show:
   [EMAIL] Sending prayer request via email to: admin@...
   [EMAIL] ✅ Email sent to admin@...: { id: 'msg_xxx' }

✅ User sees:
   "Prayer submitted successfully!"
   AI message: "Message sent successfully!"

✅ Database shows:
   SELECT * FROM prayer_requests 
   WHERE method = 'email'

✅ Prayer leader receives:
   Email with subject: "🙏 New Prayer Request from [Name]"
   Formatted HTML with all details

✅ Admin dashboard displays:
   Method column shows: EMAIL
```

## Fallback Behavior

```
If Email Service Not Configured:
│
├─ Prayer STILL saved to database ✅
├─ User sees warning message
├─ Admin can see in dashboard
├─ No errors thrown
└─ Can configure email later
   (existing prayers still available)

If Email Send Fails:
│
├─ Prayer STILL saved to database ✅
├─ Server returns 200 (success)
├─ Error logged for debugging
├─ Admin can retry later
└─ No impact on user experience
```

## Email HTML Template

```
Recipient receives:
┌────────────────────────────────────┐
│      🙏 New Prayer Request         │
│      from John Doe                 │
└────────────────────────────────────┘

Name: John Doe
Phone: +233544733469
Location: Accra, Ghana

─────────────────────────────────────

Prayer Request:

Please pray for my family's health.
We are going through a difficult time
and need God's intervention...

─────────────────────────────────────

Submitted via FHC Prayer Support System
```

## Monitoring & Maintenance

```
Daily Checks:
├─ Check email inbox for prayers
├─ Review server logs
└─ Verify Resend quota/usage

Weekly Review:
├─ Number of email submissions
├─ Delivery success rate
├─ Any configuration issues
└─ Update team on trends

Monthly:
├─ Analytics in Resend dashboard
├─ Database growth monitoring
├─ API key expiration status
└─ Cost analysis (if applicable)
```

## Important Notes

⚠️ **Security:**
- API key never exposed in frontend
- Emails stored securely in database
- RLS policies prevent unauthorized access
- No sensitive data in logs

🔒 **Privacy:**
- Prayer requests confidential
- Only configured recipients see emails
- No third-party access
- User data protected per privacy policy

⚡ **Performance:**
- Email sends asynchronously
- Database index for faster queries
- Minimal impact on prayer request speed
- Scales with team size

📧 **Deliverability:**
- Resend handles spam filter optimization
- SPF/DKIM configuration recommended
- ~98% delivery rate with proper setup
- Bounces handled automatically
