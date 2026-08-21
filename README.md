# Project documentation

## Project info

This repository contains a React + Vite application with Supabase backend integration.

## How can I edit this code?

You can edit this project locally using your preferred IDE.

The only requirement is having Node.js and npm installed.

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the development server.
npm run dev
```

### Edit files directly in GitHub

- Navigate to the file you want to edit.
- Click the pencil icon to edit.
- Commit your changes directly from GitHub.

### Deploying the project

Use your preferred deployment platform. This project is built with Vite, React, TypeScript, Tailwind CSS, and Supabase.

#### Deploying the backend on Render

The backend is located in the `backend/` folder and includes its own `package.json` and `render.yaml` service definition.

1. Push the repository to GitHub.
2. Connect the repo to Render.
3. Render will use `backend/render.yaml` and deploy the `backend` folder as a Node web service.
4. Required environment variables for the backend service:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ANON_KEY` or `VITE_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `WHAPI_TOKEN` (optional if using WhatsApp sending)
   - `WHAPI_BASE_URL` (optional)
   - `PRAYER_EMAIL_RECIPIENTS`
   - `RESEND_FROM_EMAIL` / `VITE_FROM_EMAIL`

The backend starts with `node server.js` and listens on the port Render provides via `process.env.PORT`.

## What technologies are used for this project?

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Admin — Supabase setup

Follow these steps to create an admin user for the site's admin panel:

1. Open your Supabase project and go to **Authentication → Users**.
2. Click **Invite user** or **Create new user** and create a user with the admin email you want to use (set a secure password).
3. In the SQL editor (or via migrations), ensure there is a matching row in `public.admin_users` with the same email. A seed file is included at `supabase/migrations/20251221000000_seed_admin_user.sql`.

Quick SQL example to run in Supabase SQL editor (replace the email):

```sql
INSERT INTO public.admin_users (email, password_hash, full_name, role, is_active)
VALUES ('admin@example.com', 'placeholder', 'Site Administrator', 'admin', true)
ON CONFLICT (email) DO NOTHING;
```

Notes:
- The `admin_users` table is used for role checks; Supabase Auth stores actual passwords. Make sure the Auth user email matches the `admin_users.email` exactly.
- After creating the Auth user and the `admin_users` row, sign in at `/admin` with the Auth email/password.
- For production use, replace the placeholder and manage users securely via the Supabase Dashboard or Admin API.

Quick create Auth user (Admin API)

You can create the Supabase Auth user programmatically using the service_role key. Replace `${SUPABASE_URL}`, `${SERVICE_ROLE_KEY}`, `<ADMIN_EMAIL>` and `<ADMIN_PASSWORD>` with your project values.

```bash
# Create Supabase Auth user (requires service_role key)
curl -X POST "${SUPABASE_URL}/auth/v1/admin/users" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"email":"<ADMIN_EMAIL>","password":"<ADMIN_PASSWORD>","email_confirm":true}'
```

Once the Auth user exists and the `admin_users` row (see `supabase/migrations/20251221000000_seed_admin_user.sql`) contains the same email, you can sign in at `/admin` using the Auth credentials you created.

IMPORTANT: Do NOT commit plaintext passwords into the repository or shared docs. Use secure channels to share credentials and rotate passwords immediately after first sign-in.

### Admin creation endpoint (optional)

If you'd rather create admin users programmatically, the project provides a protected server endpoint at `POST /api/create-admin`.

Environment variables required on the server:
- `SUPABASE_URL` — your Supabase project URL (e.g. https://xyz.supabase.co)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service_role key (keep secret)
- `ADMIN_CREATION_KEY` — a server-side secret used to protect the endpoint

Example curl to create an admin (replace placeholders and use your `ADMIN_CREATION_KEY`):

```bash
curl -X POST https://your-server.example.com/api/create-admin \
  -H "Content-Type: application/json" \
  -H "x-admin-key: ${ADMIN_CREATION_KEY}" \
  -d '{"email":"<ADMIN_EMAIL>","password":"<ADMIN_PASSWORD>","full_name":"<FULL_NAME>"}'
```

The endpoint will:
- create the Supabase Auth user via the Admin API
- insert a matching row into `public.admin_users`

Security: keep `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_CREATION_KEY` in a secure server environment and never commit them.

## Prayer Request WhatsApp Numbers

Prayer requests should be sent to these WhatsApp numbers:

- **055 811 7792**
- **0544 733469**
- **0593 357615**

These numbers are monitored for prayer requests and pastoral support. Members can send their prayer requests through WhatsApp for immediate attention and intercession.

