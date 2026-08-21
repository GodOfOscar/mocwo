#!/usr/bin/env node
import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '.env') });

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
const ADMIN_CREATION_KEY = process.env.ADMIN_CREATION_KEY;

const adminEmail = 'mocwo.org01@gmail.com';
const adminPassword = 'teritorial';
const fullName = 'MOC Admin';

console.log('🔑 Updating Admin Credentials...\n');
console.log(`Email: ${adminEmail}`);
console.log(`Password: ${adminPassword}`);
console.log(`Name: ${fullName}\n`);

(async () => {
  try {
    console.log(`📡 Connecting to server: ${SERVER_URL}\n`);
    
    const res = await axios.post(
      `${SERVER_URL}/api/create-admin`,
      { email: adminEmail, password: adminPassword, full_name: fullName },
      { headers: { 'x-admin-key': ADMIN_CREATION_KEY } }
    );

    console.log('✅ Admin credentials updated successfully!\n');
    console.log('📋 Login Credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Pre-Auth Answer: revprince\n`);
    console.log('You can now log in to the admin dashboard.');
  } catch (err) {
    console.error('❌ Error updating admin:', err.response?.data || err.message);
    process.exit(1);
  }
})();
