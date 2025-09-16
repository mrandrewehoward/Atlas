// Shared entity types used for printing
export interface BaseEntity {
  id?: string | number;
  name?: string;
  title?: string;
  description?: string;
  created_at?: string;
  created?: string;
  createdAt?: string;
  priority?: 'low' | 'medium' | 'high' | number | string;
  due_at?: string;
  due?: string;
  tags?: string[] | string;
  printed_count?: number;
  type?: 'project' | 'task' | 'item';
}

export interface ProjectEntity extends BaseEntity {
  project_id?: string;
  projectName?: string;
}

export interface TaskEntity extends BaseEntity {
  task_id?: string;
  project_id?: string;
  taskName?: string;
}

export interface ItemEntity extends BaseEntity {
  task_id?: string;
  item_id?: string;
}

export type PrintEntity = ProjectEntity | TaskEntity | ItemEntity;
