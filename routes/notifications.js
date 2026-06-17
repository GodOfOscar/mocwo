// routes/notifications.js
import express from "express";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// Lazy initialize Resend - gets called when first route is hit
let resend = null;
function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

// Lazy initialize Supabase - gets called when first route is hit
let supabase = null;
function getSupabase() {
  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
    );
  }
  return supabase;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || process.env.VITE_FROM_EMAIL || "notifications@fathersheartchapel.org";

/**
 * Send notification to all subscribers about a livestream
 * POST /api/notifications/send-livestream
 */
router.post("/send-livestream", async (req, res) => {
  try {
    const resendClient = getResend();
    const db = getSupabase();
    const {
      title,
      description,
      liveLink,
      startTime,
      notificationType = "livestream",
    } = req.body;

    if (!title || !liveLink) {
      return res.status(400).json({
        error: "Missing required fields: title, liveLink",
      });
    }

    // Get subscribers who want livestream notifications
    const { data: subscribers, error: fetchError } = await db
      .from("notification_subscriptions")
      .select("email")
      .eq("is_active", true)
      .or(
        `notification_type.eq.livestream,notification_type.eq.all`
      );

    if (fetchError) {
      console.error("Supabase error:", fetchError);
      return res.status(500).json({ error: "Failed to fetch subscribers" });
    }

    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No active subscribers",
        sentCount: 0,
      });
    }

    const emails = subscribers.map((sub) => sub.email);

    // Send email using Resend
    const emailResponse = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: emails,
      subject: `🔴 Live Now: ${title}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0066cc 0%, #00ccff 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
              .badge { display: inline-block; background: #ff0000; color: white; padding: 5px 10px; border-radius: 4px; font-weight: bold; margin-bottom: 10px; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .cta-button { display: inline-block; background: linear-gradient(135deg, #0066cc 0%, #00ccff 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; }
              .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="badge">🔴 LIVE NOW</div>
                <h1 style="margin: 10px 0;">${title}</h1>
              </div>
              
              <div class="content">
                <p><strong>Description:</strong> ${description || "Join us for our upcoming livestream"}</p>
                ${startTime ? `<p><strong>Start Time:</strong> ${startTime}</p>` : ""}
                
                <p style="margin-top: 20px;">
                  <a href="${liveLink}" class="cta-button">
                    ▶ Watch Now
                  </a>
                </p>
              </div>

              <p style="color: #666; font-size: 14px;">
                You received this email because you subscribed to livestream notifications from Fathers Heart Chapel International.
              </p>

              <div class="footer">
                <p>
                  <a href="https://fathersheartchapel.org" style="color: #0066cc; text-decoration: none;">Visit our website</a> • 
                  <a href="https://fathersheartchapel.org/notifications" style="color: #0066cc; text-decoration: none;">Manage preferences</a>
                </p>
                <p>&copy; ${new Date().getFullYear()} Fathers Heart Chapel International. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error);
      return res.status(500).json({
        error: "Failed to send emails",
        details: emailResponse.error,
      });
    }

    console.log(`✅ Sent livestream notification to ${emails.length} subscribers`);

    res.json({
      success: true,
      message: `Notification sent to ${emails.length} subscribers`,
      sentCount: emails.length,
    });
  } catch (error) {
    console.error("Error sending livestream notification:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

/**
 * Send notification to all subscribers about an upcoming program
 * POST /api/notifications/send-program
 */
router.post("/send-program", async (req, res) => {
  try {
    const resendClient = getResend();
    const db = getSupabase();
    const { title, description, date, time, location } = req.body;

    if (!title || !date) {
      return res.status(400).json({
        error: "Missing required fields: title, date",
      });
    }

    // Get subscribers who want program notifications
    const { data: subscribers, error: fetchError } = await db
      .from("notification_subscriptions")
      .select("email")
      .eq("is_active", true)
      .or(`notification_type.eq.programs,notification_type.eq.all`);

    if (fetchError) {
      console.error("Supabase error:", fetchError);
      return res.status(500).json({ error: "Failed to fetch subscribers" });
    }

    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No active subscribers",
        sentCount: 0,
      });
    }

    const emails = subscribers.map((sub) => sub.email);

    // Send email using Resend
    const emailResponse = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: emails,
      subject: `📅 Upcoming Program: ${title}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0066cc 0%, #00ccff 100%); color: white; padding: 20px; border-radius: 8px; }
              .badge { display: inline-block; background: #00cc00; color: white; padding: 5px 10px; border-radius: 4px; font-weight: bold; margin-bottom: 10px; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .event-details { background: white; border-left: 4px solid #0066cc; padding: 15px; margin: 15px 0; }
              .cta-button { display: inline-block; background: linear-gradient(135deg, #0066cc 0%, #00ccff 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; }
              .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="badge">📅 UPCOMING</div>
                <h1 style="margin: 10px 0;">${title}</h1>
              </div>
              
              <div class="content">
                <p>${description || "We have an exciting program coming up!"}</p>
                
                <div class="event-details">
                  <strong>📅 Date:</strong> ${date}<br>
                  ${time ? `<strong>⏰ Time:</strong> ${time}<br>` : ""}
                  ${location ? `<strong>📍 Location:</strong> ${location}<br>` : ""}
                </div>

                <p style="margin-top: 20px;">
                  <a href="https://fathersheartchapel.org/services" class="cta-button">
                    Learn More
                  </a>
                </p>
              </div>

              <p style="color: #666; font-size: 14px;">
                You received this email because you subscribed to program notifications from Fathers Heart Chapel International.
              </p>

              <div class="footer">
                <p>
                  <a href="https://fathersheartchapel.org" style="color: #0066cc; text-decoration: none;">Visit our website</a> • 
                  <a href="https://fathersheartchapel.org/notifications" style="color: #0066cc; text-decoration: none;">Manage preferences</a>
                </p>
                <p>&copy; ${new Date().getFullYear()} Fathers Heart Chapel International. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error);
      return res.status(500).json({
        error: "Failed to send emails",
        details: emailResponse.error,
      });
    }

    console.log(`✅ Sent program notification to ${emails.length} subscribers`);

    res.json({
      success: true,
      message: `Notification sent to ${emails.length} subscribers`,
      sentCount: emails.length,
    });
  } catch (error) {
    console.error("Error sending program notification:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

/**
 * Get notification statistics
 * GET /api/notifications/stats
 */
router.get("/stats", async (req, res) => {
  try {
    const db = getSupabase();
    const { data: total } = await db
      .from("notification_subscriptions")
      .select("id", { count: "exact" });

    const { data: active } = await db
      .from("notification_subscriptions")
      .select("id", { count: "exact" })
      .eq("is_active", true);

    const { data: livestreamOnly } = await db
      .from("notification_subscriptions")
      .select("id", { count: "exact" })
      .eq("is_active", true)
      .eq("notification_type", "livestream");

    const { data: programsOnly } = await db
      .from("notification_subscriptions")
      .select("id", { count: "exact" })
      .eq("is_active", true)
      .eq("notification_type", "programs");

    res.json({
      totalSubscriptions: total?.length || 0,
      activeSubscriptions: active?.length || 0,
      livestreamOnly: livestreamOnly?.length || 0,
      programsOnly: programsOnly?.length || 0,
      allNotifications: (active?.length || 0) - (livestreamOnly?.length || 0) - (programsOnly?.length || 0),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

export default router;
