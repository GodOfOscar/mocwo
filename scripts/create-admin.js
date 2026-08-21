#!/usr/bin/env node
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from parent directory
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

const SERVER_URL = process.env.SERVER_URL;
const ADMIN_CREATION_KEY = process.env.ADMIN_CREATION_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const FULL_NAME = process.env.FULL_NAME;

if (!SERVER_URL || !ADMIN_CREATION_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD || !FULL_NAME) {
  console.error('Missing environment variables. Please set SERVER_URL, ADMIN_CREATION_KEY, ADMIN_EMAIL, ADMIN_PASSWORD, FULL_NAME');
  process.exit(1);
}

(async () => {
  try {
    const res = await axios.post(
      `${SERVER_URL}/api/create-admin`,
      { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, full_name: FULL_NAME },
      { headers: { 'x-admin-key': ADMIN_CREATION_KEY } }
    );

    console.log('Admin created:', res.data);
  } catch (err) {
    console.error('Error creating admin:', err.response?.data || err.message);
    process.exit(1);
  }
})();
