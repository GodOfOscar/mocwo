#!/usr/bin/env node
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

function printUsage() {
  console.log(`Usage: node scripts/create-supabase-buckets-cli.js [--public] bucket1 bucket2 ...\n\nOptions:\n  --public    Create buckets with public access (default: true)\n\nBuckets can also be provided via the BUCKETS env var as a comma-separated list.`);
}

async function ensureBucket(supabase, name, isPublic = true) {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;
    if (Array.isArray(buckets) && buckets.some(b => b.name === name)) {
      console.log(`✓ Bucket '${name}' already exists`);
      return;
    }

    const { data, error } = await supabase.storage.createBucket(name, { public: isPublic });
    if (error) throw error;
    console.log(`✓ Created bucket '${name}' (public=${isPublic})`);
  } catch (err) {
    console.error(`✗ Failed to ensure bucket '${name}':`, err.message || err);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment or .env');
    process.exit(1);
  }

  let isPublic = true;
  const bucketsFromEnv = process.env.BUCKETS ? process.env.BUCKETS.split(',').map(s => s.trim()).filter(Boolean) : [];

  let buckets = [];
  if (args.length === 0 && bucketsFromEnv.length === 0) {
    printUsage();
    process.exit(1);
  }

  for (const a of args) {
    if (a === '--public') { isPublic = true; continue; }
    if (a === '--private') { isPublic = false; continue; }
    buckets.push(a);
  }

  buckets = buckets.concat(bucketsFromEnv);
  if (buckets.length === 0) {
    printUsage();
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log(`Connecting to Supabase at ${SUPABASE_URL}`);

  for (const bucket of buckets) {
    await ensureBucket(supabase, bucket, isPublic);
  }
}

main().catch(err => {
  console.error('Fatal error:', err.message || err);
  process.exit(1);
});
