# Database Table Structure & Feature Mapping

This document summarizes your main tables, their columns, and provides a template for mapping each table to app features/screens.

---

## Table: activity_log

| Column      | Type                     | Nullable | Default           |
| ----------- | ------------------------ | -------- | ----------------- |
| id          | uuid                     | NO       | gen_random_uuid() |
| user_id     | uuid                     | YES      |                   |
| entity_type | text                     | YES      |                   |
| entity_id   | uuid                     | YES      |                   |
| action      | text                     | YES      |                   |
| details     | jsonb                    | YES      |                   |
| created_at  | timestamp with time zone | YES      | now()             |

**Purpose/Features:**

- Track user actions and changes across the app (activity feed, audit log, notifications)

---

## Table: attachments

| Column      | Type                     | Nullable | Default           |
| ----------- | ------------------------ | -------- | ----------------- |
| id          | uuid                     | NO       | gen_random_uuid() |
| entity_type | text                     | YES      |                   |
| entity_id   | uuid                     | YES      |                   |
| url         | text                     | YES      |                   |
| uploaded_by | uuid                     | YES      |                   |
| created_at  | timestamp with time zone | YES      | now()             |

**Purpose/Features:**

- Store file attachments for tasks, items, comments, etc.

---

## Table: comments

| Column      | Type                     | Nullable | Default           |
| ----------- | ------------------------ | -------- | ----------------- |
| id          | uuid                     | NO       | gen_random_uuid() |
| user_id     | uuid                     | YES      |                   |
| entity_type | text                     | YES      |                   |
| entity_id   | uuid                     | YES      |                   |
| content     | text                     | YES      |                   |
| created_at  | timestamp with time zone | YES      | now()             |

**Purpose/Features:**

- User comments on tasks, items, projects, etc.

---

## Table: item_tags

| Column  | Type | Nullable | Default |
| ------- | ---- | -------- | ------- |
| item_id | uuid | NO       |         |
| tag_id  | uuid | NO       |         |

**Purpose/Features:**

- Many-to-many relationship between items and tags

---

## Table: items

| Column          | Type                     | Nullable | Default           |
| --------------- | ------------------------ | -------- | ----------------- |
| id              | uuid                     | NO       | gen_random_uuid() |
| task_id         | uuid                     | NO       |                   |
| name            | text                     | NO       |                   |
| description     | text                     | YES      |                   |
| color           | text                     | YES      |                   |
| icon            | text                     | YES      |                   |
| priority        | USER-DEFINED             | YES      | 'medium'          |
| order           | integer                  | YES      |                   |
| due_at          | timestamp with time zone | YES      |                   |
| printed_count   | integer                  | YES      | 0                 |
| last_printed_at | timestamp with time zone | YES      |                   |
| deleted_at      | timestamp with time zone | YES      |                   |
| created_at      | timestamp with time zone | YES      | now()             |
| user_id         | uuid                     | NO       | auth.uid()        |

**Purpose/Features:**

- Subtasks or checklist items within a task

---

## Table: project_tags

| Column     | Type | Nullable | Default |
| ---------- | ---- | -------- | ------- |
| project_id | uuid | NO       |         |
| tag_id     | uuid | NO       |         |

**Purpose/Features:**

- Many-to-many relationship between projects and tags

---

## Table: projects

| Column      | Type                     | Nullable | Default           |
| ----------- | ------------------------ | -------- | ----------------- |
| id          | uuid                     | NO       | gen_random_uuid() |
| space_id    | uuid                     | NO       |                   |
| name        | text                     | NO       |                   |
| description | text                     | YES      |                   |
| color       | text                     | YES      |                   |
| icon        | text                     | YES      |                   |
| priority    | USER-DEFINED             | YES      | 'medium'          |
| order       | integer                  | YES      |                   |
| due_at      | timestamp with time zone | YES      |                   |
| deleted_at  | timestamp with time zone | YES      |                   |
| created_at  | timestamp with time zone | YES      | now()             |
| user_id     | uuid                     | NO       | auth.uid()        |

**Purpose/Features:**

- Projects within a space, containing tasks

---

## Table: space_members

| Column   | Type | Nullable | Default  |
| -------- | ---- | -------- | -------- |
| space_id | uuid | NO       |          |
| user_id  | uuid | NO       |          |
| role     | text | YES      | 'member' |

**Purpose/Features:**

- Membership and roles for users in spaces

---

## Table: spaces

| Column        | Type                     | Nullable | Default           |
| ------------- | ------------------------ | -------- | ----------------- |
| id            | uuid                     | NO       | gen_random_uuid() |
| owner_user_id | uuid                     | YES      |                   |
| name          | text                     | NO       |                   |
| color         | text                     | YES      |                   |
| icon          | text                     | YES      |                   |
| created_at    | timestamp with time zone | YES      | now()             |
| user_id       | uuid                     | NO       | auth.uid()        |

