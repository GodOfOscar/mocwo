import dotenv from "dotenv";

// Load environment variables FIRST, before any other imports
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Supabase initialization
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://foojbihdxdoflfjnhfjf.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// WhAPI.cloud configuration
const WHAPI_TOKEN = process.env.WHAPI_TOKEN;
const WHAPI_PHONE_ID = process.env.WHAPI_PHONE_ID || process.env.LEADER_PHONE_NUMBER;
const WHAPI_BASE_URL = process.env.WHAPI_BASE_URL || "https://gate.whapi.cloud";
const LEADER_PHONE = process.env.LEADER_PHONE_NUMBER;

// Prayer request WhatsApp numbers (Ghana)
const PRAYER_WHATSAPP_NUMBERS = [
  "+233558117792",  // 055 811 7792
  "+233544733469",  // 0544 733469
  "+233593357615"   // 0593 357615
];

// Email configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const PRAYER_EMAIL_RECIPIENTS = (process.env.PRAYER_EMAIL_RECIPIENTS || "").split(",").filter(Boolean);
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Send prayer request via WhatsApp using WhAPI.cloud or Email using Resend
app.post("/sendPrayer", async (req, res) => {
  const { name, phone, location, prayer, method } = req.body;

  console.log("[PRAYER REQUEST] Received:", { name, phone, location, method });

  if (!name || !phone || !prayer) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Validate phone number format
  let formattedPhone = phone;
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "+233" + formattedPhone.substring(1);
  } else if (!formattedPhone.startsWith("+")) {
    formattedPhone = "+233" + formattedPhone;
  }

  const messageBody = `🙏 *New Prayer Request*

*Name:* ${name}
*Phone:* ${formattedPhone}
*Location:* ${location || "Not provided"}

*Prayer:*
${prayer}`;

  const emailBody = `
    <h2>🙏 New Prayer Request</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${formattedPhone}</p>
    <p><strong>Location:</strong> ${location || "Not provided"}</p>
    <hr/>
    <h3>Prayer Request:</h3>
    <p>${prayer.replace(/\n/g, "<br/>")}</p>
    <hr/>
    <p><em>Submitted via FHC Prayer Support System</em></p>
  `;

  try {
    // Save prayer to Supabase
    console.log("[DB] Saving prayer to Supabase...");
    const { error: dbError } = await supabase
      .from("prayer_requests")
      .insert([
        {
          name,
          phone: formattedPhone,
          location: location || null,
          prayer_text: prayer,
          method: method || "email",
          status: "received"
        }
      ]);

    if (dbError) {
      console.error("[DB ERROR]:", dbError);
      return res.status(500).json({ error: "Failed to save prayer", details: dbError.message });
    }
    console.log("[DB] ✅ Prayer saved to Supabase");

    // Send via Email if method is 'email'
    if (method === "email") {
      if (!resend || PRAYER_EMAIL_RECIPIENTS.length === 0) {
        console.warn("[WARNING] Email not configured (RESEND_API_KEY or PRAYER_EMAIL_RECIPIENTS missing)");
        return res.status(200).json({
          message: "Prayer saved successfully (Email sending not configured)",
          success: true,
          method: "email"
        });
      }

      console.log("[EMAIL] Sending prayer request via email to:", PRAYER_EMAIL_RECIPIENTS);
      const sentEmails = [];
      const failedEmails = [];

      for (const recipientEmail of PRAYER_EMAIL_RECIPIENTS) {
        try {
          const response = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "noreply@fhcprayer.com",
            to: recipientEmail.trim(),
            subject: `🙏 New Prayer Request from ${name}`,
            html: emailBody,
            replyTo: formattedPhone
          });

          console.log(`[EMAIL] ✅ Email sent to ${recipientEmail}:`, response);
          sentEmails.push({
            email: recipientEmail,
            id: response.id || "pending"
          });
        } catch (error) {
          console.error(`[EMAIL] ❌ Failed to send to ${recipientEmail}:`, error.message);
          failedEmails.push(recipientEmail);
        }
      }

      return res.status(200).json({
        message: "Prayer request sent via email",
        sentEmails,
        failedEmails: failedEmails.length > 0 ? failedEmails : undefined,
        success: true,
        method: "email"
      });
    }

    // Default: Send via WhatsApp
    if (!WHAPI_TOKEN) {
      console.warn("[WARNING] WHAPI_TOKEN not configured");
      return res.status(200).json({
        message: "Prayer saved successfully (WhatsApp sending not configured)",
        success: true,
        method: "whatsapp",
        recipientPhones: PRAYER_WHATSAPP_NUMBERS,
      });
    }

    // Send to all three prayer request numbers
    console.log("[WhAPI] Sending WhatsApp message to prayer team...");
    const sentMessages = [];
    const failedNumbers = [];

    for (const prayerNumber of PRAYER_WHATSAPP_NUMBERS) {
      const whatsappPhone = prayerNumber.replace("+", "");
      try {
        const response = await axios.post(
          `${WHAPI_BASE_URL}/messages/text`,
          {
            to: whatsappPhone,
            body: messageBody
          },
          {
            headers: {
              "Authorization": `Bearer ${WHAPI_TOKEN}`,
              "Content-Type": "application/json"
            }
          }
        );

        console.log(`[WhAPI] ✅ Message sent to ${prayerNumber}:`, response.data);
        sentMessages.push({
          number: prayerNumber,
          messageId: response.data?.messages?.[0]?.id || "pending"
        });
      } catch (error) {
        console.error(`[WhAPI] ❌ Failed to send to ${prayerNumber}:`, error.message);
        failedNumbers.push(prayerNumber);
      }
    }

    res.status(200).json({
      message: "Prayer request sent to prayer team",
      sentMessages,
      failedNumbers: failedNumbers.length > 0 ? failedNumbers : undefined,
      success: true,
      method: "whatsapp"
    });
  } catch (error) {
    console.error("[ERROR] Failed to process prayer request:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    // Still return 200 since prayer was saved to database
    res.status(200).json({
      message: "Prayer saved to database (notification sending failed)",
      error: error.response?.data?.message || error.message,
      success: true
    });
  }
});

