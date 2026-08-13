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
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!process.env.SUPABASE_URL) {
  console.error("🚨 Missing SUPABASE_URL environment variable. Backend cannot connect to Supabase.");
}
if (!SUPABASE_KEY) {
  console.error("🚨 Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY environment variable. Backend cannot bypass RLS.");
}
const supabase = createClient(
  process.env.SUPABASE_URL,
  SUPABASE_KEY,
  {
    realtime: {
      transport: ws,
    },
  }
);

const app = express();

const allowedOrigins = [
  "https://mocwo.org",
  "https://mocwo.onrender.com",
  "https://mocwo-1.onrender.com",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
];
const vercelOriginPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;
const localhostOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?\/?$/i;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/$/, "");
  if (allowedOrigins.includes(normalizedOrigin) || vercelOriginPattern.test(normalizedOrigin)) {
    return true;
  }

  if (localhostOriginPattern.test(normalizedOrigin)) {
    return true;
  }

  try {
    const { hostname } = new URL(normalizedOrigin);
    // Allow localhost and common private IP ranges (for development)
    if (["localhost", "127.0.0.1", "0.0.0.0"].includes(hostname)) {
      return true;
    }
    // Allow private IP ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x)
    const ip = hostname;
    if (/^10\.\d+\.\d+\.\d+$/.test(ip)) return true; // 10.0.0.0/8
    if (/^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(ip)) return true; // 172.16.0.0/12
    if (/^192\.168\.\d+\.\d+$/.test(ip)) return true; // 192.168.0.0/16
    return false;
  } catch {
    return false;
  }
};

