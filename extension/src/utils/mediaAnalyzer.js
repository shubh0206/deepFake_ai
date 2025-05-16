export class MediaAnalyzer {
  constructor() {
    this.apiEndpoint = 'http://localhost:5000/api';
  }

  addDetectionButton(mediaElement) {
    const container = this.createMediaContainer(mediaElement);
    const button = this.createDetectionButton(mediaElement);
    container.appendChild(button);
  }

  createMediaContainer(mediaElement) {
    const container = document.createElement('div');
    container.className = 'deepfake-media-container';
    
    mediaElement.parentNode.insertBefore(container, mediaElement);
    container.appendChild(mediaElement);
    
    return container;
  }

  createDetectionButton(mediaElement) {
    const button = document.createElement('button');
    button.className = 'deepfake-detection-btn';
    button.textContent = 'Detect Deepfake';
    
    button.addEventListener('click', async () => {
      button.disabled = true;
      button.textContent = 'Analyzing...';
      
      try {
        const result = await this.analyzeMedia(mediaElement);
        this.displayResult(mediaElement, result);
      } catch (error) {
        console.error('Detection failed:', error);
        button.textContent = 'Error - Try Again';
      } finally {
        setTimeout(() => {
          button.disabled = false;
          button.textContent = 'Detect Deepfake';
        }, 3000);
      }
    });
    
    return button;
  }

  async analyzeMedia(mediaElement) {
    const response = await fetch(`${this.apiEndpoint}/detect-${mediaElement.tagName.toLowerCase()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: mediaElement.src })
    });
    
    if (!response.ok) {
      throw new Error('Analysis failed');
    }
    
    return response.json();
  }

  displayResult(mediaElement, result) {
    const resultElement = document.createElement('div');
    resultElement.className = `deepfake-result deepfake-result-${result.result}`;
    resultElement.innerHTML = `
      <strong>${result.result.toUpperCase()}</strong>
      <div>${(result.confidence * 100).toFixed(1)}% confidence</div>
    `;
    
    mediaElement.parentNode.appendChild(resultElement);
    
    setTimeout(() => {
      resultElement.remove();
    }, 5000);
  }
}