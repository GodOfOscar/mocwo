// server.js
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import notificationRoutes from "../routes/notifications.js"; // adjust path if needed

// Load environment variables first
dotenv.config();

// ✅ Validate essential environment variables
if (!process.env.SUPABASE_URL) {
  console.error("❌ Missing SUPABASE_URL");
  process.exit(1);
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
console.log("✅ Environment variables loaded");
console.log("🔑 SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("🔑 SUPABASE_SERVICE_ROLE_KEY starts with:", process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + "...");

// Express setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Register notification routes
app.use("/api/notifications", notificationRoutes);

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// WhAPI.cloud configuration
const WHAPI_TOKEN = process.env.WHAPI_TOKEN;
const WHAPI_BASE_URL = process.env.WHAPI_BASE_URL || "https://gate.whapi.cloud";
const PRAYER_WHATSAPP_NUMBERS = [
  "+233558117792",
  "+233544733469",
  "+233593357615"
];

// Email configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const PRAYER_EMAIL_RECIPIENTS = (process.env.PRAYER_EMAIL_RECIPIENTS || "").split(",").filter(Boolean);
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// ------------------ Endpoints ------------------

// Send prayer request (WhatsApp or Email)
app.post("/api/sendPrayer", async (req, res) => {
  const { name, phone, location, prayer, method } = req.body;

  if (!name || !phone || !prayer) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  let formattedPhone = phone.startsWith("0") ? "+233" + phone.slice(1) : phone.startsWith("+") ? phone : "+233" + phone;
  const messageBody = `🙏 New Prayer Request\nName: ${name}\nPhone: ${formattedPhone}\nLocation: ${location || "Not provided"}\nPrayer:\n${prayer}`;

  try {
    // Save to Supabase
    const { error: dbError } = await supabase.from("prayer_requests").insert([{
      name,
      phone: formattedPhone,
      location: location || null,
      prayer_text: prayer,
      method: method || "email",
      status: "received"
    }]);
    if (dbError) throw dbError;

    // Send via email
    if (method === "email") {
      if (!resend || PRAYER_EMAIL_RECIPIENTS.length === 0) {
        return res.json({ success: true, message: "Prayer saved (Email not configured)", method: "email" });
      }

      const sentEmails = [];
      for (const recipient of PRAYER_EMAIL_RECIPIENTS) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "noreply@fhcprayer.com",
            to: recipient,
            subject: `🙏 New Prayer Request from ${name}`,
            html: `<p>${messageBody.replace(/\n/g, "<br/>")}</p>`,
          });
          sentEmails.push(recipient);
        } catch (err) {
          console.error("Email send failed for", recipient, err.message);
        }
      }
      return res.json({ success: true, message: "Prayer request sent via email", sentEmails });
    }

    // Send via WhatsApp
    if (!WHAPI_TOKEN) return res.json({ success: true, message: "Prayer saved (WhatsApp not configured)" });

    const sentMessages = [];
    for (const num of PRAYER_WHATSAPP_NUMBERS) {
      try {
        await axios.post(
          `${WHAPI_BASE_URL}/messages/text`,
          { to: num.replace("+", ""), body: messageBody },
          { headers: { Authorization: `Bearer ${WHAPI_TOKEN}`, "Content-Type": "application/json" } }
        );
        sentMessages.push(num);
      } catch (err) {
        console.error("WhatsApp send failed for", num, err.message);
      }
    }

    return res.json({ success: true, message: "Prayer request sent via WhatsApp", sentMessages });

  } catch (error) {
    console.error("Failed to send prayer request:", error.message || error);
    return res.status(500).json({ success: false, error: error.message || error });
  }
});

// ------------------ Admin verification ------------------
app.post("/api/verify-admin", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: "Email is required" });

  try {
    const response = await axios.get(
      `${process.env.SUPABASE_URL}/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}&select=*`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json"
        },
      }
    );

    if (response.data.length > 0) {
      const admin = response.data[0];
      if (admin.role === "admin" && admin.is_active === true) {
        return res.json({ success: true, isAdmin: true, admin });
      }
    }

    return res.status(403).json({ success: false, isAdmin: false, error: "Not an admin" });

  } catch (error) {
    console.error("VERIFY ADMIN ERROR:", error.response?.data || error.message);
    return res.status(500).json({ success: false, error: "Server error", details: error.response?.data || error.message });
  }
});

// ------------------ Create Admin User ------------------
app.post("/api/create-admin", async (req, res) => {
  const { email, password, full_name } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ success: false, error: "Missing required fields: email, password, full_name" });
  }

  try {
    // 1. Create Supabase Auth user
    console.log(`[ADMIN] Creating auth user for ${email}...`);
    const authResponse = await axios.post(
      `${process.env.SUPABASE_URL}/auth/v1/admin/users`,
      {
        email,
        password,
        email_confirm: true
      },
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const userId = authResponse.data.id;
    console.log(`[ADMIN] ✅ Auth user created with ID: ${userId}`);

    // 2. Update admin_users table to link auth user
    console.log(`[ADMIN] Linking admin user to auth ID...`);
    const { error: updateError } = await supabase
      .from("admin_users")
      .update({ auth_uid: userId })
      .eq("email", email);

    if (updateError) {
      console.warn(`[ADMIN] Warning: Could not update auth_uid: ${updateError.message}`);
    } else {
      console.log(`[ADMIN] ✅ Admin user linked to auth`);
    }

    return res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      admin: {
        email,
        full_name,
        auth_uid: userId,
        role: "admin",
        is_active: true
      }
    });

  } catch (error) {
    console.error("[ADMIN] ERROR:", error.response?.data || error.message);
    
    // Check if user already exists
    if (error.response?.status === 422 && error.response?.data?.error_code === "user_already_exists") {
      return res.status(409).json({
        success: false,
        error: "Admin user already exists with this email"
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to create admin user",
      details: error.response?.data || error.message
    });
  }
});

// ------------------ Start server ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Prayer SMS server running on port ${PORT}`));