app.use(cors({
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      console.warn("⚠️ CORS origin rejected:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Middleware to handle payload-too-large errors from body parsers
app.use((err, req, res, next) => {
  if (err && (err.type === 'entity.too.large' || err.status === 413)) {
    console.error('Payload too large for request', { path: req.path, size: req.headers['content-length'] });
    return res.status(413).json({ success: false, error: 'Payload too large. Try uploading smaller files or use the admin upload with reduced file sizes.' });
  }
  next(err);
});

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
  const mountedBase = req.baseUrl || req.originalUrl || req.path || "";
  const pageKey = mountedBase
    .replace(/^\/api\//, "")
    .replace(/^\//, "")
    .split('/')[0];

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

    let accessSettings = {};
    if (data?.value) {
      try {
        accessSettings = JSON.parse(data.value);
      } catch {
        accessSettings = {};
      }
    }

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
const requireSupabaseServiceKey = (req, res, next) => {
  if (!process.env.SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Supabase not configured for admin operation:', { path: req.originalUrl });
    return res.status(500).json({ success: false, error: 'Supabase not configured on server. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.' });
  }
  next();
};

app.use('/api/admin-partnerships', requireSupabaseServiceKey, checkAdminPageAccess);
app.use('/api/admin-memberships', requireSupabaseServiceKey, checkAdminPageAccess);
app.use('/api/admin-prayers', requireSupabaseServiceKey, checkAdminPageAccess);
app.use('/api/admin-news', requireSupabaseServiceKey, checkAdminPageAccess);
app.use('/api/admin-resources', requireSupabaseServiceKey, checkAdminPageAccess);
app.use('/api/admin-media-files', requireSupabaseServiceKey, checkAdminPageAccess);
app.use('/api/admin-services', requireSupabaseServiceKey, checkAdminPageAccess);
app.use('/api/admin-events', requireSupabaseServiceKey, checkAdminPageAccess);
app.use('/api/admin-devotionals', requireSupabaseServiceKey, checkAdminPageAccess);
app.use('/api/admin-carousel', requireSupabaseServiceKey, checkAdminPageAccess);
app.use('/api/admin-testimonials', requireSupabaseServiceKey, checkAdminPageAccess);

const normalizeMonth = (value) => String(value || "").trim().toLowerCase();
const validateMonth = (month) => /^[a-z0-9-_]+$/.test(month);

const getStoragePublicUrl = async (bucket, path) => {
  const { data, error } = await supabase.storage.from(bucket).getPublicUrl(path);
  if (error) throw error;
  return (data?.publicUrl || data?.public_url || "");
};

app.get('/api/admin-devotionals/list', async (req, res) => {
  const month = normalizeMonth(req.query.month);
  if (!month || !validateMonth(month)) {
    return res.status(400).json({ success: false, error: 'Invalid or missing month query parameter.' });
  }

  try {
    const { data, error } = await supabase.storage.from('devotionals').list(month, {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) throw error;

    const items = await Promise.all(
      (data || []).map(async (item) => {
        const path = `${month}/${item.name}`;
        const url = await getStoragePublicUrl('devotionals', path);
        return { name: item.name, path, size: item.size, url };
      })
    );

    res.json({ success: true, data: items });
  } catch (error) {
    console.error('ADMIN DEVOTIONALS LIST ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to list devotional assets.' });
  }
});

app.post('/api/admin-devotionals/upload', async (req, res) => {
  const { month, folder, fileName, base64, mimeType } = req.body;
  const folderName = normalizeMonth(folder || month);

  if (!folderName || !validateMonth(folderName) || !fileName || !base64 || !mimeType) {
    return res.status(400).json({ success: false, error: 'Missing required upload payload (month/folder, fileName, base64, mimeType).' });
  }

  try {
    const key = `${folderName}/${fileName}`;
    const fileBuffer = Buffer.from(base64, 'base64');
    const { error } = await supabase.storage.from('devotionals').upload(key, fileBuffer, {
      upsert: true,
      contentType: mimeType,
    });
    if (error) throw error;

    const url = await getStoragePublicUrl('devotionals', key);
    res.json({ success: true, data: { path: key, url } });
  } catch (error) {
    console.error('ADMIN DEVOTIONALS UPLOAD ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to upload devotional file.' });
  }
});

app.post('/api/admin-devotionals/delete', async (req, res) => {
  const { paths } = req.body;
  if (!Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ success: false, error: 'Missing paths to delete.' });
  }

  try {
    const { error } = await supabase.storage.from('devotionals').remove(paths);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('ADMIN DEVOTIONALS DELETE ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to delete devotional file(s).' });
  }
});

app.get('/api/admin-devotionals/settings', async (req, res) => {
  const month = normalizeMonth(req.query.month);
  if (!month || !validateMonth(month)) {
    return res.status(400).json({ success: false, error: 'Invalid or missing month query parameter.' });
  }

  try {
    const { data, error } = await supabase
      .from('devotional_settings')
      .select('theme, bg_color, cover_image_url')
      .eq('month', month)
      .maybeSingle();

    if (error) throw error;
    res.json({ success: true, data: data || null });
  } catch (error) {
    console.error('ADMIN DEVOTIONALS SETTINGS FETCH ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to fetch devotional settings.' });
  }
});

app.post('/api/admin-devotionals/settings', async (req, res) => {
  const { month, theme, bg_color, cover_image_url } = req.body;
  const normalizedMonth = normalizeMonth(month);

  if (!normalizedMonth || !validateMonth(normalizedMonth)) {
    return res.status(400).json({ success: false, error: 'Invalid or missing month.' });
  }

  try {
    const { error } = await supabase.from('devotional_settings').upsert({
      month: normalizedMonth,
      theme: theme || null,
      bg_color: bg_color || null,
      cover_image_url: cover_image_url || null,
    });
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('ADMIN DEVOTIONALS SETTINGS SAVE ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to save devotional settings.' });
  }
});

const normalizePage = (page) => normalizeMonth(page);
const normalizeLink = (link) => {
  let value = String(link || '').trim();
  if (!value) return value;
  value = value.replace(/^\/+/, '');
  return `/${value}`;
};

app.get('/api/admin-news/list', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('ADMIN NEWS LIST ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to list news items.' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('PUBLIC NEWS FETCH ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to fetch public news.' });
  }
});

app.post('/api/admin-news/save', async (req, res) => {
  const { id, title, excerpt, content, date, image, link } = req.body;
  if (!title || !excerpt || !content) {
    return res.status(400).json({ success: false, error: 'Missing required news fields.' });
  }

  const normalizedLink = normalizeLink(link);

  try {
    let result;
    if (id) {
      result = await supabase.from('news').update({ title, excerpt, content, date, image, link: normalizedLink }).eq('id', id);
    } else {
      result = await supabase.from('news').insert([{ title, excerpt, content, date, image, link: normalizedLink }]);
    }

    if (result.error) throw result.error;
    res.json({ success: true });
  } catch (error) {
    console.error('ADMIN NEWS SAVE ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to save news item.' });
  }
});

app.post('/api/admin-news/delete', async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, error: 'Missing news item id.' });
  }

  try {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('ADMIN NEWS DELETE ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to delete news item.' });
  }
});

