const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', exception => {
    console.log(`Uncaught exception: "${exception}"`);
  });
  await page.goto('http://192.168.1.111:5174/');
  await page.waitForTimeout(2000); // wait for mount
  await browser.close();
})();
