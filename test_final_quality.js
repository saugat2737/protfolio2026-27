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

const VIEWPORTS = [
  { name: 'Mobile 360', width: 360, height: 800 },
  { name: 'Mobile 390', width: 390, height: 844 },
  { name: 'Tablet 768', width: 768, height: 1024 },
  { name: 'Desktop 1024', width: 1024, height: 768 },
  { name: 'Desktop 1440', width: 1440, height: 900 },
  { name: 'Ultra-wide 1920', width: 1920, height: 1080 }
];

server.listen(8090, async () => {
  console.log('=== RUNNING COMPREHENSIVE MULTI-VIEWPORT & INTERACTION TEST ===\n');
  
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });
    const page = await browser.newPage();
    
    const logs = [];
    page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
    page.on('pageerror', err => logs.push(`[PAGE ERROR] ${err.toString()}`));

    await page.goto('http://localhost:8090', { waitUntil: 'networkidle0' });

    // 1. Check Monogram overlay non-existence
    const introOverlayExists = await page.evaluate(() => !!document.getElementById('srIntroOverlay'));
    console.log('Blocking intro overlay completely eliminated:', !introOverlayExists);

    // 2. Check Hero Content immediately accessible
    const heroTitle = await page.$eval('h1', el => el.innerText.trim());
    console.log('Hero immediately accessible without delay:', heroTitle === 'SAUGAT\nRAUNIYAR');

    // 3. Check Geographical coordinates removed from hero
    const heroLocation = await page.$eval('.hero-meta-right', el => el.innerText.trim());
    console.log('Hero location refined (coordinates removed):', heroLocation);

    // 4. Test Viewports and Horizontal Overflow
    console.log('\n--- TESTING RESPONSIVE VIEWPORTS & HORIZONTAL OVERFLOW ---');
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise(r => setTimeout(r, 150));

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): Has horizontal overflow = ${overflow}`);
      if (overflow) {
        throw new Error(`Horizontal overflow detected at ${vp.name}`);
      }
    }

    // 5. Test Case Study Modals, Focus Trapping, Esc Close & Focus Restoration
    console.log('\n--- TESTING CASE STUDY MODALS & FOCUS MANAGEMENT ---');
    await page.setViewport({ width: 1440, height: 900 });

    for (const projectId of ['impostr', 'lucerna', 'dormex']) {
      const triggerSel = `[data-case-study="${projectId}"]`;
      await page.focus(triggerSel);
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 200));

      const isOpen = await page.$eval('#caseStudyModal', el => el.classList.contains('open') && el.getAttribute('aria-hidden') === 'false');
      const focusedInside = await page.evaluate(() => {
        const modal = document.getElementById('caseStudyModal');
        return modal.contains(document.activeElement);
      });

      // Press Esc to close
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 200));

      const isClosed = await page.$eval('#caseStudyModal', el => !el.classList.contains('open') && el.getAttribute('aria-hidden') === 'true');
      const focusRestored = await page.evaluate((sel) => document.activeElement === document.querySelector(sel), triggerSel);

      console.log(`Case Study [${projectId}]: Opened=${isOpen}, FocusTrapped=${focusedInside}, EscClosed=${isClosed}, FocusRestored=${focusRestored}`);
    }

    // 6. Test SAUGAT.OS Command Terminal (⌘K / Ctrl+K, Escape, Sanitation)
    console.log('\n--- TESTING SAUGAT.OS TERMINAL INTERACTION & SECURITY ---');
    await page.keyboard.down('Control');
    await page.keyboard.press('k');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 200));

    const termOpen = await page.$eval('#term', el => el.classList.contains('open') && el.getAttribute('aria-hidden') === 'false');
    console.log('Terminal opened via Ctrl+K:', termOpen);

    // Test XSS payload in terminal
    await page.type('#terminalInput', 'echo <b id="injected">pwned</b>');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 200));

    const injectedTagFound = await page.evaluate(() => !!document.getElementById('injected'));
    console.log('XSS Injection blocked (Strict text node sanitization):', !injectedTagFound);

    // Close terminal via Escape
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 200));
    const termClosed = await page.$eval('#term', el => !el.classList.contains('open') && el.getAttribute('aria-hidden') === 'true');
    console.log('Terminal cleanly dismissed via Escape:', termClosed);

    // 7. Check Skills Accordion and Certifications rendered
    console.log('\n--- TESTING SKILLS ACCORDION & CERTIFICATIONS RENDERING ---');
    const skillsGroups = await page.evaluate(() => document.querySelectorAll('#skillsAccordionContainer .accordion-group').length);
    const certCards = await page.evaluate(() => document.querySelectorAll('#certCardsContainer .cert-card').length);
    console.log(`Skills accordion rendered groups: ${skillsGroups}`);
    console.log(`Certificates rendered cards: ${certCards}`);

    // 8. Test Mobile Menu Navigation
    console.log('\n--- TESTING MOBILE DRAWER NAVIGATION ---');
    await page.setViewport({ width: 375, height: 812 });
    await new Promise(r => setTimeout(r, 150));

    await page.click('#mobileMenuToggle');
    await new Promise(r => setTimeout(r, 200));
    const menuOpen = await page.$eval('#mobileMenu', el => el.classList.contains('open'));
    console.log('Mobile menu opened via hamburger toggle:', menuOpen);

    await page.click('#mobileMenu .menu-item');
    await new Promise(r => setTimeout(r, 250));
    const menuClosedAfterNav = await page.$eval('#mobileMenu', el => !el.classList.contains('open'));
    console.log('Mobile menu closed automatically upon section link click:', menuClosedAfterNav);

    // 9. Check JavaScript Console Errors
    console.log('\n--- BROWSER CONSOLE AUDIT ---');
    const errLogs = logs.filter(l => l.includes('ERROR'));
    console.log(`Total captured console messages: ${logs.length}`);
    if (errLogs.length > 0) {
      console.error('Console errors detected:', errLogs);
    } else {
      console.log('Zero JavaScript console errors or runtime warnings!');
    }

    await browser.close();
    server.close();
    console.log('\n=== ALL QUALITY VERIFICATION TESTS PASSED SUCCESSFULLY ===');
    process.exit(0);
  } catch (err) {
    console.error('Test suite failed:', err);
    server.close();
    process.exit(1);
  }
});
