/**
 * Jest Configuration
 * For Phase 2 test suite
 */

module.exports = {
  // Test timeout - 2 minutes per test
  testTimeout: 120000,

  // Run tests sequentially (not in parallel)
  maxWorkers: 1,

  // Test match patterns
  testMatch: ['**/tests/**/*.test.js'],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Coverage (optional)
  collectCoverageFrom: [
    'lib/**/*.js',
    '!lib/**/*.test.js'
  ],

  // Reporters
  reporters: ['default'],

  // Environment
  testEnvironment: 'node',

  // Verbose output
  verbose: true
};
