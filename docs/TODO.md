# TODO List for Atlas Project

This file tracks key features, screens, and implementation tasks based on your database schema and project instructions. Update as you progress!

---

## Core Features & Screens

- [ ] Authentication (Supabase Auth)
- [ ] Dashboard (spaces, projects, tasks overview)
- [ ] Project Detail (project info, tasks, tags)
- [ ] Task Detail (task info, checklist/items, comments)
- [ ] Activity Feed (audit log, per-entity history)
- [ ] Undo/Redo (log and revert recent changes)
- [ ] Attachments (file uploads for entities)
- [ ] Tag Management (create/edit tags, assign to items/tasks/projects)
- [ ] User Settings (preferences, quotas)
- [ ] Print features
- [ ] Stats at higher levels (tasks completed, overdue counts, etc.)
- [ ] Expense/attachment tracking
- [ ] Realtime updates (Supabase subscriptions)

---

## Database & Data Model

- [ ] Implement all main tables as per `db-feature-mapping.md`
- [ ] Ensure all relationships (one-to-many, many-to-many) are handled
- [ ] Use `activity_log` for auditing and undo/redo
- [ ] Scope all user content by `user_id`

---

## UI/UX

- [ ] Modern, distinct UI using Tailwind v4
- [ ] Space chooser always visible
- [ ] Drill-in navigation (space → project → task → item)
- [ ] Show stats, priorities, and counts at each level
- [ ] No user content visible unless authenticated
- [ ] Experiment with layout/spacing/borders

---

## Developer Workflow

- [ ] Install dependencies (`npm install`)
- [ ] Run dev server (`npm run dev`)
- [ ] Build for production (`npm run build`)
- [ ] Supabase CLI for migrations and schema
- [ ] Add/expand tests as needed

---

## Immediate Action Items (Refactor Plan)

- Refactor all large Svelte files (especially +layout.svelte) into focused, testable components:
	- TerminalPanel.svelte
	- HeaderBar.svelte
	- StatusBar.svelte
	- ActivityBar.svelte
	- SidebarAccordion.svelte
	- LoginModal.svelte
	- SpaceSelector.svelte
	- ProjectList.svelte
	- TaskList.svelte
	- TaskItemList.svelte
	- SettingsPanel.svelte
	- SearchPanel.svelte
- Move all Supabase logic to a central module (lib/api or lib/supabase).
- Add error/loading/empty states to all panels and data fetches.
- Use DaisyUI 5 and Tailwind 4 classes only, with the emerald theme (no custom CSS outside of those).
- Type all data models and props (TypeScript).
- Add DaisyUI alerts for all errors.
- Add keyboard navigation and ARIA to all interactive elements.
- Add a global store for user/session state if needed.

-- See `db-feature-mapping.md` and `copilot-instructions.md` for full details.
-- Update this file as features are added, changed, or completed.
