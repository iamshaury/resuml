// popup.js
// Display jobs and status stored in chrome.storage

document.addEventListener('DOMContentLoaded', async () => {
  const jobList = document.getElementById('job-list');
  const statusText = document.getElementById('status-text');
  const lastRunText = document.getElementById('last-run-text');
  const scrapeBtn = document.getElementById('scrape-btn');

  function updateUI() {
    chrome.storage.local.get(['jobs', 'lastStatus', 'lastRun'], (result) => {
      console.log('Popup storage result:', result);
      // Update Jobs
      const jobs = result.jobs || [];
      if (jobs.length === 0) {
        jobList.innerHTML = '<li class="empty-state">No jobs found yet. Start a hunt!</li>';
      } else {
        jobList.innerHTML = ''; // Clear the list before appending new ones
        jobs.forEach(job => {
          const li = document.createElement('li');
          li.className = 'job-card';
          
          // Make the title a clickable link to the actual job
          const titleContent = job.url 
            ? `<a href="${job.url}" target="_blank" class="job-link" style="color: #4CAF50; text-decoration: none;" title="Open Job on LinkedIn">${job.title} <span style="font-size: 0.8em; opacity: 0.7;">↗</span></a>`
            : job.title;

          li.innerHTML = `
            <div class="job-title">${titleContent}</div>
            <div class="job-company">${job.company}</div>
          `;
          jobList.appendChild(li);
        });
      }

      // Update Status
      statusText.innerText = result.lastStatus || 'Ready';
      if (result.lastRun) {
        lastRunText.innerText = 'Last run: ' + new Date(result.lastRun).toLocaleString();
      }
    });
  }

  // Initial update
  updateUI();

  // Listen for storage changes to update UI immediately
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.jobs || changes.lastStatus) {
      console.log('Storage changed, updating UI...');
      updateUI();
    }
  });

  // Poll for status updates while popup is open (fallback)
  const pollInterval = setInterval(updateUI, 2000);
  window.addEventListener('unload', () => clearInterval(pollInterval));

  // Handle manual scrape button
  scrapeBtn.addEventListener('click', () => {
    const query = document.getElementById('query-input').value || 'Frontend Engineer';
    scrapeBtn.disabled = true;
    scrapeBtn.innerText = 'Scraping...';
    
    chrome.runtime.sendMessage({ type: 'FORCE_SCRAPE', query: query }, (response) => {
      console.log('Scrape response:', response);
      setTimeout(() => {
        scrapeBtn.disabled = false;
        scrapeBtn.innerText = 'Force Scrape Now';
      }, 3000);
    });
  });
});

