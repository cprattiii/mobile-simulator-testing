# Implementation Plan: Shopify Integration Testing via iOS Simulator

**ID:** 0001
**Spec:** codev/specs/0001-shopify-integration-ios-testing.md
**Status:** Updated - Addressing Codex Feedback
**Created:** 2026-03-07
**Protocol:** SPIR

## Overview

This plan details the implementation approach for automated Shopify integration testing via iOS Simulator. The implementation is split into two phases: a prototype phase to verify technical feasibility, and a full implementation phase to build the complete test suite.

## Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Test Runner (Jest/Mocha)                 │
├─────────────────────────────────────────────────────────────┤
│  Test Suites:                                               │
│  - setup.test.js      (env setup & auth)                    │
│  - connection.test.js (Shopify OAuth connection)            │
│  - import.test.js     (contact import verification)         │
│  - products.test.js   (product retrieval & email)           │
│  - attribution.test.js (campaign tracking)                  │
│  - errors.test.js     (edge cases & error handling)         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Test Utilities & Helpers                        │
│  - simulator.js     (iOS Simulator control)                 │
│  - playwright.js    (Playwright MCP wrapper)                │
│  - auth.js          (CC login automation)                   │
│  - shopify.js       (Shopify API helpers)                   │
│  - ctct-api.js      (Constant Contact API verification)     │
│  - timestamps.js    (unique identifier generation)          │
│  - screenshots.js   (screenshot capture & masking)          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Playwright MCP Server                       │
│  Tools: navigate, click, type, screenshot, snapshot         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              iOS Simulator (iPhone 16)                       │
│                   Safari Browser                             │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Test Framework:** Jest for test organization and assertions
- **Browser Automation:** Playwright MCP Server
- **iOS Simulator Control:** `xcrun simctl` via Node.js `child_process`
- **API Verification:** `node-fetch` or `axios` for REST API calls
- **Configuration:** `dotenv` for environment variables
- **Reporting:** Jest native reporters + custom screenshot reporter

## Phase 1: Prototype (Feasibility Verification)

**Goal:** Verify that Playwright MCP can control Safari in iOS Simulator AND establish Node.js integration pattern

### Phase 1 Deliverables

1. **Prototype script** (`prototype/verify-safari-control.js`)
2. **MCP Integration Module** (`prototype/mcp-bridge.js`) - Documented pattern for calling MCP tools from Node.js
3. **Documentation** of findings, limitations, workarounds, and MCP invocation model
4. **Go/No-Go decision** for Phase 2

### Phase 1 Implementation Steps

#### Step 1.1: Environment Setup (1 hour)
- Verify Xcode and iOS Simulator installed
- Verify Playwright MCP server is running and accessible
- Create prototype directory structure:
  ```
  prototype/
  ├── verify-safari-control.js
  ├── package.json
  └── README.md
  ```

#### Step 1.2: Basic Simulator Control (2 hours)
- Write script to:
  - Boot iPhone 16 simulator via `xcrun simctl boot "iPhone 16"`
  - Wait for boot completion
  - Launch Safari via `xcrun simctl openurl booted https://example.com`
  - Verify simulator responds

**Code Example:**
```javascript
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function bootSimulator() {
  // List available devices
  const { stdout } = await execPromise('xcrun simctl list devices available');
  console.log('Available devices:', stdout);

  // Boot iPhone 16
  await execPromise('xcrun simctl boot "iPhone 16"');

  // Wait for boot
  await new Promise(resolve => setTimeout(resolve, 10000));

  return true;
}

async function openSafari(url) {
  await execPromise(`xcrun simctl openurl booted "${url}"`);
  await new Promise(resolve => setTimeout(resolve, 5000));
}
```

#### Step 1.3: MCP Integration Research (3 hours)
- **CRITICAL:** Determine how to call MCP tools from Node.js test code
- Options to investigate:
  - Direct HTTP/JSON-RPC calls to MCP server
  - Subprocess execution via Claude CLI
  - MCP client SDK for Node.js
- Document the chosen approach with code examples
- Create `mcp-bridge.js` module that wraps MCP tool calls

