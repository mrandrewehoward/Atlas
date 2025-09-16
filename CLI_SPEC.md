# Atlas Workbench — CLI Spec & Roadmap

This document consolidates the existing CLI docs and code, proposes a cleaned-up command grammar, and provides an implementation and testing roadmap so we can build a robust in-app CLI/terminal.

Summary of current state
------------------------
- Documentation: `docs/cli-commands.md` contains a useful (but partial) command reference and examples.
- TODOs and notes: `TODO.md` mentions CLI features and outstanding work (history navigation, CRUD wiring, ARIA/a11y).
- Frontend: The app includes a terminal/CLI area inside `src/routes/+page.svelte` and supporting code (searching the repo shows commands and use sites). The CLI currently supports universal commands and area-based commands (spaces/projects/tasks/items) with some interactive helpers.

Why we need a formal spec
--------------------------
- The UI terminal needs a consistent grammar and parsing to avoid ad-hoc commands.
- Commands must be discoverable and testable (unit + integration tests).
- Accessibility and keyboard UX must be consistent.
- We want to support both interactive flows (drill-down) and single-line commands with flags.

High-level goals
-----------------
1. Human-friendly, consistent command grammar (verbs + resources + flags)
2. Pluggable architecture where new areas can register commands
3. Predictable error messages and help output
4. Full test coverage for core parsing and common commands
5. Good accessibility (aria labels, keyboard, focus management)

Command grammar (recommended)
----------------------------
- Top-level syntax:

  /<area> [<action>] [<subject>] [flags]

  - <area> — resource area (spaces, projects, tasks, items, user, settings)
  - <action> — verb: list|get|add|edit|del|search|sel|stats|help
  - <subject> — numeric index or quoted name or id
  - flags — `-n`, `-d`, `-o`, `--force`, etc.

Examples:

  /spaces list
  /spaces add -n "New Space" -o 3
  /projects sel 2
  /tasks add -d "Title" -p high
  /items search "invoice"
  /help spaces

Interactive context & drill-in
------------------------------
The CLI supports both stateless commands (explicit area prefix) and a stateful context stack for drill-in workflows.

Context model (brief):
- The terminal keeps a small context stack in memory: top-of-stack is the current area and (optionally) selected entity.
- Explicit commands (starting with `/area`) always run regardless of context. Non-prefixed commands resolve against the current context area.

Example:

  /spaces switch 2
  [spaces:Beta] > list    # equivalent to /spaces list
  sel 3                   # equivalent to /spaces sel 3
  projects switch 5       # drill into projects under the current space


Universal commands (kept with leading slash)
- /help [area] — Show help for area
- /cls — Clear terminal
- /whoami — Show current user
- /motd — Message of the day
- /echo [text] — Echo text
- /about — App info
- /version — App version

Suggested area commands
-----------------------
For each resource area we recommend a consistent set of actions: `list`, `add`, `get`, `edit`, `del`, `search`, `sel`, `stats`.

Spaces
- /spaces list
- /spaces add -n "Name" -o 2
- /spaces get 2
- /spaces edit 2 -n "New Name"
- /spaces del 2
- /spaces sel 2

Projects
- /projects list [--space=2]
- /projects add -n "Title" -s 2
- /projects sel 3
- /projects edit 3 -n "New Title"
- /projects del 3

Tasks
- /tasks list [--project=3]
- /tasks add -n "Title" -p high -d "desc" --due "2025-09-20"
- /tasks sel 5
- /tasks edit 5 -n "New Title" -p medium
- /tasks del 5

Items
- /items list [--task=5]
- /items add -n "Item" -d "notes"
- /items sel 12
- /items edit 12 -n "New Item"
- /items del 12

User & Settings
- /user info
- /settings get key
- /settings set key value

Command parsing and implementation notes
----------------------------------------
- Build a small parser that returns a structured command object:
  { area, action, subject, flags }
- Separate parsing from execution: implement an `executor` that takes the structured object and calls area-specific handlers.
- Provide clear error messages for unknown area/action and for missing required flags/subject.
- Support both interactive mode (stateful selection) and stateless commands (single-line). Maintain a minimal context stack for drill-down (current space/project/task).

Help and discoverability
------------------------
- Implement `/help` to show top-level areas and `/help <area>` to list area commands with examples.
- Add an auto-complete helper in the terminal UI for areas and flags.

Testing plan
------------
- Unit tests for parser: inputs -> expected structured commands (positive & negative cases).
- Unit tests for each command handler (mock data layer): ensure correct outputs and error handling.
- Integration test: run an end-to-end flow in a headless environment (dev server), test `add`, `list`, `sel` transitions.

Developer notes
---------------
- Put the parser and executor under `src/lib/cli/`. Keep a small public API so the terminal UI can call `parse()` and `execute()`.
- Implement handlers in `src/lib/cli/areas/` with a stable interface: `list(ctx, flags)`, `add(ctx, flags)`, `edit(ctx, id, flags, prompt)`, `del(ctx, id, flags)`.
- The prompt helper should be a thin wrapper used by handlers to request additional input from the user during interactive flows.

Accessibility
-------------
- Ensure the terminal is reachable by keyboard and screen-readers; aria-live for outputs.
- Add ARIA labels to input, buttons, and focus traps for modal interactions.

Migration plan & prioritized tasks (next actions)
-----------------------------------------------
1. Create `CLI_SPEC.md` (this file) — DONE
2. Implement parser and unit tests (high priority)
3. Replace ad-hoc handlers with an `executor` that delegates to area modules (projects/tasks/etc.)
4. Implement `/help` and auto-complete UI
5. Add integration tests and CI job to run them

Files to inspect when implementing
---------------------------------
- `docs/cli-commands.md` — existing command list and examples
- `src/routes/+page.svelte` — terminal area and wiring
- `src/lib/` — search for terminal/cli handlers and state stores
- `.github/instructions` — check for a11y and UI guidance

Proposed changes to repo (I can implement these incrementally)
-----------------------------------------------------------
1. Add `src/lib/cli/parser.ts` — parser unit and grammar tests
2. Add `src/lib/cli/executor.ts` — maps parsed commands to handlers
3. Move area-specific logic into `src/lib/cli/areas/*.ts` (spaces, projects, tasks, items)
4. Add tests in `tests/cli/parser.test.ts` and `tests/cli/executor.test.ts`
5. Extend `docs/cli-commands.md` from this spec, replacing ad-hoc examples with the recommended grammar

Next steps I can take now
------------------------
- Implement the parser and tests (fast — ~1–2 hours) and add a small executor for `/help`, `/cls`, `/whoami` to bootstrap.
- Or, update `docs/cli-commands.md` to align with this cleaned grammar and add examples.

Which would you like me to do first? I recommend implementing the parser + unit tests first so we have a safe foundation to wire the area handlers to.
