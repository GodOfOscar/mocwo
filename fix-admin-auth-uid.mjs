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

console.log('🔑 Fixing Admin Auth UID...\n');

(async () => {
  try {
    // 1. Get the auth UID from Supabase Auth
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

    // 2. Update the admin_users table with the correct auth_uid
    console.log('🔐 Updating admin_users table with correct auth_uid...\n');
    
    const updateRes = await axios.patch(
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

    console.log('✅ Admin auth_uid updated successfully!\n');
    console.log('📋 Updated Admin Details:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Auth UID: ${authUid}`);
    console.log(`   Role: admin`);
    console.log(`   Is Active: true\n`);
    console.log('🎉 You should now be able to log in without "Unauthorized access" error.');

  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
    process.exit(1);
  }
})();
