# Security Fix: Admin Authorization Hardening

Issue: Admin logins could be incorrectly authorized because admin checks and RLS policies previously relied only on matching email values. This could allow mismatch scenarios where an authenticated user could gain admin access if records weren't properly linked to Supabase auth UIDs.

Fix implemented:
1. Added `auth_uid` (UUID) column to `public.admin_users` and index (`20260202_add_admin_auth_uid.sql`).
2. Updated `POST /api/create-admin` to store the created Supabase Auth UID in `admin_users.auth_uid`.
3. Tightened RLS policies to check for a matching active admin with `auth_uid = auth.uid()` and `role = 'admin'` (`20260202_fix_admin_policies.sql`).
4. Added `scripts/populate-admin-auth-uid.js` to populate `auth_uid` for existing admin rows.
5. Frontend admin checks (`src/pages/Admin.tsx`) now require `is_active === true`, `role === 'admin'`, and matching `auth_uid` to consider a session authorized.

What you should do now (recommended):
- Run the new migrations in Supabase SQL editor in order:
  1. `20260202_add_admin_auth_uid.sql`
  2. `20260202_fix_admin_policies.sql`
- Populate existing rows (if any):
  - Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your environment.
  - Run: `node scripts/populate-admin-auth-uid.js`
- Restart server: `npm run server`
- Test: Create an admin via `/api/create-admin` and ensure you can log in, and that a non-admin account cannot access `/admin` content.

If you need help running the migration or script, tell me which environment (local or production) and I can provide step-by-step commands. 