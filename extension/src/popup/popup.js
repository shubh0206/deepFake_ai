document.addEventListener('DOMContentLoaded', function() {
  const analyzeBtn = document.getElementById('analyzePageBtn');
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const imagesScanned = document.getElementById('imagesScanned');
  const videosScanned = document.getElementById('videosScanned');
  const autoScanToggle = document.getElementById('autoScanToggle');
  const thresholdSlider = document.getElementById('thresholdSlider');
  const thresholdValue = document.getElementById('thresholdValue');

  // Load saved settings
  chrome.storage.sync.get(['autoScan', 'threshold'], function(data) {
    autoScanToggle.checked = data.autoScan !== false; // Default true
    thresholdSlider.value = data.threshold || 0.7;
    thresholdValue.textContent = `${Math.round(data.threshold * 100) || 70}%`;
  });

  // Update threshold display
  thresholdSlider.addEventListener('input', function() {
    const value = Math.round(this.value * 100);
    thresholdValue.textContent = `${value}%`;
    chrome.storage.sync.set({ threshold: this.value });
  });

  // Save auto-scan setting
  autoScanToggle.addEventListener('change', function() {
    chrome.storage.sync.set({ autoScan: this.checked });
  });

  // Analyze button click handler
  analyzeBtn.addEventListener('click', function() {
    setStatus('analyzing', 'Analyzing page...');
    
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: 'analyze_all',
        threshold: parseFloat(thresholdSlider.value)
      }, function(response) {
        if (chrome.runtime.lastError) {
          setStatus('error', 'Error: ' + chrome.runtime.lastError.message);
          return;
        }
        
        if (response) {
          updateStats(response.images, response.videos);
          setStatus('complete', `Found ${response.fakeCount} potential deepfakes`);
        }
      });
    });
  });

  // Update status UI
  function setStatus(state, message) {
    statusText.textContent = message;
    statusIndicator.className = 'status-indicator';
    
    switch (state) {
      case 'ready':
        statusIndicator.classList.add('status-ready');
        break;
      case 'analyzing':
        statusIndicator.classList.add('status-analyzing');
        break;
      case 'complete':
        statusIndicator.classList.add('status-complete');
        break;
      case 'error':
        statusIndicator.classList.add('status-error');
        break;
    }
  }

  // Update statistics
  function updateStats(imageCount, videoCount) {
    imagesScanned.textContent = imageCount || 0;
    videosScanned.textContent = videoCount || 0;
  }

  // Initialize
  setStatus('ready', 'Ready to analyze');
});