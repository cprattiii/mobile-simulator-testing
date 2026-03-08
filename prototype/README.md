# Phase 1 Prototype: iOS Simulator + Playwright MCP

**Goal:** Verify that Playwright MCP can control Safari in iOS Simulator and establish Node.js integration pattern.

## Objectives

1. ✅ Boot iOS Simulator programmatically
2. ⏳ Establish MCP-to-Node.js calling pattern
3. ⏳ Test Playwright MCP with Simulator Safari
4. ⏳ Verify login flow to Constant Contact
5. ⏳ Document findings and make Go/No-Go decision

## Files

- `verify-safari-control.js` - Main prototype script
- `mcp-bridge.js` - MCP integration module (to be created)
- `simulator.js` - iOS Simulator control utilities
- `README.md` - This file

## Running

```bash
node verify-safari-control.js
```

## Success Criteria

- ✅ Simulator boots and Safari launches
- ✅ MCP integration pattern working
- ✅ Can navigate, click, type via Playwright MCP
- ✅ ≥90% success rate over 10 runs
- ✅ Can complete Constant Contact login

## Next Steps After Prototype

If successful → Proceed to Phase 2 (Full Implementation)
If blocked → Document issues and explore alternatives
