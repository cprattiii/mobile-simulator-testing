# Specification: Shopify Integration Testing via iOS Simulator

**ID:** 1
**Title:** Shopify Integration Testing via iOS Simulator
**Status:** Updated - Addressing Codex Feedback
**Created:** 2026-03-07
**Protocol:** SPIR

## Problem Statement

Constant Contact integrations with e-commerce platforms need to be tested on iOS devices to ensure mobile compatibility and proper functionality. Currently, there is no automated or structured way to test the Shopify integration through the iOS simulator, which is critical for verifying the mobile user experience.

Manual testing on iOS is time-consuming and error-prone. We need a reliable, repeatable process to verify that the Shopify integration works correctly when accessed through Safari on iOS devices.

## Requirements

### Functional Requirements

1. **Test Environment Setup**
   - Launch iOS Simulator programmatically
   - Open Safari browser in the simulator
   - Navigate to Constant Contact dashboard
   - Authenticate with test account credentials

2. **Shopify Connection Testing**
   - Navigate to integrations page/landing page
   - Initiate Shopify integration connection
   - Connect to test Shopify store
   - Verify connection success confirmation

3. **Contact Import Verification**
   - Trigger contact import from Shopify test store
   - Verify subscribed contacts are imported
   - Verify contacts are added to the correct list in Constant Contact
   - Validate contact data fields (name, email, subscription status)

4. **Product Retrieval Testing**
   - Verify products can be retrieved from Shopify store
   - Confirm products display correctly in email editor
   - Create test email campaign with timestamped name (e.g., "Test-Campaign-2026-03-07-14-32-15")
   - Send test email to verify product rendering

5. **Campaign Attribution Testing**
   - Create campaign with tracking links and unique timestamp
   - Simulate test purchase in Shopify store
   - Verify campaign attribution is recorded in Constant Contact
   - Validate attribution data (order ID, revenue, products purchased)

6. **Error Handling & Edge Cases**
   - OAuth token expiration/denial during Shopify connection
   - Shopify API rate limit handling
   - Partial contact import failures (missing required fields)
   - Duplicate contact handling
   - Network timeout during product retrieval
   - Safari popup/alert interruptions (cookie consent, permissions)
   - iOS Simulator boot failures or slow starts
   - Attribution delay handling (purchase to dashboard update lag)

### Non-Functional Requirements

1. **Automation:** Tests fully automated using Playwright MCP for Safari control
2. **Repeatability:** Tests use unique timestamped identifiers for campaigns/contacts to enable multiple runs without cleanup
3. **Reporting:** Clear pass/fail reporting with screenshots on failure, detailed error messages
4. **Speed:** Full test suite target completion time under 10 minutes
5. **Maintainability:** Test code well-documented with clear test case organization
6. **Security:**
   - Credentials stored in environment variables, never hardcoded
   - Sensitive data masked in logs and screenshots
   - No PII exposed in test artifacts or reports
   - Test account credentials rotated regularly

## Success Criteria

1. **Phase 1 - Prototype (must complete first):**
   - Verify Playwright MCP can control Safari in iOS Simulator
   - Demonstrate basic navigation and interaction in simulator Safari
   - Document any limitations or workarounds discovered

2. **Phase 2 - Implementation (after prototype success):**
   - Automated test suite launches iOS Simulator (iPhone 16) and Safari
   - All five test scenarios pass with ≥95% success rate over 10 consecutive runs
   - Each test produces measurable assertions:
     - Connection: OAuth success response code + "Connected" status visible
     - Import: Exact count of imported contacts matches expected (10 contacts)
     - Products: All 5 products visible in email editor with correct names/prices
     - Email: Test email delivered to inbox with product images rendered
     - Attribution: Order ID and revenue amount recorded in dashboard within 5 minutes
   - Test failures include screenshots with timestamp and error context
   - Tests complete via single CLI command: `npm test` or similar
   - README with setup, run, and troubleshooting instructions

## Out of Scope

- Testing on physical iOS devices (simulator only)
- Testing other e-commerce integrations (BigCommerce, Wix) in this spec
- Testing CRM integrations (Salesforce, Cloze) in this spec
- Performance testing or load testing
- Testing Constant Contact mobile app (only web dashboard via Safari)
- Cross-browser testing (Chrome, Firefox, etc.)