**Deliverable:** Working `mcp-bridge.js` with functions:
```javascript
// Example API
const mcp = require('./mcp-bridge');

await mcp.navigate('https://example.com');
await mcp.click('#button');
await mcp.type('#input', 'text');
const snapshot = await mcp.snapshot();
await mcp.screenshot('test.png');
```

#### Step 1.4: Playwright MCP Connection (3 hours)
- Test Playwright MCP tools with simulator Safari using the mcp-bridge:
  - `mcp.navigate()` to a test URL
  - `mcp.snapshot()` to verify page loaded
  - `mcp.click()` on a button
  - `mcp.type()` into an input field
  - `mcp.screenshot()` to capture evidence

**Key Questions to Answer:**
- Does Playwright MCP detect Safari in the simulator?
- Are interactions reliable (clicks, typing)?
- Do snapshots capture correct DOM structure?
- Are there timing issues or race conditions?
- What's the failure rate over 10 test runs?
- Is the MCP bridge pattern sustainable for full test suite?

#### Step 1.5: Constant Contact Login Test (2 hours)
- Navigate to Constant Contact login page
- Automate login flow:
  - Enter test username
  - Enter test password
  - Click login button
  - Verify dashboard loads

**Success Criteria for Phase 1:**
- ✅ Simulator boots and Safari launches reliably
- ✅ **MCP-to-Node.js integration pattern established and documented**
- ✅ **mcp-bridge.js module created with clean API**
- ✅ Playwright MCP successfully navigates to URLs
- ✅ Interactions (click, type) work consistently (≥90% success rate over 10 runs)
- ✅ Can complete full Constant Contact login flow
- ✅ Screenshots capture usable evidence

**If Phase 1 Fails:**
- Document specific blockers
- Explore alternatives:
  - Playwright in WebKit mode (desktop Safari simulation)
  - Appium for native iOS control
  - Manual testing workflow instead of automation

### Phase 1 Duration: 2-3 days

---

## Phase 2: Full Implementation

**Prerequisite:** Phase 1 completed successfully

### Phase 2 Directory Structure

```
mobile-simulator-testing/
├── tests/
│   ├── setup.test.js
│   ├── connection.test.js
│   ├── import.test.js
│   ├── products.test.js
│   ├── attribution.test.js
│   └── errors.test.js
├── lib/
│   ├── simulator.js
│   ├── playwright.js
│   ├── auth.js
│   ├── shopify.js
│   ├── ctct-api.js
│   ├── timestamps.js
│   └── screenshots.js
├── config/
│   ├── env.example
│   └── test-config.js
├── reports/
│   └── (screenshots saved here)
├── package.json
├── jest.config.js
└── README.md
```

### Phase 2 Implementation Steps

#### Step 2.1: Project Setup (2 hours)

**Tasks:**
- Initialize npm project: `npm init -y`
- Install dependencies:
  ```bash
  npm install --save-dev jest @jest/globals
  npm install dotenv node-fetch
  ```
- Create `.env.example` with required variables:
  ```
  CTCT_USERNAME=your-test-username
  CTCT_PASSWORD=your-test-password
  CTCT_LIST_ID=12345
  SHOPIFY_STORE_URL=https://your-test-store.myshopify.com
  SHOPIFY_API_KEY=your-api-key
  SHOPIFY_API_SECRET=your-api-secret
  TEST_EMAIL=test-recipient@example.com
  ```
- Configure Jest:
  ```javascript
  // jest.config.js
  module.exports = {
    testTimeout: 120000, // 2 min per test
    testSequencer: './sequential-sequencer.js', // Run tests sequentially
    reporters: ['default', './custom-screenshot-reporter.js']
  };
  ```
- Add `.gitignore`:
  ```
  node_modules/
  .env
  reports/
  ```

#### Step 2.2: Core Utilities (1 day)

**File: `lib/simulator.js`**
- `bootSimulator(deviceName)` - Boot iOS Simulator
- `shutdownSimulator()` - Shutdown simulator
- `openSafari(url)` - Launch Safari with URL
- `resetSimulator()` - Reset simulator state

