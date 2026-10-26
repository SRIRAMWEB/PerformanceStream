import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const tmpDir = path.resolve('temp_test_frames');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

// Create 10 dummy 100x100 images or take screenshots
import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  defaultViewport: { width: 1280, height: 720 },
});
const page = await browser.newPage();
await page.goto('https://performancestream.vercel.app', { waitUntil: 'networkidle2' });

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(5, '0');
  await page.screenshot({ path: path.join(tmpDir, `frame_${num}.jpg`), type: 'jpeg', quality: 60 });
}
await browser.close();

// Now run ffmpeg
const proc = spawn(ffmpegPath, [
  '-y',
  '-framerate', '5',
  '-i', path.join(tmpDir, 'frame_%05d.jpg'),
  '-c:v', 'libx264',
  '-pix_fmt', 'yuv420p',
  'test_frames.mp4'
]);

proc.stderr.on('data', d => {});
proc.on('close', (code) => {
  console.log('ffmpeg done with code:', code, 'size:', fs.statSync('test_frames.mp4').size);
  // cleanup
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.unlinkSync('test_frames.mp4');
});