app.post("/send-prayer-sms", async (req, res) => {
  const { name, phone, location, prayer } = req.body;

  if (!name || !phone || !prayer) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const messageBody = `
New Prayer Request 🙏

Name: ${name}
Phone: ${phone}
Location: ${location || "Not provided"}
Prayer: ${prayer}
`;

  try {
    await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.LEADER_PHONE_NUMBER,
    });

    return res.status(200).json({ message: "SMS sent successfully." });
  } catch (err) {
    console.error("Twilio Error:", err);
    return res.status(500).json({ error: "Failed to send SMS." });
  }
});

// WhAPI Webhook - Receive incoming WhatsApp messages
app.post("/webhook/whatsapp", async (req, res) => {
  const { messages, statuses } = req.body;

  console.log("[WhAPI WEBHOOK] Received webhook data");

  // Handle incoming messages
  if (messages && Array.isArray(messages)) {
    for (const message of messages) {
      const { from, text, image, document, _id, timestamp } = message;
      
      console.log(`[WhAPI] Message from ${from}:`, {
        text: text || "(media)",
        type: image ? "image" : document ? "document" : "text",
        id: _id,
        timestamp
      });
    }
  }

  // Handle delivery status updates
  if (statuses && Array.isArray(statuses)) {
    for (const status of statuses) {
      const { _id, status: deliveryStatus, timestamp } = status;
      
      console.log(`[WhAPI STATUS] Message ${_id}:`, deliveryStatus);

      if (deliveryStatus === "read" || deliveryStatus === "delivered") {
        await supabase
          .from("prayer_requests")
          .update({ status: "processed" })
          .eq("id", _id)
          .catch(err => console.error("Failed to update status:", err));
      }
    }
  }

  res.status(200).json({ success: true });
});