**File: `lib/playwright.js`**
- Wrapper functions for Playwright MCP tools
- `navigate(url, options)` - Navigate with retry logic
- `waitForElement(selector, timeout)` - Wait with custom timeout
- `clickElement(selector, options)` - Click with verification
- `typeText(selector, text)` - Type with delay
- `takeScreenshot(name, redact)` - Screenshot with PII masking

**File: `lib/auth.js`**
- `loginToConstantContact()` - Automated login flow
- `verifyLoggedIn()` - Check if authenticated
- `logout()` - Logout (if needed)

**File: `lib/timestamps.js`**
- `generateTimestamp()` - ISO timestamp for unique names
- `generateCampaignName(prefix)` - e.g., "Test-Shopify-2026-03-07T14-32-15"

**File: `lib/screenshots.js`**
- `captureScreenshot(testName, step)` - Save to reports/
- `redactCredentials(imagePath)` - Mask sensitive data (optional, if feasible)
- Screenshot naming: `{test-name}-{step}-{timestamp}.png`

**File: `lib/ctct-api.js`**
- API verification helpers
- `getContactCount(listId)` - Query contact count on list
- `getCampaignById(campaignId)` - Get campaign details
- `getAttributionData(campaignId)` - Get attribution records

**File: `lib/shopify.js`**
- Shopify API helpers
- `getProducts()` - Fetch all products from test store
- `createTestOrder(productId)` - Simulate purchase
- `verifyOrderExists(orderId)` - Confirm order recorded

#### Step 2.3: Test Suite Implementation (3 days)

**File: `tests/setup.test.js`**
```javascript
describe('Environment Setup', () => {
  test('iOS Simulator boots successfully', async () => {
    const booted = await bootSimulator('iPhone 16');
    expect(booted).toBe(true);
  });

  test('Safari launches and loads page', async () => {
    await openSafari('https://example.com');
    const snapshot = await playwright.snapshot();
    expect(snapshot).toContain('Example Domain');
  });

  test('Constant Contact login succeeds', async () => {
    await loginToConstantContact();
    const loggedIn = await verifyLoggedIn();
    expect(loggedIn).toBe(true);
  });
});
```

**File: `tests/connection.test.js`**
- Navigate to integrations page
- Click "Connect Shopify" button
- Handle OAuth flow
- Verify "Connected" status appears
- API verification: Check connection status via API

**File: `tests/import.test.js`**
- Trigger contact import from Shopify
- Wait for import to complete (poll or wait fixed time)
- API verification: Query list contact count
- **Assert exactly 10 contacts imported** (not >=10, must be exact)
- Verify contact data fields for all 10 contacts (name, email, subscription status)

**File: `tests/products.test.js`**
- Navigate to email editor
- Verify product picker displays Shopify products
- **Assert all 5 products visible with correct names AND prices** (exact validation)
- Verify product images load correctly
- Create campaign with unique timestamp name
- Add products to email
- Send test email
- Verify email delivery (check inbox or use API)
- **Verify email renders product images correctly** (check inbox or screenshot)

**File: `tests/attribution.test.js`**
- Create campaign with tracking links
- Use Shopify API to simulate purchase
- Wait for attribution to sync (up to 5 min)
- Poll Constant Contact API for attribution data
- Verify order ID and revenue amount recorded

**File: `tests/errors.test.js`**
- **Test OAuth token expiration/denial** - Simulate expired or revoked token
- **Test Shopify API rate limit handling** - Verify graceful handling when rate limited
- **Test partial contact import failures** - Missing required fields, invalid data
- Test duplicate contact handling
- Test network timeout (mock slow network)
- Test Safari popup/alert interruption (cookie consent, permissions)
- Test simulator boot failure recovery
- Test attribution delay beyond timeout window

#### Step 2.4: Error Handling & Retry Logic (1 day)