app.post('/api/admin-news/upload', async (req, res) => {
  const { folder, fileName, base64, mimeType } = req.body;
  const normalizedFolder = normalizePage(folder || 'news');
  if (!normalizedFolder || !fileName || !base64 || !mimeType) {
    return res.status(400).json({ success: false, error: 'Missing required upload payload.' });
  }

  try {
    const key = `${normalizedFolder}/${fileName}`;
    const fileBuffer = Buffer.from(base64, 'base64');
    const { error } = await supabase.storage.from('news-images').upload(key, fileBuffer, {
      upsert: true,
      contentType: mimeType,
    });
    if (error) throw error;

    const url = await getStoragePublicUrl('news-images', key);
    res.json({ success: true, data: { path: key, url } });
  } catch (error) {
    console.error('ADMIN NEWS IMAGE UPLOAD ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to upload news image.' });
  }
});

app.get('/api/admin-media-files/list', async (req, res) => {
  const page = normalizePage(req.query.page);
  if (!page || !validateMonth(page)) {
    return res.status(400).json({ success: false, error: 'Invalid or missing page query parameter.' });
  }

  try {
    const { data, error } = await supabase.storage.from('media-files').list(page, {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) throw error;

    const items = await Promise.all(
      (data || []).map(async (item) => {
        const path = `${page}/${item.name}`;
        const url = await getStoragePublicUrl('media-files', path);
        return { name: item.name, path, size: item.size, url };
      })
    );

    res.json({ success: true, data: items });
  } catch (error) {
    console.error('ADMIN MEDIA FILES LIST ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to list media files.' });
  }
});

app.post('/api/admin-media-files/upload', async (req, res) => {
  const { page, fileName, base64, mimeType } = req.body;
  const normalizedPage = normalizePage(page);
  if (!normalizedPage || !fileName || !base64 || !mimeType) {
    return res.status(400).json({ success: false, error: 'Missing required upload payload.' });
  }

  try {
    const key = `${normalizedPage}/${fileName}`;
    const fileBuffer = Buffer.from(base64, 'base64');
    const { error } = await supabase.storage.from('media-files').upload(key, fileBuffer, {
      upsert: true,
      contentType: mimeType,
    });
    if (error) throw error;

    const url = await getStoragePublicUrl('media-files', key);
    res.json({ success: true, data: { path: key, url } });
  } catch (error) {
    console.error('ADMIN MEDIA FILES UPLOAD ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to upload media file.' });
  }
});

app.post('/api/admin-media-files/delete', async (req, res) => {
  const { paths } = req.body;
  if (!Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ success: false, error: 'Missing paths to delete.' });
  }

  try {
    const { error } = await supabase.storage.from('media-files').remove(paths);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('ADMIN MEDIA FILES DELETE ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to delete media file(s).' });
  }
});

app.get('/api/admin-media-files/carousel', async (req, res) => {
  const page = normalizePage(req.query.page);
  if (!page || !validateMonth(page)) {
    return res.status(400).json({ success: false, error: 'Invalid or missing page query parameter.' });
  }

  try {
    const { data, error } = await supabase
      .from('carousel_images')
      .select('*')
      .eq('page', page)
      .order('order_index', { ascending: true });
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('ADMIN MEDIA FILES CAROUSEL FETCH ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to fetch carousel images.' });
  }
});

app.post('/api/admin-media-files/carousel', async (req, res) => {
  const { page, image_url, image_name, order_index } = req.body;
  const normalizedPage = normalizePage(page);
  if (!normalizedPage || !image_url || !image_name) {
    return res.status(400).json({ success: false, error: 'Missing carousel image payload.' });
  }

  try {
    const { error } = await supabase.from('carousel_images').insert([{ page: normalizedPage, image_url, image_name, order_index }]);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('ADMIN MEDIA FILES CAROUSEL CREATE ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to add carousel image.' });
  }
});

app.post('/api/admin-media-files/carousel/delete', async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, error: 'Missing carousel id.' });
  }

  try {
    const { error } = await supabase.from('carousel_images').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('ADMIN MEDIA FILES CAROUSEL DELETE ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to remove carousel image.' });
  }
});

