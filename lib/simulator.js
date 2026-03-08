/**
 * iOS Simulator Control Module
 * Utilities for booting, managing, and interacting with iOS Simulator
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * List all available iOS simulators
 * @returns {Promise<string>} List of available devices
 */
async function listDevices() {
  try {
    const { stdout, stderr } = await execPromise('xcrun simctl list devices available');
    if (stderr) {
      console.error('Warning:', stderr);
    }
    return stdout;
  } catch (error) {
    throw new Error(`Failed to list devices: ${error.message}`);
  }
}

/**
 * Boot the iOS Simulator
 * @param {string} deviceName - Name of the device (e.g., "iPhone 16")
 * @returns {Promise<boolean>} True if boot successful
 */
async function bootSimulator(deviceName = 'iPhone 16') {
  try {
    console.log(`Attempting to boot ${deviceName}...`);

    // Try to boot - will fail if already booted, which is OK
    try {
      await execPromise(`xcrun simctl boot "${deviceName}"`);
    } catch (bootError) {
      // Check if already booted
      if (bootError.message.includes('Unable to boot device in current state: Booted')) {
        console.log(`${deviceName} is already booted`);
        return true;
      }
      throw bootError;
    }

    console.log(`Waiting for ${deviceName} to boot...`);
    // Wait for boot to complete
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log(`✓ ${deviceName} booted successfully`);
    return true;
  } catch (error) {
    throw new Error(`Failed to boot simulator: ${error.message}`);
  }
}

/**
 * Open a URL in Safari on the booted simulator
 * @param {string} url - URL to open
 * @returns {Promise<boolean>} True if successful
 */
async function openSafari(url) {
  try {
    console.log(`Opening Safari with URL: ${url}`);
    await execPromise(`xcrun simctl openurl booted "${url}"`);

    // Give Safari time to launch and load
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log(`✓ Safari opened with ${url}`);
    return true;
  } catch (error) {
    throw new Error(`Failed to open Safari: ${error.message}`);
  }
}

/**
 * Shutdown the simulator
 * @param {string} deviceName - Name of the device
 * @returns {Promise<boolean>} True if successful
 */
async function shutdownSimulator(deviceName = 'iPhone 16') {
  try {
    console.log(`Shutting down ${deviceName}...`);
    await execPromise(`xcrun simctl shutdown "${deviceName}"`);
    console.log(`✓ ${deviceName} shut down`);
    return true;
  } catch (error) {
    // Already shut down is OK
    if (error.message.includes('Unable to shutdown device in current state: Shutdown')) {
      console.log(`${deviceName} is already shut down`);
      return true;
    }
    throw new Error(`Failed to shutdown simulator: ${error.message}`);
  }
}

/**
 * Reset simulator to clean state
 * @param {string} deviceName - Name of the device
 * @returns {Promise<boolean>} True if successful
 */
async function resetSimulator(deviceName = 'iPhone 16') {
  try {
    console.log(`Resetting ${deviceName}...`);
    // Shutdown first
    await shutdownSimulator(deviceName);

    // Erase
    await execPromise(`xcrun simctl erase "${deviceName}"`);
    console.log(`✓ ${deviceName} reset to clean state`);
    return true;
  } catch (error) {
    throw new Error(`Failed to reset simulator: ${error.message}`);
  }
}

module.exports = {
  listDevices,
  bootSimulator,
  openSafari,
  shutdownSimulator,
  resetSimulator
};