**Retry Strategy:**
```javascript
async function retryOperation(fn, maxRetries = 2, delay = 5000) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries) throw error;
      console.log(`Retry ${i + 1}/${maxRetries} after error:`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

**Timeout Policies:**
- Page load: 30s
- Element wait: 10s
- Contact import: 60s
- Attribution sync: 5min (with polling)

**Screenshot on Failure (Jest pattern):**
```javascript
// In each test file
afterEach(async () => {
  const testState = expect.getState();
  if (testState.currentTestName && testState.assertionCalls === 0) {
    // Test failed
    await captureScreenshot(testState.currentTestName, 'failure');
  }
});

// Or use Jest's built-in error handling
global.afterEach(async function() {
  if (this.currentTest && this.currentTest.state === 'failed') {
    await captureScreenshot(this.currentTest.title, 'failure');
  }
});
```

#### Step 2.5: API Verification Layer (1 day)

For each UI test, add corresponding API verification:

**Example:**
```javascript
test('Contact import creates exactly 10 contacts', async () => {
  // UI: Trigger import
  await clickElement('#import-shopify-contacts');
  await waitForElement('#import-complete', 60000);

  // API Verification - EXACT count validation
  const contactCount = await ctctApi.getContactCount(process.env.CTCT_LIST_ID);
  expect(contactCount).toBe(10); // Exact match, not >=

  // Verify all contacts have required fields
  const contacts = await ctctApi.getContacts(process.env.CTCT_LIST_ID, 10);
  expect(contacts).toHaveLength(10);

  contacts.forEach((contact, idx) => {
    expect(contact).toHaveProperty('email_address');
    expect(contact.email_address).toMatch(/^.+@.+\..+$/);
    expect(contact).toHaveProperty('first_name');
    expect(contact).toHaveProperty('last_name');
  });
});
```

#### Step 2.6: Security & PII Handling (1 day)

**Credential Management:**
- All credentials in `.env` file
- Load with `dotenv` at test startup
- Never log credentials
- Git ignore `.env` file

**Log Sanitization:**
```javascript
function sanitizeLog(message) {
  return message
    .replace(/password[=:]\s*\S+/gi, 'password=***')
    .replace(/token[=:]\s*\S+/gi, 'token=***')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '***@***.***');
}
```

**Screenshot Redaction (if feasible):**
- Identify credential fields by selector
- Overlay black boxes before saving screenshot
- Alternatively: Rely on careful test design to avoid capturing credentials

#### Step 2.7: Documentation (1 day)

**README.md Contents:**
1. **Prerequisites:**
   - Xcode and iOS Simulator
   - Playwright MCP server running
   - Node.js v16+

2. **Setup Instructions:**
   - Clone repository
   - `npm install`
   - Copy `.env.example` to `.env` and fill in values
   - Verify Playwright MCP: `mcp__playwright__browser_navigate https://example.com`

3. **Running Tests:**
   - Full suite: `npm test`
   - Single test: `npm test -- tests/connection.test.js`
   - Watch mode: `npm test -- --watch`

4. **Troubleshooting:**
   - Simulator won't boot → Check Xcode installation
   - Playwright MCP not found → Verify MCP server running
   - Tests timing out → Increase timeouts in jest.config.js
   - Attribution test fails → Check Shopify webhook configuration

5. **Test Data:**
   - Expected Shopify products: [list product IDs/names]
   - Expected contacts: 10 contacts in test store
   - Test list ID: [document the list ID]

6. **Interpreting Results:**
   - Green: All tests passed
   - Red: Failed tests with screenshots in `reports/`
   - Check screenshot timestamps to identify failure point

### Phase 2 Duration: 7-10 days

---

## Testing Strategy

### Test Execution

**Sequential Execution:**
- Tests run one at a time (not parallel)
- Ensures no resource conflicts with simulator
- Custom Jest sequencer enforces order

**Test Ordering:**
1. setup.test.js (verify environment)
2. connection.test.js (establish Shopify connection)
3. import.test.js (import contacts)
4. products.test.js (product retrieval and email)
5. attribution.test.js (campaign tracking)
6. errors.test.js (edge cases)

### Success Metrics

**Definition of Success:**
- ≥95% pass rate over 10 consecutive runs
- All 5 core scenarios passing
- Screenshots captured for all failures
- Test suite completes in <10 minutes

