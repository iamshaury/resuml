// offscreen.js

// 1. Helper to safely update status in storage
async function updateStatus(status) {
  console.log("Status Update:", status);
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ lastStatus: status });
    }
  } catch (e) {
    console.error("Failed to update status in storage:", e);
  }
}

// 2. Main Scraping Logic Trigger
async function handleStartHunt(query) {
  console.log("🔥 handleStartHunt triggered for:", query);
  try {
    // Update status safely
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ 
        jobs: [], 
        lastStatus: `Searching for "${query}"...` 
      });
    }

    const jobs = await scrapeLinkedIn(query);
    
    console.log(`🔥 Successfully Hunted ${jobs.length} Jobs:`, jobs);
    
    // Save to storage safely
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ 
        jobs: jobs, 
        lastStatus: `Success: Found ${jobs.length} jobs` 
      });
    }
    
    // Send to backend (we know this works!)
    await sendToBackend(jobs);
    await updateStatus(`Done! ${jobs.length} jobs saved.`);
  } catch (error) {
    console.error("Hunt failed:", error);
    await updateStatus(`Hunt failed: ${error.message}`);
  }
}

// 3. Listen for direct messages
chrome.runtime.onMessage.addListener(async (message) => {
  console.log("Offscreen received message:", message.type);
  if (message.target !== 'offscreen') return;
  if (message.type === 'START_HUNT') {
    handleStartHunt(message.query);
  }
});

// 4. Robust Auto-Trigger on Load
if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
  chrome.storage.local.get(['isScrapePending', 'lastQuery'], (result) => {
    if (result.isScrapePending) {
      console.log("🚀 Found pending hunt on load.");
      chrome.storage.local.set({ isScrapePending: false });
      handleStartHunt(result.lastQuery || 'Frontend Engineer');
    } else {
      chrome.runtime.sendMessage({ type: 'OFFSCREEN_READY' });
    }
  });
} else {
  console.error("CRITICAL: chrome.storage is not available in offscreen context!");
  // Still try to signal ready via messaging
  chrome.runtime.sendMessage({ type: 'OFFSCREEN_READY' });
}

async function scrapeLinkedIn(query) {
  let allExtractedJobs = [];
  const maxPages = 10// Fetch 5 pages to get up to 50 jobs
  
  for (let page = 0; page < maxPages; page++) {
    const start = page * 10;
    const searchUrl = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(query)}&location=Remote&start=${start}`;
    await updateStatus(`Fetching jobs (page ${page + 1}/${maxPages})...`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(searchUrl, {
        signal: controller.signal,
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`LinkedIn returned ${response.status} on page ${page + 1}`);
        break; // Stop if we hit an error (e.g., rate limit or end of results)
      }

      const html = await response.text();
      
      // If the page is empty, we reached the end of the results
      if (!html || html.trim() === '') {
        console.log("No more jobs returned.");
        break;
      }
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      let jobCards = Array.from(doc.querySelectorAll('.base-card, .job-search-card, .base-search-card, li'));
      
      let pageExtractedJobs = [];
      jobCards.forEach(card => {
        const title = (
          card.querySelector('.base-search-card__title') || 
          card.querySelector('.job-search-card__title') ||
          card.querySelector('h3') ||
          card.querySelector('.base-card__full-link')
        )?.textContent?.trim();

        const company = (
          card.querySelector('.base-search-card__subtitle') || 
          card.querySelector('.job-search-card__subtitle') ||
          card.querySelector('h4') ||
          card.querySelector('.base-search-card__secondary-subtitle')
        )?.textContent?.trim();

        const url = (
          card.querySelector('a.base-card__full-link') ||
          card.querySelector('a.base-search-card__full-link') ||
          card.querySelector('a')
        )?.href;
        
        if (title && company && title.length > 3 && url) {
          pageExtractedJobs.push({ title, company, url });
        }
      });

      // Regex Fallback
      if (pageExtractedJobs.length === 0) {
        const titleMatches = html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/g) || [];
        const companyMatches = html.match(/<h4[^>]*>([\s\S]*?)<\/h4>/g) || [];
        const urlMatches = html.match(/href="([^"]*?\/jobs\/view\/[^"]*?)"/g) || [];
        
        for (let i = 0; i < Math.min(titleMatches.length, companyMatches.length); i++) {
          const title = titleMatches[i].replace(/<[^>]*>/g, '').trim();
          const company = companyMatches[i].replace(/<[^>]*>/g, '').trim();
          let url = urlMatches[i] ? urlMatches[i].match(/href="([^"]+)"/)[1] : null;
          
          if (title && company && title.length > 3 && !title.includes('{') && url) {
            pageExtractedJobs.push({ title, company, url });
          }
        }
      }
      
      allExtractedJobs.push(...pageExtractedJobs);
      
      // If we got fewer than expected jobs, we might be at the end
      if (pageExtractedJobs.length < 10) {
        break;
      }
      
      // Small delay between pages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch(err) {
      console.error(`Scrape error on page ${page + 1}:`, err);
      break; // Stop fetching more pages on error
    }
  }
  
  // Final deduplication
  const seen = new Set();
  const uniqueJobs = allExtractedJobs.filter(job => {
    const id = `${job.title}-${job.company}`.toLowerCase();
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  console.log(`✅ Extracted ${uniqueJobs.length} unique jobs across all pages.`);
  return uniqueJobs;
}

async function sendToBackend(jobs) {
  if (!jobs || jobs.length === 0) return;

  try {
    await updateStatus(`Sending ${jobs.length} jobs to backend...`);
    const response = await fetch('http://localhost:3000/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobs: jobs }) 
    });

    if (response.ok) {
      await updateStatus(`Done! ${jobs.length} jobs saved.`);
    } else {
      await updateStatus(`Backend Error: ${response.status}`);
    }
  } catch (err) {
    console.error("Backend error:", err);
    await updateStatus("Backend unreachable (run npm run dev)");
  }
}

// Signal that we are ready to receive messages
console.log("Offscreen script loaded, signaling ready...");
chrome.runtime.sendMessage({ type: 'OFFSCREEN_READY' });