import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://nfzuavcvjcrtipktwlxj.supabase.co', 
  'sb_publishable_MTD56bxRZwKlkhusQU_-qg_RmD2xBkV'
);
async function test() {
  const { data, error, count } = await supabase.from('jobs').select('title, company', { count: 'exact' });
  console.log(`Total rows: ${count}`);
  
  // get unique title/company combinations
  const unique = new Set();
  for (const job of data || []) {
    unique.add(`${job.title}-${job.company}`);
  }
  console.log(`Unique combinations: ${unique.size}`);
  
  // print first 5 unique
  const uniqueArr = Array.from(unique).slice(0, 5);
  console.log(uniqueArr);
}
test();
