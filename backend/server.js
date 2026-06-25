import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import ws from "ws";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

import notificationRoutes from "./routes/notifications.js";

dotenv.config();

// Initialize Supabase client for backend operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY,
  {
    realtime: {
      transport: ws,
    },
  }
);

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins in development, restrict in production
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = [
        "https://mocwo.org",
        "https://mocwo.onrender.com",
        "https://mocwo-1.onrender.com",
      ];
      const vercelOriginPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

      if (!origin || allowedOrigins.includes(origin) || vercelOriginPattern.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    } else {
      // Allow all origins in development
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
} else {
  console.warn(`⚠️ Frontend build not found at ${distPath}. SPA routes will not be served from Express.`);
}

// ✅ ROUTES
app.use("/api/notifications", notificationRoutes);

// ✅ HEALTH CHECK (ADD THIS)
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running 🚀" });
});

// ✅ ROOT ROUTE (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.json({ success: true, message: "MOCWO API is live" });
});

const isAdminSettingsTableMissingError = (error) => {
  const message = error?.message || error?.msg || error?.error || "";
  return (
    error?.code === "PGRST205" ||
    /Could not find the table\s+'(?:public\.)?admin_settings'/i.test(message) ||
    /relation .*admin_settings does not exist/i.test(message)
  );
};

// Connectivity check at startup
supabase.from("admin_settings").select("key").limit(1).then(({ error }) => {
  if (error) {
    if (isAdminSettingsTableMissingError(error)) {
      console.warn("⚠️  Supabase schema check passed, but admin_settings is missing. Run the missing migration to create it.");
    } else {
      console.error("⚠️  Supabase connectivity check failed:", error.message);
      console.error("💡 Check your SUPABASE_URL and internet connection.");
    }
  } else {
    console.log("📡 Supabase connection verified");
  }
});

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

