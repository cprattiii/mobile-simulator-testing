/**
 * Phase 1 Prototype: Verify iOS Simulator + Safari Control
 *
 * This script tests:
 * 1. iOS Simulator boot
 * 2. Safari launch
 * 3. Basic navigation
 */

const simulator = require('./simulator');

async function runPrototype() {
  console.log('='.repeat(60));
  console.log('Phase 1 Prototype: iOS Simulator + Safari Control');
  console.log('='.repeat(60));
  console.log('');

  try {
    // Step 1: List available devices
    console.log('Step 1: Listing available iOS devices...');
    const devices = await simulator.listDevices();
    console.log(devices);
    console.log('');

    // Step 2: Boot iPhone 16
    console.log('Step 2: Booting iPhone 16 simulator...');
    await simulator.bootSimulator('iPhone 16');
    console.log('');

    // Step 3: Open Safari with test URL
    console.log('Step 3: Opening Safari with example.com...');
    await simulator.openSafari('https://example.com');
    console.log('');

    console.log('='.repeat(60));
    console.log('✓ Simulator + Safari basic control: SUCCESS');
    console.log('='.repeat(60));
    console.log('');
    console.log('Next steps:');
    console.log('1. Verify Safari opened in the simulator manually');
    console.log('2. Proceed to MCP integration (mcp-bridge.js)');
    console.log('3. Test Playwright MCP tools with simulator Safari');
    console.log('');

    return true;
  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('✗ Prototype FAILED');
    console.error('='.repeat(60));
    console.error('Error:', error.message);
    console.error('');
    return false;
  }
}

// Run if executed directly
if (require.main === module) {
  runPrototype()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { runPrototype };
