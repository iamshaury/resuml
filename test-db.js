import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://nfzuavcvjcrtipktwlxj.supabase.co', 
  'sb_publishable_MTD56bxRZwKlkhusQU_-qg_RmD2xBkV'
);
async function test() {
  const { data, error } = await supabase.from('jobs').select('*').limit(1);
  console.log(Object.keys(data[0]));
}
test();
