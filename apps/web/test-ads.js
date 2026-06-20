const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/web/.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.rpc('get_active_ad_for_slot', { p_slot: 'fixed:vertical_left' });
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
