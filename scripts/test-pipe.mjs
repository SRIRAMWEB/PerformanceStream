import puppeteer from 'puppeteer-core';
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'child_process';
import fs from 'fs';

console.log('Testing ffmpeg pipe with', ffmpegPath);

const ffmpeg = spawn(ffmpegPath, [
  '-y',
  '-f', 'image2pipe',
  '-vcodec', 'mjpeg',
  '-r', '10',
  '-i', '-',
  '-c:v', 'libx264',
  '-pix_fmt', 'yuv420p',
  'test_output.mp4',
]);

ffmpeg.stderr.on('data', (d) => {
  // console.log(d.toString());
});

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  defaultViewport: { width: 1280, height: 720 },
});

const page = await browser.newPage();
await page.goto('https://performancestream.vercel.app', { waitUntil: 'networkidle2' });

for (let i = 0; i < 20; i++) {
  const buf = await page.screenshot({ type: 'jpeg', quality: 70 });
  ffmpeg.stdin.write(buf);
}

ffmpeg.stdin.end();
await browser.close();

await new Promise((resolve) => ffmpeg.on('close', resolve));
console.log('Test video created, size:', fs.statSync('test_output.mp4').size);
fs.unlinkSync('test_output.mp4');
