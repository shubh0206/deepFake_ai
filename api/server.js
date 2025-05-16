import express from 'express';
import { process_image, process_video } from '../backend/api.js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 5000;

app.use(express.json({ limit: '50mb' }));

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

app.post('/api/detect-image', async (req, res) => {
  let tempPath;
  try {
    const { url } = req.body;
    tempPath = await downloadFile(url, 'image');
    
    const result = await process_image(
      tempPath, 
      "EfficientNetB4", 
      "DFDC", 
      0.5
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (tempPath && fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
});

app.post('/api/detect-video', async (req, res) => {
  let tempPath;
  try {
    const { url } = req.body;
    tempPath = await downloadFile(url, 'video');
    
    const result = await process_video(
      tempPath,
      "EfficientNetB4",
      "DFDC",
      0.5,
      30
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (tempPath && fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
});

async function downloadFile(url, type) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to download file');
  
  const ext = type === 'image' ? '.jpg' : '.mp4';
  const tempPath = path.join(tempDir, `temp_${Date.now()}${ext}`);
  
  const fileStream = fs.createWriteStream(tempPath);
  await new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
  
  return tempPath;
}

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});