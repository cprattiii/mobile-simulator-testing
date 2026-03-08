/**
 * Test Playwright Integration
 * Verifies that Playwright can control browser with iPhone 16 configuration
 */

const playwright = require('./playwright-wrapper');

async function testPlaywright() {
  console.log('='.repeat(60));
  console.log('Testing Playwright Integration');
  console.log('='.repeat(60));
  console.log('');

  try {
    // Initialize browser
    console.log('Step 1: Initialize Playwright with iPhone 16 config...');
    await playwright.initialize();
    console.log('');

    // Navigate to example.com
    console.log('Step 2: Navigate to example.com...');
    await playwright.navigate('https://example.com');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('');

    // Verify page loaded
    console.log('Step 3: Verify page loaded...');
    const title = await playwright.getTitle();
    const url = await playwright.getUrl();
    console.log(`  Title: ${title}`);
    console.log(`  URL: ${url}`);
    console.log('');

    // Take screenshot
    console.log('Step 4: Take screenshot...');
    await playwright.screenshot('example-com.png');
    console.log('');

    // Navigate to a form page for testing interactions
    console.log('Step 5: Navigate to httpbin.org/forms/post...');
    await playwright.navigate('https://httpbin.org/forms/post');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('');

    // Fill a form
    console.log('Step 6: Fill form fields...');
    await playwright.type('input[name="custname"]', 'Test User');
    await playwright.type('input[name="custtel"]', '555-1234');
    await playwright.type('input[name="custemail"]', 'test@example.com');
    console.log('');

    // Take screenshot of filled form
    console.log('Step 7: Screenshot filled form...');
    await playwright.screenshot('form-filled.png');
    console.log('');

    console.log('='.repeat(60));
    console.log('✓ Playwright Integration: SUCCESS');
    console.log('='.repeat(60));
    console.log('');
    console.log('Key findings:');
    console.log('- Playwright WebKit launches successfully');
    console.log('- iPhone 16 viewport configuration works');
    console.log('- Navigation, typing, and screenshots functional');
    console.log('- Ready for Constant Contact login test');
    console.log('');
    console.log('Screenshots saved:');
    console.log('- example-com.png');
    console.log('- form-filled.png');
    console.log('');

    return true;
  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('✗ Playwright Integration: FAILED');
    console.error('='.repeat(60));
    console.error('Error:', error.message);
    console.error(error.stack);
    console.error('');
    return false;
  } finally {
    // Cleanup
    await playwright.close();
  }
}

// Run if executed directly
if (require.main === module) {
  testPlaywright()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { testPlaywright };
