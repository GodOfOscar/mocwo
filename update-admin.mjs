#!/usr/bin/env node
import https from 'https';
import http from 'http';
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

async function updateAdmin() {
  return new Promise((resolve, reject) => {
    const url = new URL(SERVER_URL + '/api/create-admin');
    
    const postData = JSON.stringify({
      email: adminEmail,
      password: adminPassword,
      full_name: fullName
    });

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'x-admin-key': ADMIN_CREATION_KEY
      }
    };

    let protocol = url.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ status: res.statusCode, data: response });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

(async () => {
  try {
    const result = await updateAdmin();
    
    if (result.status === 201 || result.status === 200) {
      console.log('✅ Admin credentials updated successfully!\n');
      console.log('📋 Details:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   Status: Ready to use\n`);
      console.log('🔐 Pre-Auth Answer: revprince\n');
      console.log('You can now log in to the admin dashboard with these credentials.');
    } else {
      console.log(`❌ Failed with status ${result.status}`);
      console.log(JSON.stringify(result.data, null, 2));
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
