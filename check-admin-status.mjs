#!/usr/bin/env node
import https from 'https';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminEmail = 'mocwo.org01@gmail.com';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        ...options.headers
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : null,
            headers: res.headers
          });
        } catch {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

async function checkAdmin() {
  console.log(`🔍 Checking admin user: ${adminEmail}\n`);

  try {
    // Fetch admin user
    const response = await makeRequest(
      `${SUPABASE_URL}/rest/v1/admin_users?email=eq.${encodeURIComponent(adminEmail)}&select=*`
    );
    
    if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
      const admin = response.data[0];
      console.log('📋 Admin User Details:');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Full Name: ${admin.full_name}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Is Active: ${admin.is_active}`);
      console.log(`   Created: ${admin.created_at}\n`);
      
      // Check what's failing
      const issues = [];
      if (!admin) issues.push('User not found in admin_users table');
      if (admin.is_active !== true) issues.push(`is_active is ${admin.is_active} (should be true)`);
      if (admin.role !== 'admin') issues.push(`role is "${admin.role}" (should be "admin")`);
      
      if (issues.length === 0) {
        console.log('✅ All conditions are met - should be able to log in');
      } else {
        console.log('❌ Issues found:');
        issues.forEach(issue => console.log(`   - ${issue}`));
      }
    } else {
      console.log('❌ Admin user not found in database');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkAdmin();
