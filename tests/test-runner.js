/**
 * Simple Test Runner
 * Runs tests directly with Node.js (no Jest dependency)
 */

const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

class TestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.errors = [];
  }

  /**
   * Run all test files
   */
  async runAll() {
    console.log('='.repeat(60));
    console.log('Running Test Suite');
    console.log('='.repeat(60));
    console.log('');

    const testFiles = [
      './setup.test.js',
      './connection.test.js',
      './import.test.js',
      './products.test.js',
      './attribution.test.js',
      './errors.test.js'
    ];

    for (const testFile of testFiles) {
      const testPath = path.join(__dirname, testFile);
      if (fs.existsSync(testPath)) {
        await this.runTestFile(testFile, testPath);
      } else {
        console.log(`${colors.yellow}⊘${colors.reset} ${testFile} - SKIPPED (not implemented yet)`);
      }
    }

    this.printSummary();
    process.exit(this.failed > 0 ? 1 : 0);
  }

  /**
   * Run a single test file
   */
  async runTestFile(name, filePath) {
    console.log(`\n${colors.blue}Running:${colors.reset} ${name}`);
    console.log('-'.repeat(60));

    try {
      const testModule = require(filePath);

      if (typeof testModule.run === 'function') {
        const result = await testModule.run();

        if (result.success) {
          this.passed++;
          console.log(`${colors.green}✓${colors.reset} ${name} - PASSED`);
        } else {
          this.failed++;
          console.log(`${colors.red}✗${colors.reset} ${name} - FAILED`);
          this.errors.push({ file: name, error: result.error });
        }
      } else {
        console.log(`${colors.yellow}⚠${colors.reset} ${name} - No run() function exported`);
      }
    } catch (error) {
      this.failed++;
      console.log(`${colors.red}✗${colors.reset} ${name} - ERROR`);
      console.error(error.message);
      this.errors.push({ file: name, error: error.message });
    }
  }

  /**
   * Print test summary
   */
  printSummary() {
    console.log('');
    console.log('='.repeat(60));
    console.log('Test Summary');
    console.log('='.repeat(60));
    console.log(`${colors.green}Passed:${colors.reset} ${this.passed}`);
    console.log(`${colors.red}Failed:${colors.reset} ${this.failed}`);
    console.log(`Total: ${this.passed + this.failed}`);

    if (this.errors.length > 0) {
      console.log('');
      console.log('Errors:');
      this.errors.forEach(({ file, error }) => {
        console.log(`  ${colors.red}•${colors.reset} ${file}: ${error}`);
      });
    }

    console.log('='.repeat(60));
  }
}

// Run if executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAll().catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;