// Secure admin creation endpoint
app.post('/create-admin', async (req, res) => {
  const ADMIN_CREATION_KEY = process.env.ADMIN_CREATION_KEY;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const SUPABASE_URL = process.env.SUPABASE_URL;

  if (!ADMIN_CREATION_KEY) return res.status(500).json({ error: 'Server not configured for admin creation.' });

  const providedKey = req.headers['x-admin-key'] || req.body?.adminKey;
  if (!providedKey || providedKey !== ADMIN_CREATION_KEY) return res.status(403).json({ error: 'Forbidden' });

  if (!SERVICE_ROLE_KEY || !SUPABASE_URL) return res.status(500).json({ error: 'Supabase not configured on server.' });

  const { email, password, full_name } = req.body;
  if (!email || !password || !full_name) return res.status(400).json({ error: 'Missing required fields: email, password, full_name' });

  try {
    // 0) Check if admin already exists in admin_users
    const checkRes = await axios.get(
      `${SUPABASE_URL}/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}`,
      {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (Array.isArray(checkRes.data) && checkRes.data.length > 0) {
      return res.status(409).json({ error: 'Admin already exists' });
    }

    // 1) Try to create Supabase Auth user (admin), handle if already exists
    let userId = null;
    let createUserRes = null;
    try {
      createUserRes = await axios.post(
        `${SUPABASE_URL}/auth/v1/admin/users`,
        { email, password, email_confirm: true },
        {
          headers: {
            apikey: SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      userId = createUserRes.data?.id;
    } catch (authErr) {
      if (authErr.response?.data?.error_code === 'email_exists') {
        // User already exists, try to get their ID
        try {
          const authUsersRes = await axios.get(`${SUPABASE_URL}/auth/v1/admin/users`, {
            headers: {
              apikey: SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
            },
          });
          
          // Find user by email
          const users = Array.isArray(authUsersRes.data) ? authUsersRes.data : 
                       (authUsersRes.data?.users || []);
          const existingUser = users.find(u => u.email === email);
          if (existingUser) {
            userId = existingUser.id;
          } else {
            return res.status(500).json({ error: 'Could not find existing auth user' });
          }
        } catch (getErr) {
          return res.status(500).json({ error: 'Could not retrieve existing auth user', details: getErr.response?.data });
        }
      } else {
        return res.status(500).json({ error: 'Failed to create auth user', details: authErr.response?.data });
      }
    }

    // 3) Insert record into public.admin_users via Supabase REST
    const insertRes = await axios.post(
      `${SUPABASE_URL}/rest/v1/admin_users`,
      { email, password_hash: 'placeholder', full_name, role: 'admin', is_active: true },
      {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
      }
    );

    // 4) Try to update with auth_uid if the column exists
    try {
      await axios.patch(
        `${SUPABASE_URL}/rest/v1/admin_users?id=eq.${insertRes.data[0].id}`,
        { auth_uid: userId },
        {
          headers: {
            apikey: SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (updateErr) {
      console.log('Could not update auth_uid, column may not exist yet');
    }

    return res.status(201).json({ message: 'Admin created', user: createUserRes.data, admin_row: insertRes.data });
  } catch (err) {
    console.error('Error creating admin:', err?.response?.data || err.message || err);
    return res.status(500).json({ error: 'Failed to create admin', details: err?.response?.data || err.message });
  }
});

// Verify if a user is an admin (bypass RLS)
app.post('/verify-admin', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Query admin_users using service role key (bypasses RLS)
    const checkRes = await axios.get(
      `${SUPABASE_URL}/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}&select=*`,
      {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (Array.isArray(checkRes.data) && checkRes.data.length > 0) {
      const adminUser = checkRes.data[0];
      
      // Verify admin meets all criteria
      if (adminUser.is_active === true && adminUser.role === 'admin') {
        return res.status(200).json({ 
          isAdmin: true, 
          admin: {
            email: adminUser.email,
            fullName: adminUser.full_name,
            role: adminUser.role,
            isActive: adminUser.is_active
          }
        });
      } else {
        return res.status(403).json({ 
          isAdmin: false, 
          error: 'User exists but is not an active admin',
          details: {
            role: adminUser.role,
            isActive: adminUser.is_active
          }
        });
      }
    } else {
      return res.status(403).json({ isAdmin: false, error: 'User not found in admin records' });
    }
  } catch (err) {
    console.error('Error verifying admin:', err?.response?.data || err.message || err);
    return res.status(500).json({ error: 'Failed to verify admin', details: err?.response?.data || err.message });
  }
});

// Create Libeté Pay checkout session (simple redirect-based flow)
app.post('/create-expresspay-transaction', async (req, res) => {
  const { amount, currency, email, phone, reference, channels, metadata = {} } = req.body;
  const MERCHANT = process.env.LIBERTEPAY_MERCHANT_ID || process.env.EXPRESSPAY_MERCHANT_ID || process.env.VITE_EXPRESSPAY_MERCHANT_ID;
  const API_KEY = process.env.LIBERTEPAY_SECRET_KEY || process.env.EXPRESSPAY_API_KEY || process.env.VITE_EXPRESSPAY_API_KEY;
  const CHECKOUT_BASE = process.env.LIBERTEPAY_CHECKOUT_URL || process.env.EXPRESSPAY_CHECKOUT_URL || process.env.VITE_EXPRESSPAY_CHECKOUT_URL || 'https://checkout.libertepay.com';
  const provider = metadata.provider || 'libertepay';

  if (!MERCHANT || !API_KEY) {
    return res.status(500).json({ error: 'Libeté Pay not configured on server' });
  }

  const params = new URLSearchParams({
    merchant_id: MERCHANT,
    amount: String(amount || 0),
    currency: currency || 'GHS',
    ref: reference || 'ref',
    email: email || '',
    phone: phone || '',
    provider,
    channel: Array.isArray(channels) && channels.length ? channels[0] : 'card',
  });

  const checkoutUrl = `${CHECKOUT_BASE}?${params.toString()}`;

  return res.status(200).json({ checkoutUrl, reference: reference || null, provider });
});

export default app;