## Assumptions

1. Test accounts exist for:
   - Constant Contact (with admin/integration permissions, API access if needed)
   - Shopify test store (with OAuth app configured)
2. iOS Simulator and Xcode are already installed and functioning on macOS
3. Test Shopify store has:
   - Exactly 5 sample products (known IDs and names for assertions)
   - Exactly 10 sample subscribed contacts with valid email addresses
   - Checkout configured for test payments (Shopify test mode enabled)
4. Constant Contact test account has:
   - Dedicated test list(s) for imports (list IDs documented)
   - Email sending enabled to test recipient address
   - Campaign tracking and attribution enabled
5. Network connectivity to both Constant Contact and Shopify APIs (no firewall blocks)
6. Tests run sequentially (not parallel) to avoid resource conflicts
7. Manual cleanup of test data is acceptable (campaigns accumulate over time)

## Technical Considerations

1. **iOS Simulator Control:**
   - Playwright MCP for Safari browser automation
   - `xcrun simctl` for simulator management
   - Device: iPhone 16 (latest iOS version)
   - Browser: Safari in normal mode (no private mode testing)

2. **Test Data Management:**
   - Environment variables for credentials (never commit to git)
   - Configuration file for test store URLs and list IDs
   - **No cleanup** - test data remains for manual inspection after tests complete
   - **Unique identifiers**: All created entities use timestamps (campaigns, emails, etc.)
   - Example: Campaign name format: `Test-Shopify-{ISO-timestamp}`
   - Tests are idempotent because each run creates uniquely named artifacts

3. **Test Framework:**
   - Playwright MCP as the browser automation layer
   - Standard test runner (Jest, Mocha, or Node.js test framework)
   - Test organization: One file per functional requirement
   - Shared fixtures for authentication and setup

4. **Verification Strategy:**
   - **UI assertions** via Playwright MCP tools (element visibility, text content)
   - **API verification** using Constant Contact and Shopify REST APIs to confirm data sync
   - **Screenshot evidence** for all failures with timestamp and test context
   - **Browser snapshots** for page structure verification
   - **Timeout policies**: 30s for page loads, 60s for imports, 5min for attribution

5. **Error Handling & Reporting:**
   - Screenshot capture on all failures with redacted credentials
   - Console log collection via Playwright (errors and warnings only)
   - Network request/response logging (sanitize auth tokens and PII)
   - Graceful timeout handling with retry logic (max 2 retries)
   - Test report includes:
     - Pass/fail count per scenario
     - Execution time per test
     - Error messages with stack traces
     - Screenshot paths for failures
   - Exit code 0 for all pass, 1 for any failure

## Dependencies

- **Playwright MCP server** (must be configured and running) - **UNVERIFIED: Needs prototype phase**
- Access to Constant Contact test environment with test account credentials
- Access to Shopify test store with test data (5 products, 10 contacts)
- iOS Simulator with iPhone 16 (via Xcode)
- Node.js runtime (v16+)
- Test runner framework (Jest, Mocha, or Node.js native test)

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Playwright MCP may not support iOS Simulator Safari | High - Blocks entire project | **Phase 1 prototype required** to verify feasibility before full implementation |
| Safari automation may be flaky/unstable | Medium | Implement retry logic, increase timeouts, use stable selectors |
| Test data conflicts if run concurrently | Medium | Use unique timestamps per run, document single-instance requirement |
| Attribution delay exceeds timeout | Low | Configurable timeout, poll API for results |

## Decisions Made

All open questions have been resolved:

1. ✅ **Automation framework**: Playwright via Playwright MCP (requires Phase 1 verification)
2. ✅ **Test approach**: Automated regression suite (NOT test-day multi-agent orchestration)
3. ✅ **Cleanup strategy**: No cleanup - use unique timestamps for idempotency
4. ✅ **iOS target**: iPhone 16 with latest iOS version
5. ✅ **Browser mode**: Safari normal mode only (no private mode)
6. ✅ **Security**: Credentials in env vars, masked in logs, no PII in artifacts

## Future Extensions

After this spec is complete, we can extend to:
- BigCommerce integration testing
- Wix integration testing
- Salesforce CRM integration testing
- Cloze CRM integration testing
- Multi-device testing (iPad, different iPhone models)
- Other iOS browsers if applicable
