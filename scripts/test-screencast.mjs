import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  defaultViewport: { width: 1920, height: 1080 },
});

const page = await browser.newPage();
const client = await page.target().createCDPSession();

let frameCount = 0;
client.on('Page.screencastFrame', async ({ data, sessionId }) => {
  frameCount++;
  await client.send('Page.screencastFrameAck', { sessionId });
});

await client.send('Page.startScreencast', { format: 'jpeg', quality: 80, everyNthFrame: 1 });
await page.goto('https://performancestream.vercel.app', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));
await client.send('Page.stopScreencast');
await browser.close();

console.log(`Captured ${frameCount} frames successfully!`);
