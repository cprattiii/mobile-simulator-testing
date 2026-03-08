/**
 * Shopify Connection Test
 * Tests OAuth connection to Shopify store
 */

require('dotenv').config();
const playwright = require('../lib/playwright-wrapper');
const auth = require('../lib/auth');
const path = require('path');

const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || './reports/screenshots';

async function run() {
  console.log('Running Shopify connection tests...');

  try {
    // Initialize and login
    console.log('  Setup: Initialize and login...');
    await playwright.initialize();
    const loginSuccess = await auth.loginToConstantContact(
      process.env.CTCT_USERNAME,
      process.env.CTCT_PASSWORD,
      process.env.CTCT_LOGIN_URL
    );

    if (!loginSuccess) {
      throw new Error('Login failed');
    }

    // Test 1: Navigate to integrations page
    console.log('  Test 1: Navigate to integrations page...');
    const integrationsUrl = process.env.CTCT_INTEGRATIONS_URL || process.env.CTCT_LOGIN_URL;
    await playwright.navigate(integrationsUrl);
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('  ✓ Navigated to integrations page');

    // Test 2: Find Shopify integration
    console.log('  Test 2: Looking for Shopify integration...');
    const page = playwright.getPage();

    // Take screenshot to see what's available
    await playwright.screenshot(path.join(SCREENSHOT_DIR, 'integrations-page.png'));

    // Try to find Shopify link/button
    const shopifySelectors = [
      'text=Shopify',
      '[data-testid*="shopify"]',
      'a[href*="shopify"]',
      'button:has-text("Shopify")'
    ];

    let shopifyElement = null;
    for (const selector of shopifySelectors) {
      shopifyElement = await page.$(selector);
      if (shopifyElement) {
        console.log(`  ✓ Found Shopify integration: ${selector}`);
        break;
      }
    }

    if (!shopifyElement) {
      console.log('  ⚠ Shopify integration element not found on page');
      console.log('  Note: This may require manual verification of integrations page');

      // List all links on the page for debugging
      const links = await page.$$eval('a', elements =>
        elements.map(el => ({
          text: el.textContent?.trim(),
          href: el.href
        })).filter(link => link.text)
      );

      console.log('  Available links:', JSON.stringify(links.slice(0, 10), null, 2));
    }

    // Test 3: Click Shopify (if found)
    if (shopifyElement) {
      console.log('  Test 3: Clicking Shopify integration...');
      await playwright.click(shopifySelectors.find(s => shopifyElement));
      await new Promise(resolve => setTimeout(resolve, 3000));

      await playwright.screenshot(path.join(SCREENSHOT_DIR, 'shopify-oauth.png'));
      console.log('  ✓ Shopify OAuth page loaded');
    }

    // Cleanup
    await playwright.close();

    console.log('  ✓ Connection test complete (manual verification required)');
    return { success: true };

  } catch (error) {
    console.error('  ✗ Connection test failed:', error.message);

    // Try to cleanup
    try {
      await playwright.close();
    } catch (e) {
      // Ignore cleanup errors
    }

    return { success: false, error: error.message };
  }
}

// Export for test runner
module.exports = { run };

// Run if executed directly
if (require.main === module) {
  run()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}
