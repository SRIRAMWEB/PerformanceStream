import fs from 'fs';
import path from 'path';

const FORBIDDEN_WORDS = [
  'TikTok',
  'Snapchat',
  'Discord',
  'WhatsApp',
  'legally binding',
  'Judges',
  'lorem',
  'OpenAI',
  'Growlio',
  'CAPRIX',
  'TODO',
];

const SCAN_DIRS = ['src', 'app', 'components', 'lib', 'scripts'];
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css', '.html', '.md'];

function scanFile(filePath, errors) {
  const content = fs.readFileSync(filePath, 'utf-8');
  for (const word of FORBIDDEN_WORDS) {
    // Regex for case-insensitive match
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(content)) {
      errors.push(`[FORBIDDEN CONTENT] Found "${word}" in ${filePath}`);
    }
  }
}

function scanDir(dir, errors) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        scanDir(fullPath, errors);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (SCAN_EXTENSIONS.includes(ext) && entry.name !== 'check-content.mjs') {
        scanFile(fullPath, errors);
      }
    }
  }
}

const errors = [];
for (const dir of SCAN_DIRS) {
  scanDir(path.resolve(process.cwd(), dir), errors);
}

// Also check README.md
const readmePath = path.resolve(process.cwd(), 'README.md');
if (fs.existsSync(readmePath)) {
  scanFile(readmePath, errors);
}

if (errors.length > 0) {
  console.error('\n❌ Content check failed! Found forbidden terms:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log('✅ Content check passed: No prohibited terms found in source files.');
  process.exit(0);
}
