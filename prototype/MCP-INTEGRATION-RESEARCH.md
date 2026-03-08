# MCP Integration Research - Phase 1 Step 1.3

**Date:** 2026-03-08
**Status:** In Progress

## Problem Statement

We need to call Playwright MCP tools (`mcp__playwright__browser_navigate`, `mcp__playwright__browser_click`, etc.) from Node.js test code running in Jest.

## Research Findings

### MCP Tool Availability

MCP (Model Context Protocol) tools are available in the Claude Code environment but are designed to be called by Claude (the AI agent), not directly by Node.js code.

### Integration Approaches Investigated

#### Option 1: Direct MCP Client SDK
- **Status:** No official Node.js MCP client SDK found
- **Pros:** Would be cleanest integration
- **Cons:** Not available/documented

#### Option 2: Claude CLI Subprocess
- **Status:** Possible but complex
- **Approach:** Spawn `claude` CLI and pipe commands
- **Pros:** Claude CLI has MCP access
- **Cons:** Complex IPC, not designed for programmatic use

#### Option 3: Playwright Direct (No MCP)
- **Status:** Most pragmatic approach
- **Approach:** Use standard Playwright library directly instead of MCP
- **Pros:** Well-documented, stable, designed for test automation
- **Cons:** Need to configure Playwright for iOS Simulator

#### Option 4: Hybrid Approach
- **Status:** Under consideration
- **Approach:** Use Playwright library directly, leverage MCP for specific tasks via Claude agent
- **Pros:** Best of both worlds
- **Cons:** More complex architecture

## **CRITICAL DECISION POINT**

The MCP tools are designed for AI agents (Claude), not for programmatic access from test code. We have two paths forward:

### Path A: Use Playwright Library Directly (RECOMMENDED)
**Install standard Playwright:**
```bash
npm install @playwright/test playwright
npx playwright install webkit
```

**Configure for iOS Simulator:**
```javascript
const { webkit } = require('playwright');

// Connect to Safari in iOS Simulator
const browser = await webkit.connect({
  wsEndpoint: 'ws://localhost:9222' // Safari remote debugging
});
```

**Pros:**
- Standard, well-documented approach
- Full test automation features
- No dependency on MCP availability
- Can still use iOS Simulator

**Cons:**
- Need to enable Safari remote debugging in simulator
- May not be "true" iOS Safari (WebKit engine similar but not identical)

### Path B: Manual Testing with MCP-Assisted Validation
**Approach:**
- Manual test execution in simulator
- Use Claude with MCP tools to verify results
- Semi-automated approach

**Pros:**
- Leverages MCP tools as designed
- True iOS Simulator Safari testing

**Cons:**
- Not fully automated
- Doesn't meet spec requirement for automated testing

## Recommended Solution

**Use Playwright Library Directly** with iOS Simulator configuration:

1. Install Playwright
2. Enable Safari Remote Debugging in iOS Simulator
3. Connect Playwright to Safari via WebSocket
4. Write tests using standard Playwright API

This aligns with the spec's goal of automated testing while still using iOS Simulator.

## Next Steps

1. **User Decision Required:** Confirm approach (Path A recommended)
2. Install Playwright library
3. Research Safari remote debugging in iOS Simulator
4. Create mcp-bridge.js that wraps Playwright (not MCP)
5. Test with Constant Contact login

## Alternative: Update Spec

If we must use Playwright MCP tools specifically, we need to:
- Revise the spec to acknowledge semi-automated approach
- Have Claude agent run tests using MCP tools
- Tests become "Claude scripts" rather than Jest tests

This would be a significant architecture change.

## Open Questions

1. Can Safari in iOS Simulator enable remote debugging?
2. Does webkit.connect() work with iOS Simulator?
3. Is WebKit desktop mode acceptable vs true iOS Safari?
4. Should we update the spec based on these findings?
