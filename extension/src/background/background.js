import { ApiClient } from '../utils/apiClient.js';

const apiClient = new ApiClient();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'analyze_image':
      handleImageAnalysis(request, sendResponse);
      return true;
    case 'analyze_video':
      handleVideoAnalysis(request, sendResponse);
      return true;
    default:
      sendResponse({ error: 'Unknown request type' });
  }
});

async function handleImageAnalysis(request, sendResponse) {
  try {
    const result = await apiClient.analyzeImage(request.url);
    sendResponse(result);
  } catch (error) {
    sendResponse({ error: error.message });
  }
}

async function handleVideoAnalysis(request, sendResponse) {
  try {
    const result = await apiClient.analyzeVideo(request.url);
    sendResponse(result);
  } catch (error) {
    sendResponse({ error: error.message });
  }
}