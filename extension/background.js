// 1. Wake the extension up every 6 hours (or 1 minute for testing!)
chrome.alarms.create("scrapeJobs", { periodInMinutes: 1 }); 

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(`Alarm "${alarm.name}" triggered at ${new Date().toLocaleTimeString()}`);
  if (alarm.name === "scrapeJobs") {
    startScraping();
  }
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message.type);

  if (message.type === 'FORCE_SCRAPE') {
    const query = message.query || 'Frontend Engineer';
    console.log("Manual scrape triggered for:", query);
    startScraping(query);
    sendResponse({ status: 'Scraping started' });
  }
  
  if (message.type === 'OFFSCREEN_READY') {
    console.log("✅ Offscreen document is READY and WAITING.");
    chrome.storage.local.get(['lastQuery', 'isScrapePending'], (result) => {
      if (result.isScrapePending) {
        console.log("🚀 Resuming pending scrape for:", result.lastQuery);
        chrome.runtime.sendMessage({
          target: 'offscreen',
          type: 'START_HUNT',
          query: result.lastQuery || 'Frontend Engineer'
        });
        chrome.storage.local.set({ isScrapePending: false });
      }
    });
  }
});

async function startScraping(query = 'Frontend Engineer') {
  console.log(`🚀 startScraping called for: ${query}`);
  try {
    const lastRun = new Date().toISOString();
    await chrome.storage.local.set({ 
      lastStatus: "Initializing hunt...", 
      lastRun: lastRun,
      lastQuery: query,
      isScrapePending: true,
      jobs: [] // Clear old jobs at start
    });
    
    await setupOffscreenDocument('offscreen.html');
    
    // If it was already open, OFFSCREEN_READY won't fire again immediately.
    // So we manually trigger it.
    const offscreenUrl = chrome.runtime.getURL('offscreen.html');
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
      documentUrls: [offscreenUrl]
    });

    if (existingContexts.length > 0) {
      console.log("Offscreen already exists, sending START_HUNT directly.");
      chrome.runtime.sendMessage({
        target: 'offscreen',
        type: 'START_HUNT',
        query: query
      });
      chrome.storage.local.set({ isScrapePending: false });
    }
  } catch (error) {
    console.error("Error in startScraping:", error);
    await chrome.storage.local.set({ lastStatus: `Error: ${error.message}` });
  }
}

// 2. Safely create the hidden offscreen document
async function setupOffscreenDocument(path) {
  const offscreenUrl = chrome.runtime.getURL(path);
  
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl]
  });

  if (existingContexts.length > 0) return;

  await chrome.offscreen.createDocument({
    url: path,
    reasons: ['DOM_PARSER'], 
    justification: 'Background scraping of job boards for ML matchmaking'
  });
}