app.post('/api/admin-media-files/carousel/order', async (req, res) => {
  const { id, order_index } = req.body;
  if (!id || typeof order_index !== 'number') {
    return res.status(400).json({ success: false, error: 'Missing carousel order payload.' });
  }

  try {
    const { error } = await supabase.from('carousel_images').update({ order_index }).eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('ADMIN MEDIA FILES CAROUSEL ORDER ERROR:', error?.message || error);
    res.status(500).json({ success: false, error: error?.message || 'Unable to reorder carousel image.' });
  }
});


// Endpoint to check maintenance status (accessible during maintenance)
app.get("/api/status", async (req, res) => {
  try {
    const { data, error } = await supabase.from("admin_settings").select("value").eq("key", "maintenance_mode").maybeSingle();
    if (error) throw error;
    return res.json({ success: true, maintenanceMode: data?.value === 'true' });
  } catch (err) {
    console.error("Error in /api/status:", err.message || err);
    const isConnectionError = err.message?.includes('fetch failed');
    
    // If Supabase is unreachable, assume maintenance mode is OFF to allow the app to function
    if (isConnectionError) {
      console.warn("⚠️ Supabase unreachable in /api/status - assuming maintenance mode is OFF");
      return res.json({ success: true, maintenanceMode: false, warning: "Database unavailable" });
    }
    
    if (isAdminSettingsTableMissingError(err)) {
      return res.json({ success: true, maintenanceMode: false, warning: "Admin settings table missing" });
    }
    
    return res.json({ 
      success: true, 
      maintenanceMode: false,
      error: "Server error checking maintenance status" 
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
    return res.json({ success: false, error: "Supabase anon key not configured" });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (!data?.session) {
      console.error("ADMIN LOGIN ERROR: login succeeded but no session was returned", data);
      return res.json({ success: false, error: "Login succeeded but no session tokens were returned." });
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
    
    // Always return 200 with error in body to avoid fetch abort
    const isConnectionError = message.includes('fetch failed');
    return res.json({ 
      success: false, 
      error: isConnectionError ? "Database connection failed. Backend cannot reach Supabase." : message,
      isConnectionError
    });
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

    if (error) {
      if (isAdminSettingsTableMissingError(error)) {
        return res.json({ success: true, value: null });
      }
      const isConnectionError = error.message?.includes('fetch failed');
      if (isConnectionError) {
        console.warn(`⚠️ Supabase unreachable for settings key: ${req.params.key}`);
        return res.json({ success: true, value: null, warning: "Database unavailable" });
      }
      throw error;
    }

    res.json({ success: true, value: data?.value ?? null });
  } catch (error) {
    console.error(`Error fetching admin setting ${req.params.key}:`, error.message);
    const isConnectionError = error.message?.includes('fetch failed');
    // Return graceful response even on errors to avoid blocking UI
    res.json({ success: true, value: null, warning: isConnectionError ? "Database connection failed" : "Error fetching setting" });
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

    if (error) {
      if (isAdminSettingsTableMissingError(error)) {
        return res.json({ success: true, settings: {} });
      }
      throw error;
    }

    if (!data?.value) {
      return res.json({ success: true, settings: {} });
    }

    let parsedSettings = {};
    try {
      parsedSettings = JSON.parse(data.value);
    } catch {
      parsedSettings = {};
    }

    res.json({ success: true, settings: parsedSettings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/admin/page-access", async (req, res) => {
  const { settings } = req.body;

  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    return res.status(400).json({ success: false, error: "A JSON object is required for settings." });
  }

  try {
    const { error } = await supabase.from("admin_settings").upsert({ key: "admin_page_access", value: JSON.stringify(settings) });
    if (error) {
      if (isAdminSettingsTableMissingError(error)) {
        return res.json({ success: true });
      }
      throw error;
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// SMS Sender Function using MNOTIFY
const normalizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== "string") return "";
  let digits = phoneNumber.replace(/\D+/g, "");

  // Convert local Ghanaian phone numbers like 054xxx... to 23354xxx...
  if (digits.startsWith("0") && digits.length === 10) {
    digits = `233${digits.slice(1)}`;
  }

  return digits;
};

const sendSMSViaMMNotify = async (phoneNumber, message) => {
  const MNOTIFY_API_KEY = process.env.MNOTIFY_API_KEY;
  const MNOTIFY_SENDER_ID = process.env.MNOTIFY_SENDER_ID || "MOCWO";
  const to = normalizePhoneNumber(phoneNumber);

  if (!MNOTIFY_API_KEY) {
    console.warn("⚠️ MNOTIFY_API_KEY is not configured. SMS will not be sent.");
    return { success: false, error: "SMS service not configured" };
  }

  if (!to) {
    console.warn("⚠️ Invalid phone number provided for SMS.");
    return { success: false, error: "Invalid phone number" };
  }

  try {
    const payload = new URLSearchParams({
      key: MNOTIFY_API_KEY,
      to,
      msg: message,
      sender_id: MNOTIFY_SENDER_ID,
    });

    const response = await fetch("https://api.mnotify.com/api/sms/quick", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
    });

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch (parseError) {
      result = { status: response.ok ? "success" : "error", message: text };
    }

    if (response.ok && (result.code === "ok" || result.status === "success" || result.status === "OK")) {
      console.log(`✓ SMS sent to ${to}`);
      return { success: true, message: result.message || "SMS sent" };
    }

    console.error(`✗ MNOTIFY SMS Error: ${result.message || text || "Unknown error"}`);
    return { success: false, error: result.message || text || "Failed to send SMS" };
  } catch (error) {
    console.error("MNOTIFY Request Error:", error?.message || error);
    return { success: false, error: error?.message || String(error) };
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

// Admin Services CRUD endpoints (service-role authenticated)
app.get('/api/admin-services', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('church_schedule')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (error) {
    console.error('ADMIN SERVICES FETCH ERROR:', error.message || error);
    return res.status(500).json({ success: false, error: error.message || 'Unable to fetch services' });
  }
});

app.post('/api/admin-services', async (req, res) => {
  const {
    title,
    day,
    time_string,
    description,
    details,
    image,
    color,
    live_link,
    is_live,
    order_index,
  } = req.body;

  if (!title || !day || !time_string) {
    return res.status(400).json({ success: false, error: 'Title, day, and time are required.' });
  }

  try {
    const nextOrderIndex = typeof order_index === 'number'
      ? order_index
      : (await supabase.from('church_schedule').select('order_index', { count: 'exact', head: true })).count || 0;

    const { data, error } = await supabase
      .from('church_schedule')
      .insert([{ title, day, time_string, description, details, image, color, live_link, is_live: !!is_live, order_index: nextOrderIndex }])
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (error) {
    console.error('ADMIN SERVICES CREATE ERROR:', error.message || error);
    return res.status(500).json({ success: false, error: error.message || 'Unable to create service' });
  }
});

app.put('/api/admin-services/:id', async (req, res) => {
  const { id } = req.params;
  const updatePayload = { ...req.body };

  if (!id) {
    return res.status(400).json({ success: false, error: 'Service ID is required.' });
  }

  try {
    if (updatePayload.is_live === true) {
      const { error: clearError } = await supabase
        .from('church_schedule')
        .update({ is_live: false })
        .neq('id', id);
      if (clearError) throw clearError;
    }

    const { data, error } = await supabase
      .from('church_schedule')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (error) {
    console.error('ADMIN SERVICES UPDATE ERROR:', error.message || error);
    return res.status(500).json({ success: false, error: error.message || 'Unable to update service' });
  }
});

app.delete('/api/admin-services/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, error: 'Service ID is required.' });
  }

  try {
    const { error } = await supabase.from('church_schedule').delete().eq('id', id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    console.error('ADMIN SERVICES DELETE ERROR:', error.message || error);
    return res.status(500).json({ success: false, error: error.message || 'Unable to delete service' });
  }
});

// Admin Testimonials CRUD endpoints (service-role authenticated)
app.get('/api/admin-testimonials', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (error) {
    console.error('ADMIN TESTIMONIALS FETCH ERROR:', error.message || error);
    return res.status(500).json({ success: false, error: error.message || 'Unable to fetch testimonials' });
  }
});

app.put('/api/admin-testimonials/:id', async (req, res) => {
  const { id } = req.params;
  const updatePayload = { ...req.body };

  if (!id) {
    return res.status(400).json({ success: false, error: 'Testimony ID is required.' });
  }

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (error) {
    console.error('ADMIN TESTIMONIALS UPDATE ERROR:', error.message || error);
    return res.status(500).json({ success: false, error: error.message || 'Unable to update testimony' });
  }
});

app.delete('/api/admin-testimonials/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, error: 'Testimony ID is required.' });
  }

  try {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    console.error('ADMIN TESTIMONIALS DELETE ERROR:', error.message || error);
    return res.status(500).json({ success: false, error: error.message || 'Unable to delete testimony' });
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

