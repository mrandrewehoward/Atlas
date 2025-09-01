// .github/CODE_REVIEW_CHECKLIST.md

# Atlas Workbench Code Review Checklist

Use this checklist before every commit, PR, or merge. This helps prevent recurring issues and ensures code quality.

## Svelte & Markup
- [ ] Only one <script> block per .svelte file (no duplicates)
- [ ] All <div>, <section>, <main>, etc. are properly closed
- [ ] Use <button> for actions, <a> for navigation (with href)
- [ ] All event handlers use Svelte syntax (onclick, on:click, etc.)
- [ ] No inline JS event attributes (use Svelte's on: syntax)
- [ ] All form fields have <label> elements
- [ ] ARIA roles and labels are present where needed
- [ ] No a11y warnings in VS Code or browser dev tools

## Tailwind & Styling
- [ ] Use Tailwind utility classes for layout and styling
- [ ] Use DaisyUI classes for components where possible
- [ ] No deprecated Tailwind patterns (see copilot-instructions.md)

## TypeScript & Logic
- [ ] All logic in <script lang="ts"> block
- [ ] All props, state, and functions are typed
- [ ] No business logic in layout files—use stores/services
- [ ] All entity CRUD logic is in stores/services, not UI

## Stores & State
- [ ] Use Svelte stores for cross-component state
- [ ] Use context for dependency injection if needed
- [ ] No direct DOM manipulation unless absolutely necessary

## CLI & Modularization
- [ ] CLI logic is in dedicated modules/stores
- [ ] Each entity has its own CLI handler module
- [ ] CLI state/context/history is managed in a store

## General
- [ ] All user content is scoped by user_id
- [ ] All files have clear comments and JSDoc where needed
- [ ] No commented-out legacy code left in PRs
- [ ] README and docs updated if architecture changes

---

Keep this checklist up to date as the project evolves!
