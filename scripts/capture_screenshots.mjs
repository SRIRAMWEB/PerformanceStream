import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\Sriram\\.gemini\\antigravity-ide\\brain\\5e915003-332b-4f2d-bd28-9d63c9d9894d';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const PAGES = [
  { name: 'home', url: 'http://localhost:3000/' },
  { name: 'simulator', url: 'http://localhost:3000/simulator' },
  { name: 'architecture', url: 'http://localhost:3000/architecture' },
];

const VIEWPORTS = [
  { width: 1280, height: 900, suffix: '1280px' },
  { width: 375, height: 812, suffix: '375px', isMobile: true },
];

async function capture() {
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const p of PAGES) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        isMobile: !!vp.isMobile,
      });

      console.log(`Navigating to ${p.url} at ${vp.suffix}...`);
      await page.goto(p.url, { waitUntil: 'networkidle0', timeout: 30000 });
      // Short delay for fonts and layout stabilization
      await new Promise((r) => setTimeout(r, 1000));

      const screenshotFile = path.join(ARTIFACT_DIR, `${p.name}_${vp.suffix}.png`);
      await page.screenshot({ path: screenshotFile, fullPage: true });
      console.log(`Saved screenshot: ${screenshotFile}`);
      await page.close();
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot error:', err);
  process.exit(1);
});
