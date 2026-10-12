const puppeteer = require('puppeteer-core');

async function testA11yAndKeyboard() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });

  // 1. Terminal XSS test
  console.log('--- TESTING TERMINAL XSS ---');
  let alertTriggered = false;
  page.on('dialog', async d => {
    alertTriggered = true;
    console.error('ALERT TRIGGERED (XSS FAILURE):', d.message());
    await d.dismiss();
  });

  // Open terminal
  await page.click('#osNavBtn');
  await new Promise(r => setTimeout(r, 200));

  // Type payload into terminal input
  const xssPayload = 'open <img src=x onerror=alert(1)>';
  await page.type('#terminalInput', xssPayload);
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 300));

  const outputText = await page.$eval('#terminalOutput', el => el.innerText);
  const outputHTML = await page.$eval('#terminalOutput', el => el.innerHTML);
  console.log('Alert triggered:', alertTriggered);
  console.log('Contains sanitized output in text:', outputText.includes('<img src=x onerror=alert(1)>'));
  console.log('Contains raw unescaped img tag in HTML:', outputHTML.includes('<img src="x"'));

  // 2. Test Esc key on Terminal
  console.log('\n--- TESTING ESC ON TERMINAL ---');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 200));
  const termOpenAfterEsc = await page.$eval('#term', el => el.classList.contains('open'));
  console.log('Terminal open after Esc:', termOpenAfterEsc);

  // Focus restore check
  const activeIdAfterTermEsc = await page.evaluate(() => document.activeElement?.id);
  console.log('Focus restored to:', activeIdAfterTermEsc);

  // 3. Test Modals: Tab Order, Focus Trap, Esc, Focus Restore
  console.log('\n--- TESTING CASE STUDY MODAL KEYBOARD BEHAVIOR ---');
  for (const mId of ['impostr', 'lucerna', 'dormex']) {
    const triggerSel = `[data-case-study="${mId}"]`;
    await page.focus(triggerSel);
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 250));

    const isOpen = await page.$eval('#caseStudyModal', el => el.classList.contains('open'));
    const initialFocusText = await page.evaluate(() => document.activeElement?.innerText || document.activeElement?.getAttribute('aria-label'));
    
    // Test Focus Trap with Tab key cycling
    await page.keyboard.press('Tab');
    const focusedAfterTab = await page.evaluate(() => document.activeElement?.tagName + '.' + (document.activeElement?.className || ''));
    
    // Press Esc
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 200));
    const isOpenAfterEsc = await page.$eval('#caseStudyModal', el => el.classList.contains('open'));
    const restoredTarget = await page.evaluate((sel) => document.activeElement === document.querySelector(sel), triggerSel);

    console.log(`Modal [${mId}]: Opened=${isOpen}, InitialFocus='${initialFocusText?.trim()}', EscClosed=${!isOpenAfterEsc}, FocusRestored=${restoredTarget}`);
  }

  await browser.close();
}

testA11yAndKeyboard().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
