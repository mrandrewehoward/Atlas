// src/lib/cli/cliStore.ts
// Centralized CLI state, context stack, and command routing for Atlas Workbench
// Extracted from +layout.svelte for modularity and testability

import { writable } from 'svelte/store';

export type CliMode = null | 'spaces' | 'projects' | 'tasks' | 'items';
export interface CliContext {
  mode: string;
  data?: any;
}

export const cliMode = writable<CliMode>(null);
export const cliContextStack = writable<CliContext[]>([]);
export const cliHistory = writable<string[]>([]);
export const cliInput = writable('');
export const cliLines = writable<Array<{ text: string; type: string; blurred: boolean }>>([
  { text: 'Welcome to Atlas Workbench! Type /help for commands.', type: 'info', blurred: false }
]);

export function pushCliContext(mode: string, data?: any) {
  cliContextStack.update(stack => {
    const newStack = [...stack, { mode, data }];
    cliMode.set(mode as CliMode);
    return newStack;
  });
}

export function popCliContext() {
  cliContextStack.update(stack => {
    const newStack = stack.slice(0, -1);
    cliMode.set(newStack.length > 0 ? (newStack[newStack.length - 1].mode as CliMode) : null);
    return newStack;
  });
}

export function resetCliContext() {
  cliContextStack.set([]);
  cliMode.set(null);
}

// Add more CLI state and helpers as needed
