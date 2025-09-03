// Central TypeScript types for Supabase entities

export interface Space {
  id: string;
  user_id: string;
  name: string;
  color?: string;
  icon?: string;
  created_at: string;
  order?: number;
}

export interface Project {
  id: string;
  space_id: string;
  name: string;
  color?: string;
  icon?: string;
  priority?: 'low' | 'medium' | 'high' | null;
  created_at: string;
  order?: number;
}

export interface Task {
  id: string;
  project_id: string;
  name: string;
  icon?: string;
  color?: string;
  priority?: 'low' | 'medium' | 'high' | null;
  description?: string;
  status?: string;
  created_at: string;
  order?: number;
}

export interface Item {
  id: string;
  task_id: string;
  name: string;
  description?: string;
  status?: string;
  priority?: 'low' | 'medium' | 'high' | null;
  created_at: string;
  order?: number;
}

// Add other interfaces as needed (Project, Task, Item, etc.)
