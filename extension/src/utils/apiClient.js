export class ApiClient {
  constructor() {
    this.baseUrl = 'http://localhost:5000/api';
  }

  async analyzeImage(imageUrl) {
    const response = await fetch(`${this.baseUrl}/detect-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: imageUrl })
    });
    
    if (!response.ok) {
      throw new Error('Image analysis failed');
    }
    
    return response.json();
  }

  async analyzeVideo(videoUrl) {
    const response = await fetch(`${this.baseUrl}/detect-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: videoUrl })
    });
    
    if (!response.ok) {
      throw new Error('Video analysis failed');
    }
    
    return response.json();
  }
}