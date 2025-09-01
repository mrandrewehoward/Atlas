// src/lib/cli/cliParser.ts
// CLI input parser and command dispatcher for Atlas Workbench
// Extracted from +layout.svelte for modularity

import type { CliContext } from './cliStore';

export interface CliCommandHandler {
  (cmd: string, ctx?: CliContext): boolean | void;
}

// Registry for entity-specific command handlers
const handlers: Record<string, CliCommandHandler> = {};

export function registerCliHandler(mode: string, handler: CliCommandHandler) {
  handlers[mode] = handler;
}

export function parseCliInput(cmd: string, ctx?: CliContext): boolean {
  // Route to the correct handler based on context
  if (ctx && handlers[ctx.mode]) {
    const result = handlers[ctx.mode](cmd, ctx);
    return typeof result === 'boolean' ? result : false;
  }
  // Fallback: no handler found
  return false;
}

// Add more parsing helpers as needed
