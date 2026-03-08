/**
 * Playwright Wrapper Module
 * Provides a simplified API for browser automation in iOS Simulator
 *
 * NOTE: This replaces the original mcp-bridge.js concept.
 * We use standard Playwright library instead of MCP tools.
 */

const { webkit, devices } = require('playwright');

let browser = null;
let context = null;
let page = null;

/**
 * Initialize Playwright browser with iPhone 16 configuration
 * @returns {Promise<void>}
 */
async function initialize() {
  if (browser) {
    console.log('Browser already initialized');
    return;
  }

  console.log('Launching WebKit browser with iPhone 16 configuration...');

  // Launch WebKit (Safari engine)
  browser = await webkit.launch({
    headless: false, // Show browser window
    slowMo: 100 // Slow down by 100ms for visibility
  });

  // Use iPhone 16 viewport and user agent
  const iPhone16 = devices['iPhone 15 Pro']; // Use closest available device

  context = await browser.newContext({
    ...iPhone16,
    viewport: { width: 393, height: 852 }, // iPhone 16 dimensions
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
  });

  page = await context.newPage();

  console.log('✓ Browser initialized with iPhone 16 configuration');
}

/**
 * Navigate to a URL
 * @param {string} url - URL to navigate to
 * @param {Object} options - Navigation options
 * @returns {Promise<void>}
 */
async function navigate(url, options = {}) {
  if (!page) {
    throw new Error('Browser not initialized. Call initialize() first.');
  }

  console.log(`Navigating to: ${url}`);
  await page.goto(url, {
    waitUntil: 'networkidle',
    timeout: 30000,
    ...options
  });
  console.log(`✓ Navigated to ${url}`);
}

/**
 * Click an element
 * @param {string} selector - CSS selector or text
 * @param {Object} options - Click options
 * @returns {Promise<void>}
 */
async function click(selector, options = {}) {
  if (!page) {
    throw new Error('Browser not initialized.');
  }

  console.log(`Clicking: ${selector}`);
  await page.click(selector, { timeout: 10000, ...options });
  console.log(`✓ Clicked ${selector}`);
}

/**
 * Type text into an input field
 * @param {string} selector - CSS selector
 * @param {string} text - Text to type
 * @param {Object} options - Type options
 * @returns {Promise<void>}
 */
async function type(selector, text, options = {}) {
  if (!page) {
    throw new Error('Browser not initialized.');
  }

  console.log(`Typing into ${selector}: ${text}`);
  await page.fill(selector, text, { timeout: 10000, ...options });
  console.log(`✓ Typed into ${selector}`);
}

/**
 * Get page snapshot (accessibility tree)
 * @returns {Promise<string>} Accessibility tree snapshot
 */
async function snapshot() {
  if (!page) {
    throw new Error('Browser not initialized.');
  }

  const snapshot = await page.accessibility.snapshot();
  return JSON.stringify(snapshot, null, 2);
}

/**
 * Take a screenshot
 * @param {string} path - Path to save screenshot
 * @returns {Promise<void>}
 */
async function screenshot(path) {
  if (!page) {
    throw new Error('Browser not initialized.');
  }

  console.log(`Taking screenshot: ${path}`);
  await page.screenshot({ path, fullPage: true });
  console.log(`✓ Screenshot saved to ${path}`);
}

/**
 * Wait for an element to appear
 * @param {string} selector - CSS selector
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
async function waitForElement(selector, timeout = 10000) {
  if (!page) {
    throw new Error('Browser not initialized.');
  }

  console.log(`Waiting for element: ${selector}`);
  await page.waitForSelector(selector, { timeout });
  console.log(`✓ Element found: ${selector}`);
}

/**
 * Get current page title
 * @returns {Promise<string>} Page title
 */
async function getTitle() {
  if (!page) {
    throw new Error('Browser not initialized.');
  }

  return await page.title();
}

/**
 * Get current URL
 * @returns {Promise<string>} Current URL
 */
async function getUrl() {
  if (!page) {
    throw new Error('Browser not initialized.');
  }

  return page.url();
}

/**
 * Close browser and cleanup
 * @returns {Promise<void>}
 */
async function close() {
  if (browser) {
    console.log('Closing browser...');
    await browser.close();
    browser = null;
    context = null;
    page = null;
    console.log('✓ Browser closed');
  }
}

/**
 * Get the page object for advanced operations
 * @returns {Page} Playwright page object
 */
function getPage() {
  if (!page) {
    throw new Error('Browser not initialized.');
  }
  return page;
}

module.exports = {
  initialize,
  navigate,
  click,
  type,
  snapshot,
  screenshot,
  waitForElement,
  getTitle,
  getUrl,
  close,
  getPage
};
