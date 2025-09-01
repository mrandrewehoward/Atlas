# Atlas Workbench: To-Do & Next Steps

## Accessibility & UX
- [x] Fix a11y warnings for login modal action links
- [ ] Add ARIA roles and labels to modals and terminal
- [ ] Ensure all form fields have <label> elements
- [ ] Add "Skip to main content" link for keyboard users
- [ ] Ensure color contrast meets WCAG AA for all custom colors
- [ ] Add focus outlines and visible states for all interactive elements

## Authentication
- [x] Login and registration modal flows
- [ ] Add email confirmation flow
- [ ] Add password reset flow
- [ ] Show loading indicators and error messages for all async actions

## Data Wiring
- [x] Fetch spaces, projects, tasks, and items from Supabase
- [ ] Wire up CRUD actions for spaces and projects
- [ ] Optimistic UI updates and error handling for all data mutations

## CLI Terminal Features
- [x] Universal CLI commands: /help, /datetime, /cls, /whoami, /motd, /fortune, /echo, /about, /version, /theme
- [ ] Expand CLI: /reset-password, /confirm-email, /spaces, /projects, /tasks (real data)
- [ ] Add command history navigation (up/down arrows)

## Command Line Improvements & Usage Cleanup
- Improve CLI command parsing and error messages
- Add usage consistency and cleanup for all entity modes (spaces, projects, tasks, items)
- Add contextual help for all entity modes
- Expand context stack and drill-down navigation
- Add keyboard shortcuts and power-user features
- Polish CLI output formatting and UX

## UI/UX Polish
- [ ] Add meta tags and SEO improvements in <svelte:head>
- [ ] Audit bundle size and optimize imports

## Testing
- [ ] Add unit and integration tests for Svelte components and stores
- [ ] Test keyboard navigation and screen reader flows

---

# Immediate Focus
- [ ] Wire up Spaces and Projects to real Supabase data (CRUD)
- [ ] Show loading and error states for Spaces/Projects
- [ ] Add ability to create, rename, and delete Spaces/Projects
