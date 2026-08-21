# Supabase Database Setup Guide

## Overview
This guide will help you set up the complete Supabase database for the MOC (Martyrs Of Christ World Outreach) website.

## Prerequisites
- Supabase account with an active project
- Project URL and Publishable Anon Key
- Admin email for the admin user

## Step-by-Step Setup

### Step 1: Access Your Supabase Dashboard
1. Go to https://supabase.com/dashboard/
2. Sign in to your account
3. Click on your project: **foojbihdxdoflfjnhfjf**

### Step 2: Run the Database Migrations
1. In the Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content from the migration file: `supabase/migrations/20260123_complete_database_setup.sql`
4. Paste it into the SQL editor
5. Click **Run** to execute all migrations
6. Verify that all tables are created by checking the **Table Editor**

### Step 3: Configure Environment Variables
Create or update your `.env.local` file with:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_YOUTUBE_CHANNEL_ID=your_youtube_channel_id
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```

### Step 4: Create an Admin User
1. In Supabase dashboard, go to **Authentication → Users**
2. Click **Add user**
3. Enter admin email (e.g., `admin@example.com`)
4. Set a strong password
5. Click **Save**
6. The admin user will automatically appear in the `admin_users` table (due to the seed migration)

### Step 5: Enable Realtime for Live Messages (Optional)
1. Go to **Database → Realtime**
2. Enable realtime for the `public` schema
3. This allows real-time chat updates on the Live page

### Step 6: Configure Storage Buckets (Optional)
1. Go to **Storage**
2. Create buckets for:
   - `media` (for gallery images/videos)
   - `uploads` (for general uploads)
   - `thumbnails` (for media thumbnails)
3. Set appropriate public access policies

### Step 7: Verify All Tables
Check that all these tables exist in your database:
- ✓ `admin_users` - Admin authentication
- ✓ `admin_settings` - System configurations (maintenance mode, page access)
- ✓ `admin_activity_log` - Audit logs for admin actions
- ✓ `partnerships` - Partnership donations
- ✓ `news` - Site news/stories
- ✓ `live_messages` - Live page chat
- ✓ `prayer_requests` - Prayer AI submissions
- ✓ `membership_requests` - Membership applications
- ✓ `contact_submissions` - Contact form submissions
- ✓ `donations` - Donation tracking
- ✓ `events` - Church events
- ✓ `media_gallery` - Media content
- ✓ `announcements` - Site announcements
- ✓ `testimonials` - User testimonials

## Database Tables Overview

### 1. admin_users
- Stores admin user information
- Used for authentication and authorization
- **Fields**: id, email, password_hash, full_name, role, is_active, created_at, updated_at

### 13. admin_settings
- Stores system-wide configuration flags
- **Fields**: key (PK), value, created_at, updated_at

### 14. admin_activity_log
- Audit trail for administrative actions
- **Fields**: id (PK), admin_email, action, details, created_at

### 2. partnerships
- Records partnership donations and level signups
- **Fields**: id, name, email, phone, level, amount, payment_method, message, status, created_at, updated_at

### 3. news
- Stores news articles and stories
- **Fields**: id, title, excerpt, content, date, image, link, created_at, updated_at

### 4. live_messages
- Chat messages for the Live page
- **Fields**: id, user_name, message, is_highlighted, created_at

### 5. prayer_requests
- Prayer requests submitted via Prayer AI
- **Fields**: id, name, phone, location, prayer_text, method, status, created_at, updated_at

### 6. membership_requests
- Membership application forms
- **Fields**: id, first_name, last_name, email, phone, date_of_birth, gender, marital_status, address, city, state, country, membership_type, message, status, created_at, updated_at

### 7. contact_submissions
- Contact form submissions
- **Fields**: id, name, email, phone, subject, message, status, created_at, updated_at

### 8. donations
- Donation records with payment status
- **Fields**: id, name, email, phone, amount, donation_type, payment_method, payment_reference, status, message, created_at, updated_at

### 9. events
- Church events and services
- **Fields**: id, title, description, start_date, end_date, location, event_type, image_url, registration_link, is_active, created_at, updated_at

### 10. media_gallery
- Media content (images, videos)
- **Fields**: id, title, description, media_type, url, thumbnail_url, category, tags, is_featured, created_at, updated_at

### 11. announcements
- Church announcements
- **Fields**: id, title, content, announcement_type, start_date, end_date, is_active, created_at, updated_at

### 12. testimonials
- User testimonials
- **Fields**: id, name, email, phone, testimony, media_url, status, featured, created_at, updated_at

## Security Policies (RLS - Row Level Security)

All tables have Row Level Security (RLS) enabled:

- **Public Read**: Users can read non-sensitive data (events, testimonials, media, announcements)
- **Public Insert**: Users can submit forms (contact, memberships, testimonials, donations)
- **Admin Only**: Only authenticated admins can view sensitive data (donations, partnership requests, prayer requests, contact submissions)
- **Automatic Timestamps**: `created_at` and `updated_at` are automatically managed via triggers

## API Endpoints Available

The backend is set up to handle:
- `/api/sendPrayer` - Send prayer requests via SMS/WhatsApp (using Termii)
- Supabase Real-time subscriptions for live chat

## Common Database Operations

### Insert a partnership:
```javascript
const { error } = await supabase
  .from('partnerships')
  .insert([{ name, email, phone, level, amount, payment_method, message }]);
```

### Fetch live messages:
```javascript
const { data } = await supabase
  .from('live_messages')
  .select('*')
  .order('created_at', { ascending: true });
```

### Listen for new live messages (real-time):
```javascript
const subscription = supabase
  .channel('live_messages')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'live_messages' },
    (payload) => console.log(payload)
  )
  .subscribe();
```

## Troubleshooting

### Missing Tables
- Re-run the migration SQL if tables are missing
- Check the SQL Editor execution logs for errors

### Authentication Issues
- Ensure the admin email matches exactly in both `auth.users` and `admin_users`
- Verify RLS policies allow your user role

### Real-time Not Working
- Enable Realtime in Storage settings
- Ensure your client is subscribed correctly
- Check browser console for connection errors

## Next Steps
1. Start your dev server: `npm run dev`
2. Test partnerships form submission
3. Test admin login at `/admin`
4. Populate initial data (news, events, announcements)
5. Configure Paystack for donations
6. Set up Termii credentials for prayer requests

## Support
For issues with Supabase, visit: https://supabase.com/docs
