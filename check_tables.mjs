import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfzuavcvjcrtipktwlxj.supabase.co', 
  'sb_publishable_MTD56bxRZwKlkhusQU_-qg_RmD2xBkV'
);

async function check() {
  console.log("Checking tables...");
  for (const table of ['profiles', 'user_profiles', 'applications', 'job_applications', 'user_preferences', 'preferences']) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`Table '${table}': Error - ${error.message} (${error.code})`);
      } else {
        console.log(`Table '${table}': Success - exists! Data:`, data);
      }
    } catch (e) {
      console.log(`Table '${table}': Threw exception - ${e.message}`);
    }
  }
}

check();
