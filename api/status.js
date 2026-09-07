import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "maintenance_mode")
      .maybeSingle();

    if (error) {
      return res.status(200).json({ success: true, maintenanceMode: false });
    }

    return res.status(200).json({
      success: true,
      maintenanceMode: data?.value === "true",
    });
  } catch (error) {
    console.warn("API status check failed:", error?.message || error);
    return res.status(200).json({ success: true, maintenanceMode: false });
  }
}
