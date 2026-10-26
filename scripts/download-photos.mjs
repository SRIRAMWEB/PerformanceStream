import fs from 'fs';
import path from 'path';

const IMAGES = [
  {
    slot: 'H1',
    fileName: 'h1-track-sprinter.jpg',
    url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1400&q=85',
    photographer: 'Sporthalle',
    pageUrl: 'https://unsplash.com/photos/1552674605-db6ffd4facb5',
    license: 'Unsplash License (free commercial use)',
    alt: 'Track and field sprinter accelerating on lane line at sunrise',
  },
  {
    slot: 'H2',
    fileName: 'h2-smartwatch-wearable.jpg',
    url: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=1000&q=85',
    photographer: 'Luke Chesser',
    pageUrl: 'https://unsplash.com/photos/1510017803434-a899398421b3',
    license: 'Unsplash License (free commercial use)',
    alt: 'Sports wearable telemetry sensor on athlete wrist monitoring heart rate',
  },
  {
    slot: 'H3',
    fileName: 'h3-coach-analytics.jpg',
    url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&q=85',
    photographer: 'Austin Distel',
    pageUrl: 'https://unsplash.com/photos/1541534741688-6078c6bfb5c5',
    license: 'Unsplash License (free commercial use)',
    alt: 'Athletic performance coach analyzing biometric data metrics',
  },
  {
    slot: 'H4',
    fileName: 'h4-stadium-dusk.jpg',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=85',
    photographer: 'Fauzan Saari',
    pageUrl: 'https://unsplash.com/photos/1574629810360-7efbbe195018',
    license: 'Unsplash License (free commercial use)',
    alt: 'Stadium floodlights illuminating arena at dusk',
  },
  {
    slot: 'A1',
    fileName: 'a1-server-architecture.jpg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=85',
    photographer: 'Taylor Vick',
    pageUrl: 'https://unsplash.com/photos/1558494949-ef010cbdcc31',
    license: 'Unsplash License (free commercial use)',
    alt: 'Secure data center server racks and network pipeline infrastructure',
  },
  {
    slot: 'S1',
    fileName: 's1-athlete-training.jpg',
    url: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=1400&q=85',
    photographer: 'Jonathan Borba',
    pageUrl: 'https://unsplash.com/photos/1538805060514-97d9cc17730c',
    license: 'Unsplash License (free commercial use)',
    alt: 'Athlete undergoing indoor biometric training session',
  },
];

async function downloadImages() {
  const dirs = [
    path.resolve(process.cwd(), 'public/images'),
    path.resolve(process.cwd(), 'src/assets/images'),
  ];

  dirs.forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  console.log('Downloading curated royalty-free photography...');

  for (const item of IMAGES) {
    try {
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      for (const d of dirs) {
        fs.writeFileSync(path.join(d, item.fileName), buffer);
      }
      console.log(`✓ Sourced [${item.slot}]: ${item.fileName} (${(buffer.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`Failed to download ${item.fileName}:`, err);
    }
  }

  // Generate CREDITS.md
  let creditsMd = `# Photo Credits & Licensing — PerformanceStream\n\n`;
  creditsMd += `All photography used in PerformanceStream is sourced from free-licence platforms (Unsplash) under permissible terms requiring no mandatory attribution for commercial or non-commercial usage. Local copies are stored in \`src/assets/images/\` and \`public/images/\`.\n\n`;
  creditsMd += `| Slot | File Name | Photographer | Source Page | License | Description |\n`;
  creditsMd += `|---|---|---|---|---|---|\n`;

  for (const item of IMAGES) {
    creditsMd += `| **${item.slot}** | \`${item.fileName}\` | ${item.photographer} | [Unsplash Link](${item.pageUrl}) | ${item.license} | ${item.alt} |\n`;
  }

  creditsMd += `\n---\n*Team Among Us · BreachX · Problem ID BRCX-SPT-03*\n`;

  fs.writeFileSync(path.resolve(process.cwd(), 'CREDITS.md'), creditsMd);
  console.log('✓ CREDITS.md generated successfully');
}

downloadImages().catch(console.error);