**Purpose/Features:**

- Top-level grouping for projects (e.g., workspace, team)

---

## Table: tags

| Column | Type | Nullable | Default           |
| ------ | ---- | -------- | ----------------- |
| id     | uuid | NO       | gen_random_uuid() |
| name   | text | NO       |                   |
| color  | text | YES      |                   |

**Purpose/Features:**

- Tagging for tasks, items, projects, etc.

---

## Table: task_tags

| Column  | Type | Nullable | Default |
| ------- | ---- | -------- | ------- |
| task_id | uuid | NO       |         |
| tag_id  | uuid | NO       |         |

**Purpose/Features:**

- Many-to-many relationship between tasks and tags

---

## Table: tasks

| Column          | Type                     | Nullable | Default           |
| --------------- | ------------------------ | -------- | ----------------- |
| id              | uuid                     | NO       | gen_random_uuid() |
| project_id      | uuid                     | NO       |                   |
| name            | text                     | NO       |                   |
| description     | text                     | YES      |                   |
| color           | text                     | YES      |                   |
| icon            | text                     | YES      |                   |
| priority        | USER-DEFINED             | YES      | 'medium'          |
| order           | integer                  | YES      |                   |
| due_at          | timestamp with time zone | YES      |                   |
| printed_count   | integer                  | YES      | 0                 |
| last_printed_at | timestamp with time zone | YES      |                   |
| deleted_at      | timestamp with time zone | YES      |                   |
| created_at      | timestamp with time zone | YES      | now()             |
| user_id         | uuid                     | NO       | auth.uid()        |

**Purpose/Features:**

- Tasks within a project

---

## Table: user_settings

| Column                | Type                     | Nullable | Default |
| --------------------- | ------------------------ | -------- | ------- |
| user_id               | uuid                     | NO       |         |
| default_space_color   | text                     | YES      |         |
| default_project_color | text                     | YES      |         |
| default_task_color    | text                     | YES      |         |
| default_icon          | text                     | YES      |         |
| updated_at            | timestamp with time zone | YES      | now()   |

**Purpose/Features:**

- User preferences for colors, icons, etc.

---

## Table: users

| Column                 | Type                     | Nullable | Default |
| ---------------------- | ------------------------ | -------- | ------- |
| id                     | uuid                     | NO       |         |
| display_name           | text                     | YES      |         |
| created_at             | timestamp with time zone | YES      | now()   |
| max_spaces             | integer                  | YES      | 10      |
| max_projects_per_space | integer                  | YES      | 10      |
| max_tasks_per_project  | integer                  | YES      | 10      |
| max_items_per_task     | integer                  | YES      | 10      |
| user_level             | text                     | YES      | 'user'  |

**Purpose/Features:**

- User accounts, quotas, and roles

---

# Feature/Screen Mapping Template

| Feature/Screen | Tables Used                | Notes/Description                               |
| -------------- | -------------------------- | ----------------------------------------------- |
| Dashboard      | users, spaces, projects    | Overview of user’s workspaces                   |
| Project Detail | projects, tasks, tags      | Project info, tasks, tags                       |
| Task Detail    | tasks, items, comments     | Task info, checklist, comments                  |
| Activity Feed  | activity_log, users        | Recent actions, audit trail, per-entity history |
| Undo/Redo      | activity_log, all entities | Allow users to undo recent edits/adds/deletes   |
| Attachments    | attachments                | File uploads for entities                       |
| Tag Management | tags, task_tags, item_tags | Create/edit tags, assign to items               |
| User Settings  | user_settings, users       | Preferences, quotas                             |
| ...            | ...                        | ...                                             |

---

# Undo/Redo Functionality

- Log all changes (create, update, delete) in `activity_log` with enough detail to reverse them.
- Provide an "Undo" button or menu for users to revert their last few actions (e.g., last 5 edits/adds/deletes).
- For each undoable action, store the previous state in `details` (jsonb) so it can be restored.
- Optionally, support "Redo" for reverted actions.
- Limit undo to actions performed by the current user for safety.

# Auditing/Activity Feed

- Show a timeline of all actions (who, what, when, where) for transparency and accountability.
- Allow filtering by entity, action type, or user.
- Link activity entries to the affected item for quick navigation.

# Recommended Starting Point

- Start with authentication and the dashboard (spaces/projects/tasks panes), as these are the foundation for navigation and user experience.
- Next, scaffold the activity log (auditing) and basic undo logic for a single entity (e.g., tasks), then generalize.
- Add print and settings features after core navigation and data flows are working smoothly.

Fill in or expand as you define your app’s features!
