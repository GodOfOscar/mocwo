#!/usr/bin/env node
import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminEmail = 'mocwo.org01@gmail.com';

console.log('🔐 Applying migration and fixing Admin Auth UID...\n');

(async () => {
  try {
    // First, get the auth UID
    console.log('📡 Fetching auth UID from Supabase Auth...\n');
    
    const usersRes = await axios.get(`${SUPABASE_URL}/auth/v1/admin/users`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const users = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.users || []);
    const authUser = users.find(u => u.email === adminEmail);

    if (!authUser) {
      console.error(`❌ Auth user with email ${adminEmail} not found`);
      process.exit(1);
    }

    const authUid = authUser.id;
    console.log(`✅ Found auth UID: ${authUid}\n`);

    // First, apply the migration using RPC function or raw SQL
    // Since we don't have direct SQL execution, we'll try the PATCH endpoint
    // which should work after the column exists. Let's first try to see if column exists by attempting the update
    
    console.log('🔐 Attempting to update admin_users with auth_uid...\n');
    
    try {
      // Try direct PATCH first
      await axios.patch(
        `${SUPABASE_URL}/rest/v1/admin_users?email=eq.${encodeURIComponent(adminEmail)}`,
        { auth_uid: authUid },
        {
          headers: {
            apikey: SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('✅ Direct update succeeded!\n');
    } catch (patchErr) {
      if (patchErr.response?.data?.code === 'PGRST204') {
        console.log('⚠️  Column auth_uid not found, creating it via alternative method...\n');
        
        // Since we can't directly run SQL, let's use the py/migrations endpoint
        // Actually, for Supabase, we need to use the web interface or CLI to apply migrations
        // But as a workaround, we can try to insert a dummy record with the column to see if it triggers creation
        
        console.log('📝 Note: auth_uid column needs to be created via Supabase Dashboard or CLI');
        console.log('   1. Go to Supabase Dashboard → SQL Editor');
        console.log('   2. Run this query:\n');
        console.log('      ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS auth_uid UUID;');
        console.log('      UPDATE public.admin_users SET auth_uid = ' + "'" + authUid + "'" + ' WHERE email = ' + "'" + adminEmail + "'" + ';\n');
        console.log('   OR run from terminal:\n');
        console.log('      supabase db push\n');
        process.exit(1);
      } else {
        throw patchErr;
      }
    }

    console.log('✅ Admin auth_uid updated successfully!\n');
    console.log('📋 Updated Admin Details:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Auth UID: ${authUid}`);
    console.log('   Role: admin');
    console.log('   Is Active: true\n');
    console.log('🎉 You should now be able to log in without "Unauthorized access" error.');

  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
    process.exit(1);
  }
})();
