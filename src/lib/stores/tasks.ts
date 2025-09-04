import { writable } from 'svelte/store';
import { supabase } from '../supabaseClient';
import type { Task } from '../types';

export const tasks = writable([]);
export const tasksLoading = writable(false);
export const tasksError = writable('');

export async function fetchTasks(projectId: string) {
  // ...removed debug logging...
  tasksLoading.set(true);
  tasksError.set('');
  if (!projectId) {
  // ...removed debug logging...
    tasks.set([]);
    tasksLoading.set(false);
    return;
  }
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('order', { ascending: true })
    .order('name', { ascending: true });
  if (error) {
  // ...removed error logging...
    tasksError.set(error.message);
    tasks.set([]);
  } else {
    let arr = (data || []).slice();
    arr.sort((a, b) => {
      if (a.order == null && b.order == null) return a.name.localeCompare(b.name);
      if (a.order == null) return 1;
      if (b.order == null) return -1;
      if (a.order === b.order) return a.name.localeCompare(b.name);
      return a.order - b.order;
    });
    tasks.set(arr);
  }
  tasksLoading.set(false);
}

export async function addTask(projectId: string, name: string, order?: number, description?: string, status?: string) {
  if (!projectId || !name.trim()) return;
  const { error } = await supabase
    .from('tasks')
    .insert([{ project_id: projectId, name: name.trim(), order, description, status }]);
  if (!error) {
    fetchTasks(projectId);
  } else {
    tasksError.set(error.message);
  }
}

export async function updateTask(task: Task, updates: Partial<Task>) {
  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', task.id);
  if (!error) {
    fetchTasks(task.project_id);
  } else {
    tasksError.set(error.message);
  }
}

export async function deleteTask(task: Task) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', task.id);
  if (!error) {
    fetchTasks(task.project_id);
  } else {
    tasksError.set(error.message);
  }
}