**Flake Management:**
- If test fails <3 times out of 10 runs → acceptable flake
- If test fails ≥3 times → investigate and fix
- Document known flakes in README

### CI/CD Integration (Future)

Not required for initial implementation, but plan for:
- GitHub Actions workflow
- Scheduled daily runs
- Slack notifications on failure
- Screenshot artifacts uploaded

---

## Risk Mitigation

| Risk | Mitigation Strategy |
|------|---------------------|
| **Playwright MCP fails Phase 1** | Pivot to WebKit mode or Appium; document limitations |
| **MCP-to-Node.js integration unclear** | Dedicate Phase 1 Step 1.3 to research and document pattern |
| **Safari automation is flaky** | Increase timeouts, add retry logic, use stable selectors |
| **Attribution delays exceed 5min** | Make timeout configurable, add polling with backoff |
| **Test data conflicts** | Enforce sequential execution, use unique timestamps |
| **Simulator boot is slow** | Boot once at start, reuse across tests |
| **Account lockout or MFA** | Use dedicated test account with MFA disabled; monitor for lockout; have backup account |
| **UI selector drift** | Use data-testid attributes if possible; document selectors; add selector validation tests |
| **Email delivery verification** | Use email API for programmatic verification; fallback to manual check if API unavailable |

---

## Rollout Plan

### Week 1: Phase 1 (Prototype)
- Days 1-2: Simulator control + Playwright MCP verification
- Day 3: Document findings + Go/No-Go decision

### Week 2-3: Phase 2 (Implementation)
- Days 4-5: Project setup + core utilities
- Days 6-8: Test suite implementation
- Days 9-10: Error handling + API verification
- Day 11: Security + PII handling
- Day 12: Documentation + polish

### Week 4: Validation
- Run test suite 10 times
- Calculate pass rate
- Fix any failures
- Final review

---

## Success Criteria

### Phase 1 Success Criteria
- ✅ Playwright MCP can control Safari in iOS Simulator
- ✅ Login flow works reliably
- ✅ Decision to proceed to Phase 2

### Phase 2 Success Criteria
- ✅ All 5 test scenarios pass with ≥95% success rate
- ✅ Test suite completes in <10 minutes
- ✅ Screenshots captured for failures
- ✅ README with setup/run/troubleshoot instructions
- ✅ All credentials secured in .env
- ✅ No PII exposed in logs or screenshots

---

## Open Questions

1. ✅ **Test runner preference:** Jest (decided)
2. ✅ **Playwright MCP access:** Will be resolved in Phase 1 Step 1.3 (MCP Integration Research)
3. **Shopify OAuth:** Do we have a persistent test OAuth token, or re-auth each time?
4. **Attribution webhook:** Is attribution real-time or delayed? What's typical lag?
5. **Screenshot redaction:** Is automated PII redaction required, or acceptable to avoid capturing sensitive screens?
6. **Account lockout/MFA:** How to handle if test account triggers MFA or lockout?
7. **Selector stability:** Are CTCT/Shopify UI selectors stable, or do they change frequently?
8. **Email inbox access:** How to verify email delivery - API access or manual inbox check?

---

## Next Steps

1. **Get plan approval** from stakeholders
2. **Start Phase 1 prototype** (2-3 days)
3. **Go/No-Go decision** based on prototype results
4. **If Go:** Proceed with Phase 2 implementation (7-10 days)
5. **If No-Go:** Document blockers and explore alternatives

---

## Appendix: Alternative Approaches

If Playwright MCP + iOS Simulator proves infeasible:

### Alternative 1: Playwright WebKit Mode
- Use desktop Safari WebKit mode (not simulator)
- Trade-off: Not true iOS testing, but faster and more reliable
- Viewport set to mobile dimensions

### Alternative 2: Appium + iOS Simulator
- Use Appium for native iOS control
- More heavyweight, but designed for mobile testing
- Trade-off: More complex setup, slower execution

### Alternative 3: Manual Test Protocol
- Documented manual test steps
- Checklist-based testing
- Trade-off: Not automated, but guaranteed to work
