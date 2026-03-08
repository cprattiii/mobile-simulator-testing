/**
 * Test Constant Contact Login
 * Verifies that Playwright can successfully log into Constant Contact L1
 */

require('dotenv').config();
const playwright = require('./playwright-wrapper');
const path = require('path');

const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || './screenshots';

async function testConstantContactLogin() {
  console.log('='.repeat(60));
  console.log('Testing Constant Contact Login (L1 Environment)');
  console.log('='.repeat(60));
  console.log('');

  // Validate credentials
  if (!process.env.CTCT_USERNAME || !process.env.CTCT_PASSWORD) {
    throw new Error('Missing credentials. Check .env file.');
  }

  console.log(`Username: ${process.env.CTCT_USERNAME}`);
  console.log(`Login URL: ${process.env.CTCT_LOGIN_URL}`);
  console.log('');

  try {
    // Initialize browser
    console.log('Step 1: Initialize Playwright...');
    await playwright.initialize();
    console.log('');

    // Navigate to login page
    console.log('Step 2: Navigate to Constant Contact login page...');
    await playwright.navigate(process.env.CTCT_LOGIN_URL, {
      waitUntil: 'domcontentloaded', // Less strict than networkidle
      timeout: 60000 // Increase timeout to 60s
    });
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for page to settle
    await playwright.screenshot(path.join(SCREENSHOT_DIR, '01-login-page.png'));
    console.log('');

    // Check current page structure
    console.log('Step 3: Analyzing login form...');
    const page = playwright.getPage();

    // Wait a bit for page to settle (instead of networkidle which is unreliable)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Take a screenshot to see what we're dealing with
    await playwright.screenshot(path.join(SCREENSHOT_DIR, '02-before-login.png'));

    // Try to find username/email field
    console.log('  Looking for username field...');
    let usernameSelector = null;

    // Common selectors for username/email fields
    const possibleUsernameSelectors = [
      'input[name="username"]',
      'input[name="email"]',
      'input[type="email"]',
      'input[id="username"]',
      'input[id="email"]',
      '#luser',
      'input[placeholder*="email" i]',
      'input[placeholder*="username" i]'
    ];

    for (const selector of possibleUsernameSelectors) {
      const element = await page.$(selector);
      if (element) {
        usernameSelector = selector;
        console.log(`  ✓ Found username field: ${selector}`);
        break;
      }
    }

    if (!usernameSelector) {
      // List all input fields on the page
      const inputs = await page.$$eval('input', elements =>
        elements.map(el => ({
          type: el.type,
          name: el.name,
          id: el.id,
          placeholder: el.placeholder,
          class: el.className
        }))
      );
      console.log('  Available input fields:', JSON.stringify(inputs, null, 2));
      throw new Error('Could not find username field');
    }
    console.log('');

    // Enter username
    console.log('Step 4: Enter username...');
    await playwright.type(usernameSelector, process.env.CTCT_USERNAME);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await playwright.screenshot(path.join(SCREENSHOT_DIR, '03-username-entered.png'));
    console.log('');

    // Find password field
    console.log('Step 5: Looking for password field...');
    let passwordSelector = null;

    const possiblePasswordSelectors = [
      'input[name="password"]',
      'input[type="password"]',
      'input[id="password"]',
      '#lpass'
    ];

    for (const selector of possiblePasswordSelectors) {
      const element = await page.$(selector);
      if (element) {
        passwordSelector = selector;
        console.log(`  ✓ Found password field: ${selector}`);
        break;
      }
    }

    if (!passwordSelector) {
      throw new Error('Could not find password field');
    }
    console.log('');

    // Enter password
    console.log('Step 6: Enter password...');
    await playwright.type(passwordSelector, process.env.CTCT_PASSWORD);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await playwright.screenshot(path.join(SCREENSHOT_DIR, '04-password-entered.png'));
    console.log('');

    // Find and click login button
    console.log('Step 7: Looking for login button...');
    let loginButtonSelector = null;

    const possibleLoginSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Log in")',
      'button:has-text("Sign in")',
      'button:has-text("Login")',
      '[data-testid="login-button"]',
      '#login-button'
    ];

    for (const selector of possibleLoginSelectors) {
      const element = await page.$(selector);
      if (element) {
        loginButtonSelector = selector;
        console.log(`  ✓ Found login button: ${selector}`);
        break;
      }
    }

    if (!loginButtonSelector) {
      // Try to find any button
      const buttons = await page.$$eval('button', elements =>
        elements.map(el => ({
          text: el.textContent,
          type: el.type,
          id: el.id,
          class: el.className
        }))
      );
      console.log('  Available buttons:', JSON.stringify(buttons, null, 2));

      // Default to first submit button if we can't find anything specific
      loginButtonSelector = 'button[type="submit"]';
    }
    console.log('');

    // Click login
    console.log('Step 8: Clicking login button...');
    await playwright.click(loginButtonSelector);
    console.log('  Waiting for navigation...');

    // Wait for navigation or dashboard to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    await playwright.screenshot(path.join(SCREENSHOT_DIR, '05-after-login.png'));
    console.log('');

    // Verify login success
    console.log('Step 9: Verifying login success...');
    const currentUrl = await playwright.getUrl();
    const pageTitle = await playwright.getTitle();

    console.log(`  Current URL: ${currentUrl}`);
    console.log(`  Page Title: ${pageTitle}`);

    // Check if we're still on the login page (login failed)
    if (currentUrl.includes('login')) {
      console.log('  ⚠ Still on login page - may have failed');
      await playwright.screenshot(path.join(SCREENSHOT_DIR, '06-login-failed.png'));

      // Check for error messages
      const errorElements = await page.$$eval('[class*="error"], [role="alert"]', elements =>
        elements.map(el => el.textContent)
      );

      if (errorElements.length > 0) {
        console.log('  Error messages found:', errorElements);
      }
    } else {
      console.log('  ✓ Successfully navigated away from login page');
    }

    await playwright.screenshot(path.join(SCREENSHOT_DIR, '07-final-state.png'));
    console.log('');

    console.log('='.repeat(60));
    console.log('✓ Constant Contact Login Test: COMPLETE');
    console.log('='.repeat(60));
    console.log('');
    console.log('Screenshots saved in:', SCREENSHOT_DIR);
    console.log('- 01-login-page.png');
    console.log('- 02-before-login.png');
    console.log('- 03-username-entered.png');
    console.log('- 04-password-entered.png');
    console.log('- 05-after-login.png');
    console.log('- 07-final-state.png');
    console.log('');
    console.log('Review screenshots to verify login success.');
    console.log('');

    return true;
  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('✗ Constant Contact Login Test: FAILED');
    console.error('='.repeat(60));
    console.error('Error:', error.message);
    console.error(error.stack);
    console.error('');
    return false;
  } finally {
    // Keep browser open for manual inspection
    console.log('Browser will remain open for 30 seconds for manual inspection...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    await playwright.close();
  }
}

// Run if executed directly
if (require.main === module) {
  testConstantContactLogin()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { testConstantContactLogin };
