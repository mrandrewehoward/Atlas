-- Add 'order' column to spaces
ALTER TABLE spaces ADD COLUMN "order" integer;

-- Add 'order' column to projects
ALTER TABLE projects ADD COLUMN "order" integer;

-- Add 'order' column to tasks
ALTER TABLE tasks ADD COLUMN "order" integer;

-- Add 'order' column to items
ALTER TABLE items ADD COLUMN "order" integer;
