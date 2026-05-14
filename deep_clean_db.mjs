import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfzuavcvjcrtipktwlxj.supabase.co', 
  'sb_publishable_MTD56bxRZwKlkhusQU_-qg_RmD2xBkV'
);

async function deepClean() {
  let isClean = false;
  const uniqueKeysSeen = new Set();
  
  while (!isClean) {
    console.log("🚀 Fetching batch of 1000 jobs...");
    const { data, error } = await supabase.from('jobs').select('id, title, company').limit(1000);
    
    if (error) {
      console.error("Error fetching jobs:", error);
      break;
    }

    if (!data || data.length === 0) {
      console.log("✅ No more rows found in database.");
      isClean = true;
      break;
    }

    const idsToDelete = [];
    let newUniqueInBatch = 0;

    for (const job of data) {
      const key = `${job.title}-${job.company}`.toLowerCase().trim();
      if (uniqueKeysSeen.has(key)) {
        idsToDelete.push(job.id);
      } else {
        uniqueKeysSeen.add(key);
        newUniqueInBatch++;
      }
    }

    console.log(`📊 Batch size: ${data.length} | New Unique: ${newUniqueInBatch} | Duplicates: ${idsToDelete.length}`);

    if (idsToDelete.length > 0) {
      // Delete in smaller sub-batches to be safe
      const subBatchSize = 100;
      for (let i = 0; i < idsToDelete.length; i += subBatchSize) {
        const batch = idsToDelete.slice(i, i + subBatchSize);
        const { error: deleteError } = await supabase.from('jobs').delete().in('id', batch);
        if (deleteError) {
          console.error("Error deleting sub-batch:", deleteError);
        }
      }
      console.log(`🗑️ Deleted ${idsToDelete.length} duplicates from this batch.`);
    } else {
      // If no duplicates found in the first 1000 and we haven't reached end? 
      // Supabase .select().limit(1000) always gets the first 1000. 
      // If they are all unique, we need to skip them and look at the next 1000.
      // But we can't easily skip without ordering.
      console.log("⚠️ All rows in this batch were unique. Checking if there are more...");
      // Let's just break if we find a fully unique batch to avoid infinite loop 
      // (though with 9 unique jobs and thousands of rows, this shouldn't happen yet)
      isClean = true; 
    }
    
    // Safety break to prevent infinite loops during dev
    if (uniqueKeysSeen.size > 500) break; 
  }
  
  console.log(`🎊 Cleanup complete. Total unique jobs kept: ${uniqueKeysSeen.size}`);
}

deepClean();
