import { MediaAnalyzer } from '../utils/mediaAnalyzer.js';

class ContentScript {
  constructor() {
    this.mediaAnalyzer = new MediaAnalyzer();
    this.initialize();
  }

  initialize() {
    this.injectDetectionButtons();
    this.setupMutationObserver();
  }

  injectDetectionButtons() {
    document.querySelectorAll('img, video').forEach(media => {
      if (!media.dataset.deepfakeProcessed) {
        this.mediaAnalyzer.addDetectionButton(media);
        media.dataset.deepfakeProcessed = 'true';
      }
    });
  }

  setupMutationObserver() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            node.querySelectorAll('img, video').forEach(media => {
              if (!media.dataset.deepfakeProcessed) {
                this.mediaAnalyzer.addDetectionButton(media);
                media.dataset.deepfakeProcessed = 'true';
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

new ContentScript();