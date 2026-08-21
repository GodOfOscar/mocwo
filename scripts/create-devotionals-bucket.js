import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERROR: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment (or .env).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function ensureBucket(name) {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;

    if (Array.isArray(buckets) && buckets.find(b => b.name === name)) {
      console.log(`Bucket '${name}' already exists`);
      return;
    }

    const { data, error } = await supabase.storage.createBucket(name, { public: true });
    if (error) throw error;
    console.log(`Created bucket '${name}'`);
  } catch (err) {
    console.error('Failed to ensure bucket:', err.message || err);
    process.exit(1);
  }
}

ensureBucket('devotionals');
