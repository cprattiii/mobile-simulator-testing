# Mobile Simulator Testing

Automated Shopify integration testing for Constant Contact via iOS Simulator using Playwright.

## Project Status

**Phase 1:** ✅ Complete - Prototype successful
**Phase 2:** 🚧 In Progress - Building test suite

## Overview

This project provides automated testing for Constant Contact's Shopify integration using Playwright with iOS Simulator configuration. Tests verify connection, contact import, product retrieval, campaign attribution, and error handling.

## Architecture

- **Browser Automation:** Playwright (WebKit with iPhone 16 config)
- **Test Runner:** Node.js (direct execution)
- **Environment:** Constant Contact L1, Shopify test store
- **Approach:** Automated UI testing with API verification

## Prerequisites

- macOS with Xcode installed
- Node.js v16+
- iOS Simulator (iPhone 16)
- Constant Contact L1 test account
- Shopify test store (optional, for full integration)

## Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp config/.env.example .env

# Edit .env with your credentials
nano .env

# Run tests
npm test
```

## Test Suite

| Test | Status | Description |
|------|--------|-------------|
| setup.test.js | ✅ PASSING | Environment verification & CC login |
| connection.test.js | 🚧 TODO | Shopify OAuth connection |
| import.test.js | 🚧 TODO | Contact import (10 contacts exact) |
| products.test.js | 🚧 TODO | Product retrieval (5 products with prices) |
| attribution.test.js | 🚧 TODO | Campaign tracking |
| errors.test.js | 🚧 TODO | Edge cases (8 scenarios) |

## Running Tests

```bash
# Run all tests
npm test

# Run specific test
npm run test:setup
npm run test:connection
npm run test:import
npm run test:products
npm run test:attribution
npm run test:errors
```

## Project Structure

```
mobile-simulator-testing/
├── lib/                    # Reusable modules
│   ├── playwright-wrapper.js  # Browser automation
│   ├── auth.js                # CC login
│   ├── simulator.js           # iOS Simulator control
│   └── timestamps.js          # Unique identifiers
├── tests/                  # Test files
│   ├── test-runner.js         # Custom Node.js runner
│   └── *.test.js              # Individual tests
├── config/                 # Configuration
│   └── .env.example           # Environment template
├── prototype/              # Phase 1 prototype
│   └── PHASE1-COMPLETION.md   # Phase 1 report
├── codev/                  # Codev framework
│   ├── specs/                 # Specifications
│   └── plans/                 # Implementation plans
└── reports/                # Test artifacts
    └── screenshots/           # Test screenshots
```

## Key Decisions

### Phase 1: Playwright Library vs MCP Tools

**Decision:** Use standard Playwright library instead of Playwright MCP tools

**Rationale:**
- MCP tools designed for AI agent use, not programmatic access
- Playwright library provides same capabilities
- Better documented, more stable
- No dependency on MCP availability

### Phase 2: Node.js vs Jest

**Decision:** Use Node.js direct execution instead of Jest test runner

**Rationale:**
- Jest had module compatibility issues with Playwright
- Node.js approach simpler and matches Phase 1 success
- No test framework overhead
- Direct control over test execution

## Development

### Adding a New Test

1. Create `tests/your-test.test.js`
2. Export a `run()` function that returns `{ success: boolean, error?: string }`
3. Add script to `package.json`: `"test:your-test": "node tests/your-test.test.js"`
4. Test will auto-run with `npm test`

### Example Test Structure

```javascript
require('dotenv').config();
const playwright = require('../lib/playwright-wrapper');

async function run() {
  try {
    await playwright.initialize();
    // Your test logic here
    await playwright.close();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { run };
```

## Documentation

- **Phase 1 Report:** `prototype/PHASE1-COMPLETION.md`
- **MCP Research:** `prototype/MCP-INTEGRATION-RESEARCH.md`
- **Specification:** `codev/specs/0001-shopify-integration-ios-testing.md`
- **Implementation Plan:** `codev/plans/0001-shopify-integration-ios-testing.md`

## Troubleshooting

### Browser won't launch
- Verify Playwright is installed: `npx playwright install webkit`
- Check Xcode is installed

### Tests timeout
- Increase timeouts in playwright-wrapper.js
- Check network connectivity to L1 environment

### Login fails
- Verify credentials in .env
- Check CC L1 environment is accessible
- Review screenshots in reports/screenshots/

## Contributing

This is a Codev-managed project. Follow the SPIR protocol for new features:
1. Write specification (`codev/specs/`)
2. Create implementation plan (`codev/plans/`)
3. Implement with testing
4. Review and document (`codev/reviews/`)

## License

ISC

## Repository

https://github.com/cprattiii/mobile-simulator-testing
