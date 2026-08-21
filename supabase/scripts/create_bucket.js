// create_bucket.js
// Usage: node create_bucket.js
// Requires env vars: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (service role key required to create buckets)

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createBucket() {
  const bucketName = 'news-images';
  try {
    const { data, error } = await supabase.storage.createBucket(bucketName, { public: true });
    if (error) {
      if (error.message && error.message.includes('already exists')) {
        console.log(`Bucket '${bucketName}' already exists.`);
        process.exit(0);
      }
      throw error;
    }
    console.log('Bucket created:', data);
  } catch (err) {
    console.error('Error creating bucket:', err.message || err);
    process.exit(1);
  }
}

createBucket();
