import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const buckets = [
  'devotionals',
  'media-files',
  'resources',
  'news-images',
];

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERROR: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment or .env file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function ensureBucket(name) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw listError;
  }
  if (Array.isArray(buckets) && buckets.some(bucket => bucket.name === name)) {
    console.log(`✓ Bucket '${name}' already exists`);
    return;
  }

  const { data, error } = await supabase.storage.createBucket(name, { public: true });
  if (error) {
    throw error;
  }
  console.log(`✓ Created bucket '${name}'`);
}

async function main() {
  console.log(`Connecting to Supabase project at ${SUPABASE_URL}`);
  for (const bucket of buckets) {
    try {
      await ensureBucket(bucket);
    } catch (error) {
      console.error(`✗ Failed to ensure bucket '${bucket}':`, error.message || error);
    }
  }
}

main().catch(error => {
  console.error('Fatal error:', error.message || error);
  process.exit(1);
});