// Robust System Logger
const logSystemEvent = async (level, action, details, email = "system") => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${action}:`, details);

  try {
    await supabase.from("admin_activity_log").insert([{
      admin_email: email,
      action: action,
      details: typeof details === 'object' ? JSON.stringify(details) : details
    }]);
  } catch (err) {
    console.error(`[CRITICAL] Failed to write to Supabase log:`, err.message);
  }
};

const logAdminActivity = (email, action, details) => logSystemEvent("info", action, details, email);

// NEW: Middleware to check admin page access
const checkAdminPageAccess = async (req, res, next) => {
  // Extract the page key from the request path (e.g., 'admin-events' from '/api/admin-events')
  const pageKey = req.path.split('/')[2]; // Assuming path is like /api/admin-events

  // Admin dashboard and master admin are always accessible
  if (!pageKey || pageKey === 'admin' || pageKey === 'admin-master') {
    return next();
  }

  try {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "admin_page_access")
      .maybeSingle();

    if (error) {
      if (isAdminSettingsTableMissingError(error)) {
        console.warn("⚠️ admin_settings table is missing. Admin page access check is bypassed until migration is applied.");
        return next();
      }
      console.error("Error fetching admin page access settings:", error.message);
      return res.status(500).json({ success: false, error: "Server error checking page access" });
    }

    const accessSettings = data?.value ? JSON.parse(data.value) : {};
    if (accessSettings[pageKey] === false) {
      return res.status(403).json({ success: false, error: "Access to this admin page is currently disabled." });
    }
    next();
  } catch (err) {
    console.error("Error in checkAdminPageAccess middleware:", err.message);
    res.status(500).json({ success: false, error: "Server error checking page access" });
  }
};

// Middleware to check for maintenance mode
app.use(async (req, res, next) => {
  // Allow access to admin API routes even during maintenance
  // This is crucial for the admin panel to function and allow turning off maintenance mode
  if (req.path.startsWith('/api/admin') || req.path === '/api/status') {
    return next();
  }

  try {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "maintenance_mode")
      .maybeSingle();

    if (error) {
      console.error("Error fetching maintenance mode setting:", error.message);
      // If we can't fetch the setting, assume not in maintenance to avoid locking out
      return next();
    }

    if (data?.value === 'true') {
      // If maintenance mode is on, respond with 503
      return res.status(503).json({ message: "Site is currently under maintenance. Please check back later." });
    }
  } catch (err) {
    console.error("Error in maintenance mode middleware:", err.message);
    // If any error occurs in middleware, proceed to avoid blocking legitimate requests
  }
  next();
});

// Apply the new middleware to all admin routes except the main admin dashboard and master admin
app.use('/api/admin-partnerships', checkAdminPageAccess);
app.use('/api/admin-memberships', checkAdminPageAccess);
app.use('/api/admin-prayers', checkAdminPageAccess);
app.use('/api/admin-news', checkAdminPageAccess);
app.use('/api/admin-resources', checkAdminPageAccess);
app.use('/api/admin-media-files', checkAdminPageAccess);
app.use('/api/admin-services', checkAdminPageAccess);
app.use('/api/admin-events', checkAdminPageAccess);
app.use('/api/admin-devotionals', checkAdminPageAccess);
app.use('/api/admin-carousel', checkAdminPageAccess);


// Endpoint to check maintenance status (accessible during maintenance)
app.get("/api/status", async (req, res) => {
  try {
    const { data, error } = await supabase.from("admin_settings").select("value").eq("key", "maintenance_mode").maybeSingle();
    if (error) throw error;
    return res.json({ success: true, maintenanceMode: data?.value === 'true' });
  } catch (err) {
    console.error("Error in /api/status:", err.message || err);
    if (isAdminSettingsTableMissingError(err)) {
      return res.status(500).json({
        success: false,
        error: "Supabase table admin_settings is missing. Run the migration to create it."
      });
    }
    const isConnectionError = err.message?.includes('fetch failed');
    return res.status(500).json({ 
      success: false, 
      error: isConnectionError ? "Database connection error (fetch failed)" : "Server error" 
    });
  }
});

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
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;

    if (admin && admin.role === "admin" && admin.is_active === true) {
      return res.json({ success: true, isAdmin: true, admin });
    }

    return res.status(403).json({ success: false, isAdmin: false, error: "Not an admin" });

  } catch (error) {
    const message = error.response?.data || error.message || error;
    console.error("VERIFY ADMIN ERROR:", message);
    return res.status(500).json({ success: false, error: "Server error", details: message });
  }
});

// ------------------ Admin login proxy ------------------
app.post("/api/admin-login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Missing email or password" });
  }

  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!anonKey) {
    console.error("ADMIN LOGIN ERROR: missing Supabase anon key");
    return res.status(500).json({ success: false, error: "Supabase anon key not configured" });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (!data?.session) {
      console.error("ADMIN LOGIN ERROR: login succeeded but no session was returned", data);
      return res.status(500).json({ success: false, error: "Login succeeded but no session tokens were returned." });
    }

    return res.json({
      success: true,
      data: {
        ...data.session,
        user: data.user,
      },
    });
  } catch (error) {
    const message = error.message || "Login failed";
    console.error("ADMIN LOGIN ERROR:", message);
    
    // Differentiate network failures (500) from authentication failures (401)
    const status = message.includes('fetch failed') ? 500 : 401;
    return res.status(status).json({ success: false, error: message });
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
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) throw authError;
    const userId = authUser.user.id;
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

    await logAdminActivity("system", "CREATE_ADMIN", `Created admin: ${email} (${full_name})`);

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

// ------------------ Admin Activity Logs ------------------
app.get("/api/admin/logs", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("admin_activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/admin/log-action", async (req, res) => {
  const { email, action, details } = req.body;
  await logAdminActivity(email || "unknown", action, details);
  res.json({ success: true });
});

// ------------------ System Settings (Master Password) ------------------
app.get("/api/admin/settings/:key", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", req.params.key)
      .maybeSingle();
    
    if (error) throw error;
    res.json({ success: true, value: data?.value });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/admin/settings", async (req, res) => {
  const { key, value } = req.body;
  try {
    const { error } = await supabase.from("admin_settings").upsert({ key, value });
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// NEW: Endpoints for Admin Page Access settings
app.get("/api/admin/page-access", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "admin_page_access")
      .maybeSingle();
    
    if (error) throw error;
    res.json({ success: true, settings: data?.value ? JSON.parse(data.value) : {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/admin/page-access", async (req, res) => {
  const { settings } = req.body; // settings should be a JSON object
  try {
    const { error } = await supabase.from("admin_settings").upsert({ key: "admin_page_access", value: JSON.stringify(settings) });
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// SMS Sender Function using MNOTIFY
const sendSMSViaMMNotify = async (phoneNumber, message) => {
  const MNOTIFY_API_KEY = process.env.MNOTIFY_API_KEY;
  const MNOTIFY_SENDER_ID = process.env.MNOTIFY_SENDER_ID || "MOCWO";

  if (!MNOTIFY_API_KEY) {
    console.warn("⚠️ MNOTIFY_API_KEY is not configured. SMS will not be sent.");
    return { success: false, error: "SMS service not configured" };
  }

  try {
    const response = await fetch("https://api.mnotify.com/api/sms/quick", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: MNOTIFY_API_KEY,
        to: phoneNumber,
        msg: message,
        sender_id: MNOTIFY_SENDER_ID,
      }),
    });

    const result = await response.json();
    
    if (result.code === "ok" || result.status === "success") {
      console.log(`✓ SMS sent to ${phoneNumber}`);
      return { success: true, message: result.message };
    } else {
      console.error(`✗ MNOTIFY SMS Error: ${result.message || "Unknown error"}`);
      return { success: false, error: result.message || "Failed to send SMS" };
    }
  } catch (error) {
    console.error("MNOTIFY Request Error:", error.message);
    return { success: false, error: error.message };
  }
};

// Event Registration Endpoint
app.post("/api/events/register", async (req, res) => {
  const {
    event_id,
    event_name,
    full_name,
    email,
    phone,
    location,
    school,
    gender,
    notes,
  } = req.body;

  // Validate required fields
  if (!event_id || !event_name || !full_name || !email || !phone || !school) {
    return res.status(400).json({
      success: false,
      error: "Missing required registration fields (event_id, event_name, full_name, email, phone, school)",
    });
  }

  try {
    // Check for existing registration by email
    if (email) {
      const { count: emailCount, error: emailErr } = await supabase
        .from("event_registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", event_id)
        .eq("email", email);

      if (emailErr) throw emailErr;
      if ((emailCount || 0) > 0) {
        return res.status(400).json({
          success: false,
          error: "You have already registered for this event using the same email address.",
        });
      }
    }

    // Check for existing registration by phone
    if (phone) {
      const { count: phoneCount, error: phoneErr } = await supabase
        .from("event_registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", event_id)
        .eq("phone", phone);

      if (phoneErr) throw phoneErr;
      if ((phoneCount || 0) > 0) {
        return res.status(400).json({
          success: false,
          error: "You have already registered for this event using the same phone number.",
        });
      }
    }

    // Insert registration into Supabase
    const { error: insertError, data } = await supabase
      .from("event_registrations")
      .insert([
        {
          event_id,
          event_name,
          full_name,
          email,
          phone,
          location,
          school,
          gender,
          notes,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // Send SMS confirmation
    const smsMessage = `Hi ${full_name}, thank you for registering for ${event_name}! We're excited to have you. You'll receive more details soon. - MOCWO`;
    const smsResult = await sendSMSViaMMNotify(phone, smsMessage);

    // Log SMS status but don't fail the registration if SMS fails
    if (!smsResult.success) {
      console.warn(`⚠️ SMS notification failed for ${phone}, but registration was successful.`);
    }

    return res.json({
      success: true,
      data,
      sms_sent: smsResult.success,
      message: "Registration successful! You will receive an SMS confirmation shortly.",
    });
  } catch (error) {
    console.error("EVENT REGISTRATION ERROR:", error.message || error);
    return res.status(500).json({
      success: false,
      error: error.message || "Unable to process registration",
    });
  }
});

// Admin Events CRUD endpoints (service-role authenticated)
app.get('/api/admin-events', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (error) {
    console.error('ADMIN EVENTS FETCH ERROR:', error.message || error);
    return res.status(500).json({ success: false, error: error.message || 'Unable to fetch events' });
  }
});

app.post('/api/admin-events', async (req, res) => {
  const {
    title,
    description,
    start_date,
    end_date,
    location,
    event_type,
    image_url,
    registration_link,
    is_active,
  } = req.body;

  if (!title || !start_date || !location) {
    return res.status(400).json({ success: false, error: 'Title, start date, and location are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .insert([{ title, description, start_date, end_date, location, event_type, image_url, registration_link, is_active }])
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (error) {
    console.error('ADMIN EVENTS CREATE ERROR:', error.message || error);
    return res.status(500).json({ success: false, error: error.message || 'Unable to create event' });
  }
});

app.put('/api/admin-events/:id', async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    start_date,
    end_date,
    location,
    event_type,
    image_url,
    registration_link,
    is_active,
  } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, error: 'Event ID is required.' });
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .update({ title, description, start_date, end_date, location, event_type, image_url, registration_link, is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (error) {
    console.error('ADMIN EVENTS UPDATE ERROR:', error.message || error);
    return res.status(500).json({ success: false, error: error.message || 'Unable to update event' });
  }
});

app.get('/api/admin-events/registrations', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (error) {
    console.error('ADMIN EVENT REGISTRATIONS FETCH ERROR:', error.message || error);
    return res.status(500).json({ success: false, error: error.message || 'Unable to fetch registrations' });
  }
});

app.delete('/api/admin-events/registrations', async (req, res) => {
  const { ids, event_name } = req.body;

  if ((!ids || ids.length === 0) && !event_name) {
    return res.status(400).json({ success: false, error: 'Provide ids or event_name to delete registrations.' });
  }

  try {
    let query = supabase.from('event_registrations').delete();

    if (ids && ids.length > 0) {
      query = query.in('id', ids);
    } else if (event_name) {
      query = query.eq('event_name', event_name);
    }

    const { error } = await query;
    if (error) throw error;

    return res.json({ success: true });
  } catch (error) {
    console.error('ADMIN EVENT REGISTRATIONS DELETE ERROR:', error.message || error);
    return res.status(500).json({ success: false, error: error.message || 'Unable to delete registrations' });
  }
});

app.delete('/api/admin-events/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, error: 'Event ID is required.' });
  }

  try {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    console.error('ADMIN EVENTS DELETE ERROR:', error.message || error);
    return res.status(500).json({ success: false, error: error.message || 'Unable to delete event' });
  }
});

// JSON parse error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logSystemEvent("warn", "JSON_PARSE_ERROR", { message: err.message, path: req.path });
    return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
  }
  next(err);
});

// Global Error Handler (Must be last middleware)
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const errorDetails = {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    path: req.originalUrl,
    method: req.method,
    body: req.body
  };

  logSystemEvent("error", "UNCAUGHT_EXPRESS_ERROR", errorDetails);

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
});

// Serve SPA for non-API GET routes when frontend build exists
app.get(/^(?!\/api).*/, (req, res) => {
  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(404).json({ success: false, error: `Cannot ${req.method} ${req.originalUrl}` });
});

// API 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Cannot ${req.method} ${req.originalUrl}` });
});

// ------------------ Start server ------------------
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`✅ Prayer SMS server running on port ${PORT}`));

// Handle crashes outside of Express
process.on("unhandledRejection", (reason, promise) => {
  logSystemEvent("critical", "UNHANDLED_REJECTION", { reason: reason?.message || reason });
});

process.on("uncaughtException", (err) => {
  logSystemEvent("critical", "UNCAUGHT_EXCEPTION", { message: err.message, stack: err.stack });
  // Give the server time to log before exiting
  setTimeout(() => process.exit(1), 1000);
});

