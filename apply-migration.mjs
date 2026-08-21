#!/usr/bin/env node
import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔁 Applying RLS Policy Fix...\n');

(async () => {
  try {
    // Read the migration file
    const migrationFile = path.join(__dirname, 'supabase/migrations/20260323_fix_admin_rls_policies.sql');
    const sqlContent = fs.readFileSync(migrationFile, 'utf-8');

    console.log('📝 Executing SQL migration...\n');

    // Execute SQL using Supabase's pgBouncer endpoint (if available)
    // Since direct SQL execution isn't available via REST, we'll provide manual instructions
    
    console.log('⚠️  Direct SQL execution requires special access.\n');
    console.log('📋 To apply this migration, please:\n');
    console.log('Option 1: Use Supabase Dashboard');
    console.log('   1. Go to https://app.supabase.com');
    console.log('   2. Go to SQL Editor');
    console.log('   3. Create a new query and paste this:\n');
    console.log('---START SQL---');
    console.log(sqlContent);
    console.log('---END SQL---\n');
    
    console.log('Option 2: Use Supabase CLI (if installed)');
    console.log('   1. Run: supabase migration new apply_admin_rls_fix');
    console.log('   2. Copy the SQL above into the new migration file');
    console.log('   3. Run: supabase db push\n');

    console.log('Option 3: Quick Fix (use Node script below)\n');
    process.exit(1);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
