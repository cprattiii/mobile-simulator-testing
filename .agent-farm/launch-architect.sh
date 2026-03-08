#!/bin/bash
cd "/Users/cpratt/rollout-setup/mobile-simulator-testing"
exec claude --append-system-prompt "$(cat '/Users/cpratt/rollout-setup/mobile-simulator-testing/.agent-farm/architect-role.md')"
