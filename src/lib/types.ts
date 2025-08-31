// Central TypeScript types for Supabase entities

export interface Space {
  id: string;
  user_id: string;
  name: string;
  color?: string;
  icon?: string;
  created_at: string;
}

// Add other interfaces as needed (Project, Task, Item, etc.)
