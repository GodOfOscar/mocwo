# Supabase Database Setup Checklist

## Pre-Setup
- [ ] You have access to your Supabase project: https://supabase.com/dashboard/project/foojbihdxdoflfjnhfjf
- [ ] You have your Supabase URL and Publishable Anon Key
- [ ] You have an admin email ready (e.g., admin@example.com)

## Database Setup Steps

### Phase 1: Create Tables & Policies
- [ ] Open Supabase Dashboard → SQL Editor
- [ ] Run migration: `supabase/migrations/20260123_complete_database_setup.sql`
- [ ] Verify all tables are created in Table Editor
- [ ] Check that all indexes are created

**Tables to verify:**
- [ ] admin_users
- [ ] partnerships
- [ ] news
- [ ] live_messages
- [ ] prayer_requests
- [ ] membership_requests
- [ ] contact_submissions
- [ ] donations
- [ ] events
- [ ] media_gallery
- [ ] announcements
- [ ] testimonials

### Phase 2: Authentication Setup
- [ ] Go to Authentication → Users
- [ ] Create admin user with your email (or use the protected `POST /api/create-admin` endpoint)
- [ ] Set a strong password
- [ ] Note: This creates both an Auth user and an `admin_users` record; the `auth_uid` column is required to link the Auth user to the admin row. If you have existing admins, run `scripts/populate-admin-auth-uid.js` to populate `auth_uid` values.

### Phase 3: Environment Configuration
- [ ] Copy `.env.example` to `.env.local` (if not already done)
- [ ] Add Supabase credentials:
  ```
  VITE_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
  VITE_SUPABASE_PUBLISHABLE_KEY=[YOUR_ANON_KEY]
  ```
- [ ] Add YouTube credentials:
  ```
  VITE_YOUTUBE_CHANNEL_ID=your_channel_id
  VITE_YOUTUBE_API_KEY=your_api_key
  ```
- [ ] Add Termii credentials (for prayer SMS):
  ```
  TERMII_API_KEY=your_api_key
  TERMII_SENDER_ID=MOC
  LEADER_PHONE_NUMBER=+233xxx
  ```

### Phase 4: Optional - Storage Setup
- [ ] Go to Storage → Create Bucket
- [ ] Create bucket: `media` (for gallery)
- [ ] Create bucket: `uploads` (for general uploads)
- [ ] Create bucket: `thumbnails` (for thumbnails)
- [ ] Set public access policies as needed

### Phase 5: Optional - Real-time Setup
- [ ] Go to Database → Realtime
- [ ] Enable realtime for `public` schema
- [ ] This enables live chat on the Live page

### Phase 6: Testing
- [ ] Start dev server: `npm run dev`
- [ ] Test Partnership form submission at `/give/partner`
- [ ] Check that data appears in Supabase dashboard
- [ ] Test admin login at `/admin`
- [ ] Verify partnership data appears in admin dashboard

## Database RLS Security Summary

| Table | Public Read | Public Write | Admin Only |
|-------|-----------|------------|-----------|
| admin_users | No | No | Yes |
| partnerships | No | Yes (insert only) | Yes |
| news | No | No | Yes |
| live_messages | Yes | Yes | Yes |
| prayer_requests | No | Yes (insert only) | Yes |
| membership_requests | No | Yes (insert only) | Yes |
| contact_submissions | No | Yes (insert only) | Yes |
| donations | No | Yes (insert only) | Yes |
| events | Yes (active only) | No | Yes |
| media_gallery | Yes | No | Yes |
| announcements | Yes (active only) | No | Yes |
| testimonials | Yes (approved) | Yes (insert only) | Yes |

## Common Issues & Solutions

### Issue: "Permission denied" when inserting data
**Solution**: Ensure RLS policies are properly configured. Run the migration again.

### Issue: Supabase connection fails
**Solution**: Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are correct in `.env.local`

### Issue: Admin login not working
**Solution**: 
1. Verify admin user exists in Authentication → Users
2. Verify email matches in admin_users table
3. Use the Supabase password, not a different one

### Issue: Live chat not updating in real-time
**Solution**: 
1. Enable realtime in Database → Realtime settings
2. Check browser console for connection errors
3. Ensure you're subscribed to the correct channel

### Issue: Prayer requests not being sent via SMS
**Solution**:
1. Verify TERMII_API_KEY is set correctly
2. Verify LEADER_PHONE_NUMBER format is correct (e.g., +233xxxxxxxxx)
3. Check server logs for Termii API errors

## Data Seeding (Optional)

To add initial data to your database:

### Add sample news:
```sql
INSERT INTO public.news (title, excerpt, content, date, image) VALUES
('Welcome to MOC', 'The beginning of something great', 'Welcome to Martyrs of Christ World Outreach...', NOW(), 'https://...');
```

### Add sample events:
```sql
INSERT INTO public.events (title, description, start_date, location, event_type, is_active) VALUES
('Sunday Service', 'Join us for worship', NOW(), 'Accra', 'service', true);
```

### Add sample announcements:
```sql
INSERT INTO public.announcements (title, content, announcement_type, is_active) VALUES
('Welcome!', 'Welcome to our online community', 'info', true);
```

## Next Steps After Setup

1. **Configure Paystack** for donations (if using payment)
   - Add Paystack public key to environment
   - Update donation form with Paystack integration

2. **Setup Email Notifications** (optional)
   - Configure SMTP for email alerts
   - Send confirmation emails for submissions

3. **Populate Initial Data**
   - Add news articles
   - Add upcoming events
   - Add announcements

4. **Configure Admin Dashboard**
   - Train admins on managing content
   - Set up admin schedules

5. **Enable Monitoring**
   - Set up Supabase monitoring alerts
   - Monitor query performance

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Authentication**: https://supabase.com/docs/guides/auth
- **RLS Policies**: https://supabase.com/docs/guides/auth/row-level-security
- **Real-time**: https://supabase.com/docs/guides/real-time
- **Database Functions**: https://supabase.com/docs/guides/database/functions

## Completion Status

- [ ] Database tables created
- [ ] Admin user configured
- [ ] Environment variables set
- [ ] Storage buckets created (optional)
- [ ] Real-time enabled (optional)
- [ ] All forms tested and working
- [ ] Admin dashboard verified

**Setup Date**: ___________
**Completed By**: ___________
**Notes**: ___________
