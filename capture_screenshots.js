const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const viewports = [
  { width: 375, height: 812, name: '375px' },
  { width: 768, height: 1024, name: '768px' },
  { width: 1440, height: 900, name: '1440px' }
];

const themes = ['dark', 'light'];

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (const vp of viewports) {
    for (const theme of themes) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });

      // Set theme attribute
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('saugat_theme', t);
      }, theme);

      await new Promise(r => setTimeout(r, 200));

      // Helper to reveal and scroll
      async function captureEl(selector, filePath) {
        const el = await page.$(selector);
        if (el) {
          await page.evaluate((sel) => {
            const target = document.querySelector(sel);
            if (target) {
              target.scrollIntoView();
              target.querySelectorAll('[data-r]').forEach(r => r.classList.add('in'));
              if (target.hasAttribute('data-r')) target.classList.add('in');
            }
          }, selector);
          await new Promise(r => setTimeout(r, 200));
          await el.screenshot({ path: filePath });
        }
      }

      // 1. Hero
      await captureEl('header.hero', `screenshots/hero_${vp.name}_${theme}.png`);

      // 2. Selected Projects
      await captureEl('#projects', `screenshots/projects_${vp.name}_${theme}.png`);

      // 3. Achievements (featured hackafest + certs)
      await captureEl('#achievements', `screenshots/achievements_${vp.name}_${theme}.png`);

      // 4. Client Work
      await captureEl('#clients', `screenshots/clients_${vp.name}_${theme}.png`);

      // 5. Skills
      await captureEl('#skills-education', `screenshots/skills_${vp.name}_${theme}.png`);

      // 6. Case Study Modals (impostr, lucerna, dormex)
      for (const pId of ['impostr', 'lucerna', 'dormex']) {
        await page.evaluate((id) => {
          const btn = document.querySelector(`[data-case-study="${id}"]`);
          if (btn) btn.click();
        }, pId);
        await new Promise(r => setTimeout(r, 300));
        const modal = await page.$('#caseStudyModal .modal-window');
        if (modal) {
          await modal.screenshot({ path: `screenshots/modal_${pId}_${vp.name}_${theme}.png` });
        }
        await page.evaluate(() => {
          const close = document.getElementById('modalCloseBtn');
          if (close) close.click();
        });
        await new Promise(r => setTimeout(r, 200));
      }

      // 7. Terminal
      await page.evaluate(() => {
        const btn = document.getElementById('osNavBtn') || document.getElementById('osMobileBtn');
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 300));
      const term = await page.$('#term .terminal-window');
      if (term) {
        await term.screenshot({ path: `screenshots/terminal_${vp.name}_${theme}.png` });
      }
      await page.evaluate(() => {
        const close = document.getElementById('termCloseBtn');
        if (close) close.click();
      });
      await new Promise(r => setTimeout(r, 200));

      console.log(`Captured all for ${vp.name} [${theme}]`);
    }
  }

  await browser.close();
  console.log('--- ALL SCREENSHOTS COMPLETED ---');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
