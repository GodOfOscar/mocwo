# Supabase scripts

This folder contains helper scripts for Supabase setup.

create_bucket.js
- Creates a public storage bucket named `news-images`.
- Usage:

  1. Create a `.env` file or set environment variables in your shell with your Supabase project values:

     SUPABASE_URL=https://xyzcompany.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

  2. Run:

     node create_bucket.js

Note: The script requires the Supabase service role key because bucket creation requires admin privileges. Keep this key secret.
