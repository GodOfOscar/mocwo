import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env');
  process.exit(1);
}

const supabase = createClient(url, key);

(async () => {
  try {
    const row = {
      title: 'TEST INSERT FROM BACKEND',
      day: 'Sunday',
      time_string: '8AM',
      description: 'test',
      details: 'test details',
      image: '⛪',
      color: 'from-blue-500 to-blue-600',
      live_link: 'https://example.com',
      is_live: false,
      order_index: 999
    };

    const { data, error } = await supabase.from('church_schedule').insert([row]).select();
    if (error) {
      console.error('Supabase error:', error);
      process.exit(1);
    }

    console.log('Inserted row:', JSON.stringify(data, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Unhandled error:', err);
    process.exit(1);
  }
})();
