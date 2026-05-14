import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfzuavcvjcrtipktwlxj.supabase.co', 
  'sb_publishable_MTD56bxRZwKlkhusQU_-qg_RmD2xBkV'
);

async function clean() {
  console.log("🚀 Fetching all jobs to identify duplicates...");
  const { data, error } = await supabase.from('jobs').select('id, title, company');
  
  if (error) {
    console.error("Error fetching jobs:", error);
    return;
  }

  const seen = new Set();
  const idsToDelete = [];

  for (const job of data) {
    const key = `${job.title}-${job.company}`.toLowerCase().trim();
    if (seen.has(key)) {
      idsToDelete.push(job.id);
    } else {
      seen.add(key);
    }
  }

  console.log(`📊 Found ${data.length} total rows.`);
  console.log(`✨ Found ${seen.size} unique jobs to keep.`);
  console.log(`🗑️ Found ${idsToDelete.length} duplicate rows to delete.`);

  if (idsToDelete.length === 0) {
    console.log("✅ Database is already clean!");
    return;
  }

  // Delete in batches of 100
  const batchSize = 100;
  for (let i = 0; i < idsToDelete.length; i += batchSize) {
    const batch = idsToDelete.slice(i, i + batchSize);
    console.log(`Deleting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(idsToDelete.length/batchSize)}...`);
    const { error: deleteError } = await supabase.from('jobs').delete().in('id', batch);
    if (deleteError) {
      console.error("Error deleting batch:", deleteError);
    }
  }

  console.log("🎊 Database cleanup complete!");
}

clean();
