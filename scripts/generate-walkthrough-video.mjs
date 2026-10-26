import puppeteer from 'puppeteer-core';
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const FPS = 10;
const DURATION_SECS = 86;
const TOTAL_FRAMES = FPS * DURATION_SECS; // ~860 frames
const WIDTH = 1920;
const HEIGHT = 1080;

const BASE_URL = 'https://performancestream.vercel.app';
const AUDIO_PATH = path.resolve('public/audio/demo_video_voiceover.wav');
const OUTPUT_DIR = path.resolve('public/videos');
const OUTPUT_MP4 = path.join(OUTPUT_DIR, 'performancestream_walkthrough.mp4');
const ROOT_MP4 = path.resolve('performancestream_walkthrough.mp4');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const framesDir = path.resolve('temp_video_frames');
if (fs.existsSync(framesDir)) {
  fs.rmSync(framesDir, { recursive: true, force: true });
}
fs.mkdirSync(framesDir, { recursive: true });

console.log(`Starting video capture: ${TOTAL_FRAMES} frames @ ${FPS} fps (${DURATION_SECS}s)`);
console.log(`Target URL: ${BASE_URL}`);
console.log(`Audio Path: ${AUDIO_PATH}`);

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
});

const page = await browser.newPage();

let frameIndex = 0;

async function captureFrames(count) {
  for (let i = 0; i < count; i++) {
    frameIndex++;
    const filename = `frame_${String(frameIndex).padStart(5, '0')}.jpg`;
    const filepath = path.join(framesDir, filename);
    await page.screenshot({ path: filepath, type: 'jpeg', quality: 80 });
    if (frameIndex % 50 === 0 || frameIndex === TOTAL_FRAMES) {
      console.log(`Captured frame ${frameIndex} / ${TOTAL_FRAMES} (${Math.round((frameIndex / TOTAL_FRAMES) * 100)}%)`);
    }
  }
}

async function smoothScroll(distance, durationFrames) {
  const step = distance / durationFrames;
  for (let i = 0; i < durationFrames; i++) {
    await page.evaluate((s) => window.scrollBy(0, s), step);
    frameIndex++;
    const filename = `frame_${String(frameIndex).padStart(5, '0')}.jpg`;
    await page.screenshot({ path: path.join(framesDir, filename), type: 'jpeg', quality: 80 });
  }
}

