#!/usr/bin/env node
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

(async () => {
  try {
    // Fetch all admin_users
    const adminsRes = await axios.get(`${SUPABASE_URL}/rest/v1/admin_users`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const admins = adminsRes.data || [];

    for (const admin of admins) {
      if (admin.auth_uid) continue; // already populated

      // Find Auth user by email
      const authUsersRes = await axios.get(`${SUPABASE_URL}/auth/v1/admin/users`, {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const users = authUsersRes.data?.users || [];
      const match = users.find(u => u.email === admin.email);
      if (match) {
        // Update admin_users row with auth_uid
        await axios.patch(
          `${SUPABASE_URL}/rest/v1/admin_users?id=eq.${admin.id}`,
          { auth_uid: match.id },
          {
            headers: {
              apikey: SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
              Prefer: 'return=representation'
            }
          }
        );
        console.log(`Updated admin ${admin.email} -> auth_uid ${match.id}`);
      } else {
        console.warn(`No auth user found for ${admin.email}`);
      }
    }

    console.log('Done.');
  } catch (err) {
    console.error('Error:', err?.response?.data || err.message || err);
    process.exit(1);
  }
})();