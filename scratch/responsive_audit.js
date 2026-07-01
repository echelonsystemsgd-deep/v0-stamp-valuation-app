const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const MOBILE = { width: 375, height: 812 };
const TABLET = { width: 768, height: 1024 };
const DESKTOP = { width: 1280, height: 900 };

async function shot(page, name) {
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`✅ Screenshot saved: ${name}.png`);
  return file;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: DESKTOP });
  const page = await context.newPage();

  // --- LOGIN ---
  console.log('\n🔐 Logging in...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  
  // Click the Password tab trigger
  await page.click('button[role="tab"]:has-text("Password")');
  await page.waitForTimeout(300);

  await page.fill('#pwd-email', 'ali_nawaz122@outlook.com');
  await page.fill('#pwd-password', 'nawaz123');
  await page.click('form:has(#pwd-password) button[type="submit"]');
  await page.waitForURL(/\/(dashboard|admin)/, { timeout: 10000 });
  const landedAt = page.url();
  console.log(`  → Landed at: ${landedAt}`);

  // --- CHECK 1: Landing page mobile header ---
  console.log('\n📱 CHECK 1: Landing page header @ 375px (mobile)');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.setViewportSize(MOBILE);
  await page.waitForTimeout(500);
  await shot(page, '1_landing_mobile_375');

  // --- CHECK 2: Landing page tablet header ---
  console.log('\n📱 CHECK 2: Landing page header @ 768px (tablet)');
  await page.setViewportSize(TABLET);
  await page.waitForTimeout(500);
  await shot(page, '2_landing_tablet_768');

  // --- CHECK 3: Landing page desktop header ---
  console.log('\n🖥️  CHECK 3: Landing page header @ 1280px (desktop)');
  await page.setViewportSize(DESKTOP);
  await page.waitForTimeout(500);
  await shot(page, '3_landing_desktop_1280');

  // --- CHECK 4: Dashboard/Admin mobile ---
  console.log('\n📱 CHECK 4: Dashboard mobile @ 375px');
  await page.goto(landedAt, { waitUntil: 'networkidle' });
  await page.setViewportSize(MOBILE);
  await page.waitForTimeout(500);
  await shot(page, '4_dashboard_mobile_375');

  // --- CHECK 5: Open hamburger drawer ---
  console.log('\n🍔 CHECK 5: Open mobile sidebar drawer');
  const menuBtn = page.locator('button[aria-label="Open navigation menu"]');
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
    await page.waitForTimeout(600);
    await shot(page, '5_dashboard_drawer_open');
  } else {
    console.log('  ⚠️ Hamburger button not found at this viewport');
    await shot(page, '5_dashboard_drawer_NOT_FOUND');
  }

  // --- CHECK 6: Dashboard desktop ---
  console.log('\n🖥️  CHECK 6: Dashboard @ 1280px (desktop)');
  await page.setViewportSize(DESKTOP);
  await page.waitForTimeout(500);
  await shot(page, '6_dashboard_desktop_1280');

  // --- CHECK 7: Submissions list → workstation mobile ---
  console.log('\n📱 CHECK 7: Admin submissions workstation @ 375px');
  const submissionsUrl = landedAt.includes('/admin')
    ? 'http://localhost:3000/admin/submissions'
    : 'http://localhost:3000/dashboard/submissions';
  await page.goto(submissionsUrl, { waitUntil: 'networkidle' });
  await page.setViewportSize(MOBILE);
  await page.waitForTimeout(500);
  await shot(page, '7_submissions_list_mobile');

  // Click first submission if available
  const firstRow = page.locator('table tbody tr').first();
  const firstCard = page.locator('[data-submission-card]').first();
  const link = page.locator('a[href*="/submissions/"]').first();
  if (await link.isVisible()) {
    await link.click();
    await page.waitForTimeout(1000);
    await shot(page, '8_workstation_mobile_375');
  } else {
    console.log('  ℹ️  No submission rows found to click');
  }

  await browser.close();
  console.log('\n✅ All screenshots saved to:', OUT_DIR);
})();