try {
  // === PHASE 1: HOME PAGE (0s - 16s = 160 frames) ===
  console.log('\n--- Phase 1: Home Page & Threat Landscape ---');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('h1', { timeout: 10000 });

  // Hide the floating audio tour widget during recording for clean video
  await page.evaluate(() => {
    const el = document.querySelector('.fixed.bottom-5.right-5');
    if (el) el.style.display = 'none';
  });

  // Hold on Hero (3s = 30 frames)
  await captureFrames(30);

  // Smooth scroll down to verification overview (4s = 40 frames)
  await smoothScroll(650, 40);

  // Click step buttons 02, 03, 04 (6s = 60 frames)
  const stepButtons = await page.$$('button');
  for (const btn of stepButtons) {
    const text = await (await btn.getProperty('textContent')).jsonValue();
    if (text === '02') {
      await btn.click();
      await captureFrames(20);
    } else if (text === '03') {
      await btn.click();
      await captureFrames(20);
    } else if (text === '04') {
      await btn.click();
      await captureFrames(20);
    }
  }

  // Hold slightly (10 frames)
  await captureFrames(10);

  // === PHASE 2: ARCHITECTURE PAGE (16s - 34s = 180 frames) ===
  console.log('\n--- Phase 2: Architecture Page & 5-Check Gate ---');
  await page.goto(`${BASE_URL}/architecture`, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const el = document.querySelector('.fixed.bottom-5.right-5');
    if (el) el.style.display = 'none';
  });

  // Hold top (30 frames)
  await captureFrames(30);

  // Scroll through pipeline stages (60 frames)
  await smoothScroll(600, 60);
  await captureFrames(30);

  // Scroll down further to inspect gate checks (60 frames)
  await smoothScroll(500, 40);
  await captureFrames(20);

  // === PHASE 3: LIVE ATTACK SIMULATOR (34s - 68s = 340 frames) ===
  console.log('\n--- Phase 3: Live Attack Demonstrations ---');
  await page.goto(`${BASE_URL}/simulator`, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const el = document.querySelector('.fixed.bottom-5.right-5');
    if (el) el.style.display = 'none';
  });

  // Hold top of simulator (30 frames)
  await captureFrames(30);

  // Scroll to scenario cards & gate (30 frames)
  await smoothScroll(380, 30);
  await captureFrames(15);

  // 1. Run Fake Sensor scenario
  console.log('Running Attack: Fake Sensor');
  const fakeBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent?.includes('Fake Sensor') || b.textContent?.includes('fake_sensor'));
  });
  if (fakeBtn && fakeBtn.asElement()) {
    await fakeBtn.asElement().click();
  }
  await captureFrames(45); // Watch Check 1 fail

  // 2. Run Changed Value scenario
  console.log('Running Attack: Changed Value');
  const changedBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent?.includes('Changed Value') || b.textContent?.includes('changed_value'));
  });
  if (changedBtn && changedBtn.asElement()) {
    await changedBtn.asElement().click();
  }
  await captureFrames(45); // Watch Check 2 fail

  // 3. Run Stolen Key scenario
  console.log('Running Attack: Stolen Key');
  const stolenBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent?.includes('Stolen Key') || b.textContent?.includes('stolen_key'));
  });
  if (stolenBtn && stolenBtn.asElement()) {
    await stolenBtn.asElement().click();
  }
  await captureFrames(45); // Watch Check 5 quarantine

  // Scroll down to the Heart Rate Chart (40 frames)
  await smoothScroll(450, 40);
  await captureFrames(30);

  // Click on a point in the chart or trigger trace reading
  console.log('Inspecting telemetry trace point');
  const tracePoint = await page.evaluateHandle(() => {
    // Click on svg circle in the chart if exists
    return document.querySelector('circle[r]') || document.querySelector('svg circle');
  });
  if (tracePoint && tracePoint.asElement()) {
    await tracePoint.asElement().click();
  }
  await captureFrames(35);

  // Scroll to Ledger section (30 frames)
  await smoothScroll(400, 30);

  // Click Verify Ledger button
  console.log('Verifying Ledger');
  const verifyBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent?.includes('Verify') || b.textContent?.includes('Chain'));
  });
  if (verifyBtn && verifyBtn.asElement()) {
    await verifyBtn.asElement().click();
  }
  await captureFrames(25);

  // Click Tamper Ledger button
  console.log('Simulating Ledger Tampering');
  const tamperBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent?.includes('Tamper') || b.textContent?.includes('Break'));
  });
  if (tamperBtn && tamperBtn.asElement()) {
    await tamperBtn.asElement().click();
  }
  await captureFrames(30);

  // === PHASE 4: OUTRO & CONCLUSION (68s - 86s = 180 frames) ===
  console.log('\n--- Phase 4: Conclusion & Overview ---');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const el = document.querySelector('.fixed.bottom-5.right-5');
    if (el) el.style.display = 'none';
  });

  // Hold on Hero headline & branding until end of audio
  const remaining = Math.max(0, TOTAL_FRAMES - frameIndex);
  console.log(`Holding outro for remaining ${remaining} frames...`);
  await captureFrames(remaining);

  await browser.close();
  console.log(`\nAll ${frameIndex} frames captured successfully!`);

  // === PHASE 5: FFMPEG ENCODING WITH AUDIO ===
  console.log('\n--- Phase 5: Encoding MP4 Video with Voiceover Track ---');
  const inputPattern = path.join(framesDir, 'frame_%05d.jpg');

  const ffmpegArgs = [
    '-y',
    '-framerate', String(FPS),
    '-i', inputPattern,
    '-i', AUDIO_PATH,
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-level', '4.2',
    '-preset', 'fast',
    '-crf', '22',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    OUTPUT_MP4
  ];

  console.log('Running ffmpeg encoding...');
  const encodeProc = spawn(ffmpegPath, ffmpegArgs);

  encodeProc.stderr.on('data', (d) => {
    const text = d.toString();
    const match = text.match(/frame=\s*(\d+)/);
    if (match) {
      process.stdout.write(`Encoding: frame ${match[1]} / ${frameIndex}\r`);
    }
  });

  await new Promise((resolve, reject) => {
    encodeProc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  // Copy to root workspace so user can easily open it directly
  fs.copyFileSync(OUTPUT_MP4, ROOT_MP4);

  const stats = fs.statSync(OUTPUT_MP4);
  console.log(`\n\n🎉 SUCCESS! MP4 Video Generated:`);
  console.log(`- Path: ${OUTPUT_MP4}`);
  console.log(`- Root Path: ${ROOT_MP4}`);
  console.log(`- Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);

  // Clean up frames
  console.log('Cleaning up temporary image frames...');
  fs.rmSync(framesDir, { recursive: true, force: true });
  console.log('Done!');
} catch (err) {
  console.error('Error during video walkthrough generation:', err);
  await browser.close();
  process.exit(1);
}
