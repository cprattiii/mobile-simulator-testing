/**
 * Environment Setup Tests
 * Verifies test environment is properly configured
 */

require('dotenv').config();
const playwright = require('../lib/playwright-wrapper');
const auth = require('../lib/auth');

async function run() {
  console.log('Running setup tests...');

  try {
    // Test 1: Playwright initialization
    console.log('  Test 1: Initialize Playwright...');
    await playwright.initialize();
    console.log('  ✓ Playwright initialized');

    // Test 2: Navigation
    console.log('  Test 2: Navigate to example.com...');
    await playwright.navigate('https://example.com');
    const title = await playwright.getTitle();
    if (!title.includes('Example')) {
      throw new Error(`Expected title to contain "Example", got "${title}"`);
    }
    console.log('  ✓ Navigation successful');

    // Test 3: Constant Contact login
    console.log('  Test 3: Constant Contact login...');
    const success = await auth.loginToConstantContact(
      process.env.CTCT_USERNAME,
      process.env.CTCT_PASSWORD,
      process.env.CTCT_LOGIN_URL
    );

    if (!success) {
      throw new Error('Login failed');
    }

    const loggedIn = await auth.verifyLoggedIn();
    if (!loggedIn) {
      throw new Error('Not logged in after login attempt');
    }
    console.log('  ✓ Login successful');

    // Cleanup
    await playwright.close();

    return { success: true };
  } catch (error) {
    console.error('  ✗ Test failed:', error.message);

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
