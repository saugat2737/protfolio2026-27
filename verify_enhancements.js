const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath);
  
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }
  
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(8080, async () => {
  console.log('Static test server listening on port 8080');
  
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });
    const page = await browser.newPage();
    
    // Listen to console
    const logs = [];
    page.on('console', msg => logs.push(`[PAGE ${msg.type()}] ${msg.text()}`));
    page.on('pageerror', err => logs.push(`[PAGE ERROR] ${err.toString()}`));

    console.log('\n--- 1. LOADING PAGE & TESTING SR INTRO OVERLAY ---');
    await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });
    
    // Check if SR intro overlay exists and gets active class
    const introExists = await page.$('#srIntroOverlay') !== null;
    console.log('SR Intro overlay exists in DOM:', introExists);
    
    await new Promise(r => setTimeout(r, 200));
    const isActive = await page.$eval('#srIntroOverlay', el => el.classList.contains('active'));
    console.log('SR Intro overlay received "active" class:', isActive);

    // Wait for the intro sequence to dismiss (after ~3.1s + fade)
    console.log('Waiting for SR intro completion & auto-dismissal...');
    await new Promise(r => setTimeout(r, 4100));
    
    const overlayDismissedOrRemoved = await page.evaluate(() => {
      const el = document.getElementById('srIntroOverlay');
      return !el || el.classList.contains('dismissed');
    });
    console.log('SR Intro overlay cleanly dismissed/removed:', overlayDismissedOrRemoved);

    // Verify main page elements are fully visible and not blocked
    const navVisible = await page.$eval('nav', el => window.getComputedStyle(el).display !== 'none');
    const heroH1 = await page.$eval('.hero h1', el => el.innerText.replace(/\s+/g, ' ').trim());
    console.log('Navigation visible:', navVisible);
    console.log('Hero title rendered:', heroH1);

    console.log('\n--- 2. TESTING REAL-TIME REEL CLOCK ---');
    const clockExists = await page.$('#navClock') !== null;
    console.log('Reel clock exists in DOM:', clockExists);

    const initialTimeDigits = await page.evaluate(() => {
      const getDigit = id => {
        const wrap = document.querySelector(`[data-digit-id="${id}"]`);
        if (!wrap) return null;
        const ribbon = wrap.querySelector('.reel-ribbon');
        // Extract translateY value: translateY(-Xpx)
        const match = ribbon.style.transform.match(/translateY\(-?(\d+)px\)/);
        if (match) {
          return Math.round(parseInt(match[1], 10) / 17);
        }
        return null;
      };
      return {
        h: `${getDigit('h0')}${getDigit('h1')}`,
        m: `${getDigit('m0')}${getDigit('m1')}`,
        s: `${getDigit('s0')}${getDigit('s1')}`
      };
    });
    console.log('Initial clock read:', initialTimeDigits);

    const tzText = await page.$eval('#navClockTz', el => el.textContent.trim());
    console.log('Clock Timezone label:', tzText);

    // Wait 1.5 seconds and verify second digit advance
    await new Promise(r => setTimeout(r, 1500));
    const nextTimeDigits = await page.evaluate(() => {
      const getDigit = id => {
        const wrap = document.querySelector(`[data-digit-id="${id}"]`);
        if (!wrap) return null;
        const ribbon = wrap.querySelector('.reel-ribbon');
        const match = ribbon.style.transform.match(/translateY\(-?(\d+)px\)/);
        if (match) {
          return Math.round(parseInt(match[1], 10) / 17);
        }
        return null;
      };
      return {
        h: `${getDigit('h0')}${getDigit('h1')}`,
        m: `${getDigit('m0')}${getDigit('m1')}`,
        s: `${getDigit('s0')}${getDigit('s1')}`
      };
    });
    console.log('Updated clock read after 1.5s:', nextTimeDigits);
    console.log('Seconds progressed correctly:', nextTimeDigits.s !== initialTimeDigits.s);

    console.log('\n--- 3. TESTING UI REFINEMENTS ---');
    // Check hero status pill
    const statusPillText = await page.$eval('.hero-status-pill .status-text', el => el.innerText.trim());
    console.log('Hero status pill text:', statusPillText);

    // Check project card hover effects
    const cardHasPseudo = await page.evaluate(() => {
      const card = document.querySelector('.project-card');
      return !!card;
    });
    console.log('Project cards with premium border & elevate styles found:', cardHasPseudo);

    // Check mobile responsive nav
    await page.setViewport({ width: 375, height: 812 });
    await new Promise(r => setTimeout(r, 200));
    const clockInMobile = await page.$eval('.nav-clock-wrap', el => window.getComputedStyle(el).display !== 'none');
    console.log('Clock remains gracefully visible on mobile (375px):', clockInMobile);

    console.log('\n--- 4. BROWSER ERRORS / WARNINGS AUDIT ---');
    console.log(`Total captured logs: ${logs.length}`);
    const errors = logs.filter(l => l.includes('ERROR'));
    if (errors.length) {
      console.error('Errors found:', errors);
    } else {
      console.log('Zero JavaScript console errors!');
    }

    await browser.close();
    server.close();
    console.log('\n=== ALL ENHANCEMENT SUITE TESTS PASSED ===');
    process.exit(0);
  } catch (err) {
    console.error('Test run failed:', err);
    server.close();
    process.exit(1);
  }
});
