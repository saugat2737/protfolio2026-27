const fs = require('fs');
const https = require('https');
const http = require('http');

console.log('=== RUNNING ASSET & LINK VERIFICATION AUDIT ===\n');

const html = fs.readFileSync('index.html', 'utf8');
const dataJs = fs.readFileSync('data.js', 'utf8');

// 1. Check all local assets
const localAssets = [
  ...[...html.matchAll(/(?:src|href)=\"(\.\/assets\/[^\"]+)\"/g)].map(m => m[1]),
  ...[...dataJs.matchAll(/\"(\.\/assets\/[^\"]+)\"/g)].map(m => m[1])
];

const uniqueLocal = [...new Set(localAssets)];
console.log(`Checking ${uniqueLocal.length} unique local assets:`);
let localFailed = 0;
for (const asset of uniqueLocal) {
  const filePath = asset.replace('./', '');
  if (fs.existsSync(filePath)) {
    console.log(`  [OK] ${asset} (${fs.statSync(filePath).size} bytes)`);
  } else {
    console.error(`  [BROKEN] ${asset}`);
    localFailed++;
  }
}

// 2. Check external URLs
const externalUrls = [
  ...[...html.matchAll(/href=\"(https?:\/\/[^\"]+)\"/g)].map(m => m[1]),
  ...[...dataJs.matchAll(/\"(https?:\/\/[^\"]+)\"/g)].map(m => m[1])
];

const uniqueExternal = [...new Set(externalUrls)].filter(u => !u.includes('w3.org') && !u.includes('fonts.'));
console.log(`\nChecking ${uniqueExternal.length} external URLs for bare profile:`);

let bareProfileFound = 0;
for (const u of uniqueExternal) {
  if (u === 'https://github.com/saugat2737' || u === 'https://github.com/saugat2737/') {
    // Check where it comes from
    console.log(`  [FLAG] Found bare GitHub profile link: ${u}`);
    bareProfileFound++;
  } else {
    console.log(`  [OK] Specific destination: ${u}`);
  }
}

console.log(`\nLocal assets failed: ${localFailed}`);
console.log(`Bare profile links in project context: ${bareProfileFound}`);
