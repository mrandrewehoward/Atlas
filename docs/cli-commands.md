# Atlas Workbench CLI Command Reference

This document describes the CLI/terminal command system for Atlas Workbench, including all supported commands, flags, usage patterns, and extensibility notes.

---

## Top-Level Areas (case-insensitive)

- `/login` — Log in
- `/spaces` — Manage spaces
- `/projects` — Manage projects
- `/tasks` — Manage tasks
- `/items` — Manage items
- `/settings` — App/user settings
- `/user` — User info
- `/help` — Show help

---

## Universal Commands

| Command         | Description                                 |
|-----------------|---------------------------------------------|
| `/help`         | Show all available commands                 |
| `/help [area]`  | Show help for a specific area               |
| `/cls`          | Clear the terminal screen                   |
| `/whoami`       | Show the current user info                  |
| `/motd`         | Show a random message of the day            |
| `/fortune`      | Show a random fortune/cookie                |
| `/echo [txt]`   | Print text back to the terminal             |
| `/about`        | Show info about Atlas Workbench             |
| `/version`      | Show app version                            |
| `/theme`        | Toggle light/dark mode (future)             |

---

## /spaces Area Commands

| Command                              | Description                                                      |
|--------------------------------------|------------------------------------------------------------------|
| `ls`                                 | List all spaces (numbered)                                       |
| `list` / `ls`                        | List all spaces (numbered)                                       |
| `sel n` / `select n`                 | Select space by number (or use id/name)                          |
| `fields`                             | List fields for the selected space                               |
| `edit n`                             | Edit field n (prompts for value)                                 |
| `edit n value`                       | Edit field n, set value directly                                 |
| `add` / `create`                     | Add a new space (prompts for fields)                             |
| `add -n "Title"`                    | Add a new space with name/title set to "Title"                 |
| `order n up/down`                    | Move space n up or down in order                                 |
| `del n`                              | Delete space n (prompts for confirmation)                        |
| `stats n`                            | Show stats/details for space n                                   |
| `fields`                             | List editable fields for the entity                              |
| `set n field value`                  | Set a specific field for space n                                 |
| `search term`                        | Search spaces by name or field                                   |
| `back` / `pop`                        | Return to previous context (drill-up)                            |
| `exit` / `quit`                      | Exit the CLI terminal                                            |
| `edit "Name" -set "NewName"`         | Edit space by name, set name directly                            |
| `edit "Name" -o 2`                   | Edit space by name, set order to 2                               |

---

## Example Interactions (stateless and interactive)

```
1) Stateless usage

	/spaces list
	1. Atlas
	2. Beta
	3. Gamma

	/spaces sel 2
	Selected: Beta

> fields
1. name
2. order

> edit 1 "New Beta Name"
Space name updated to 'New Beta Name'

> edit 2
1. name
2. order
Enter new value for option #: 2 -"1"
Space order updated to 1

2) Interactive (drill-in)

	/spaces switch 2
	[spaces:Beta] > list
	1. Projects
	2. Settings

	[spaces:Beta] > add
	Enter name: New Subspace
	Enter order: 4
	Space 'New Subspace' added.

	[spaces:Beta] > edit 1
	1. name
	2. order
	Enter new value for option #: 1 - "New Beta Name"
	Space name updated to 'New Beta Name'

	[spaces:Beta] > back
	/

> edit "Beta" -set "Beta 2"
Space name updated to 'Beta 2'

> edit "Beta 2" -o 1
Space order updated to 1
```

---

## Extensibility & Future Commands

- All commands are case-insensitive.
- Flags: `-set`, `-n` (name), `-o` (order), etc. (extendable for more fields)
- Interactive and direct edit modes supported
- Area-specific help: `/spaces -h` or `/spaces help`
- Future: import/export, bulk, history, undo/redo, clone, archive, restore

---

## TODO / Improvements

- Command line improvements (parsing, error messages, context stack, drill-down, etc.)
- Usage cleanup and consistency for all entity modes (spaces, projects, tasks, items)
- Add contextual help for all entity modes
- Accessibility/a11y review for all CLI and UI interactions
- Add more robust error handling and user feedback in CLI
- Expand CLI to support all CRUD operations for projects, tasks, and items
- Add keyboard shortcuts and power-user features
- Polish CLI output formatting and UX

---

---

_Last updated: September 1, 2025_
