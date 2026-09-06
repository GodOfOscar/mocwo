import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const publicSupabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: undefined,
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
