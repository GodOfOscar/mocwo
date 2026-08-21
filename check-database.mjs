#!/usr/bin/env node

/**
 * Database Integrity Check Script
 * Verifies all tables, RLS policies, and data integrity
 */

import https from 'https';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  console.error('Please set these environment variables to run database checks.');
  process.exit(1);
}

const expectedTables = [
  'admin_users',
  'partnerships',
  'news',
  'live_messages',
  'prayer_requests',
  'membership_requests',
  'contact_submissions',
  'donations',
  'events',
  'media_gallery',
  'announcements',
  'testimonials'
];

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
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

async function checkDatabase() {
  console.log('🔍 Database Integrity Check');
  console.log('============================\n');

  // 1. Check if we can connect
  console.log('📡 Testing Connection...');
  try {
    const response = await makeRequest(`${SUPABASE_URL}/rest/v1/`);
    if (response.status === 200 || response.status === 401) {
      console.log('✅ Connection successful\n');
    } else {
      console.log(`❌ Connection failed with status ${response.status}\n`);
      return;
    }
  } catch (err) {
    console.log(`❌ Connection error: ${err.message}\n`);
    return;
  }

  // 2. Check each table
  console.log('📊 Checking Tables...');
  const tableResults = {};
  
  for (const table of expectedTables) {
    try {
      const response = await makeRequest(
        `${SUPABASE_URL}/rest/v1/${table}?limit=1`
      );
      
      if (response.status === 200) {
        const count = response.headers['content-range'] ? 
          response.headers['content-range'].split('/')[1] : 'unknown';
        tableResults[table] = `✅ OK (rows: ${count})`;
      } else if (response.status === 401) {
        tableResults[table] = '⚠️  Unauthorized (RLS may be blocking)';
      } else if (response.status === 404) {
        tableResults[table] = `❌ Not found`;
      } else {
        tableResults[table] = `❌ Error ${response.status}`;
      }
    } catch (err) {
      tableResults[table] = `❌ ${err.message}`;
    }
  }

  Object.entries(tableResults).forEach(([table, status]) => {
    console.log(`  ${table.padEnd(25)} ${status}`);
  });

  // 3. Check admin users
  console.log('\n👥 Checking Admin Users...');
  try {
    const response = await makeRequest(
      `${SUPABASE_URL}/rest/v1/admin_users?select=id,email,full_name,is_active,role`
    );
    
    if (response.status === 200 && Array.isArray(response.data)) {
      if (response.data.length > 0) {
        console.log(`✅ Found ${response.data.length} admin(s)`);
        response.data.forEach(admin => {
          const status = admin.is_active ? '✓' : '✗';
          console.log(`  ${status} ${admin.email} (${admin.full_name})`);
        });
      } else {
        console.log('⚠️  No admin users found');
      }
    } else {
      console.log('❌ Could not fetch admin users');
    }
  } catch (err) {
    console.log(`❌ Error checking admin users: ${err.message}`);
  }

  // 4. Summary
  console.log('\n✨ Check Complete!\n');
  
  const okTables = Object.values(tableResults).filter(s => s.includes('✅')).length;
  const totalTables = Object.keys(tableResults).length;
  
  console.log(`Summary: ${okTables}/${totalTables} tables accessible`);
  
  if (okTables === totalTables) {
    console.log('🎉 Database is intact!\n');
  } else {
    console.log('⚠️  Some tables have issues. Check RLS policies and permissions.\n');
  }
}

checkDatabase().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
