/**
 * Authentication Module
 * Handles Constant Contact login automation
 */

const playwright = require('./playwright-wrapper');

/**
 * Log in to Constant Contact
 * @param {string} username - CC username
 * @param {string} password - CC password
 * @param {string} loginUrl - Login URL
 * @returns {Promise<boolean>} True if login successful
 */
async function loginToConstantContact(username, password, loginUrl) {
  console.log(`Logging in to Constant Contact as ${username}...`);

  // Navigate to login page
  await playwright.navigate(loginUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // Wait for page to settle
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Enter username
  await playwright.type('#luser', username);
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Enter password
  await playwright.type('input[type="password"]', password);
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Click login button
  await playwright.click('button[type="submit"]');
  console.log('Waiting for navigation after login...');

  // Wait for navigation - increase timeout for slower responses
  await new Promise(resolve => setTimeout(resolve, 8000));

  // Verify login success
  const currentUrl = await playwright.getUrl();

  if (!currentUrl.includes('login')) {
    console.log('✓ Login successful');
    return true;
  } else {
    console.error('✗ Login failed - still on login page');
    console.error(`   Current URL: ${currentUrl}`);

    // Take a screenshot for debugging
    try {
      await playwright.screenshot('./reports/screenshots/login-failed.png');
      console.error('   Screenshot saved to: ./reports/screenshots/login-failed.png');
    } catch (e) {
      // Ignore screenshot errors
    }

    return false;
  }
}

/**
 * Verify user is logged in
 * @returns {Promise<boolean>} True if logged in
 */
async function verifyLoggedIn() {
  const url = await playwright.getUrl();
  return !url.includes('login');
}

/**
 * Logout from Constant Contact (if needed)
 * @returns {Promise<void>}
 */
async function logout() {
  // Implementation depends on CC logout flow
  // Placeholder for now
  console.log('Logout not yet implemented');
}

module.exports = {
  loginToConstantContact,
  verifyLoggedIn,
  logout
};
