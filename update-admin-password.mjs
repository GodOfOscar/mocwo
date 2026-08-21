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
const adminPassword = 'teritorial';

console.log('🔑 Updating Admin Password...\n');
console.log(`Email: ${adminEmail}`);
console.log(`New Password: ${adminPassword}\n`);

(async () => {
  try {
    // First, get the user ID from the email
    console.log('📡 Fetching admin user...\n');
    
    const usersRes = await axios.get(`${SUPABASE_URL}/auth/v1/admin/users`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const users = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.users || []);
    const adminUser = users.find(u => u.email === adminEmail);

    if (!adminUser) {
      console.error(`❌ Admin user with email ${adminEmail} not found`);
      process.exit(1);
    }

    console.log(`📋 Found admin user: ${adminUser.email} (ID: ${adminUser.id})\n`);

    // Update the password
    console.log('🔐 Updating password...\n');
    
    const updateRes = await axios.put(
      `${SUPABASE_URL}/auth/v1/admin/users/${adminUser.id}`,
      { password: adminPassword },
      {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Admin password updated successfully!\n');
    console.log('📋 Login Credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Pre-Auth Answer: revprince\n`);
    console.log('🎉 You can now log in to the admin dashboard.');

  } catch (err) {
    console.error('❌ Error updating password:', err.response?.data || err.message);
    process.exit(1);
  }
})();
