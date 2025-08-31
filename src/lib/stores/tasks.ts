import { writable } from 'svelte/store';
import { supabase } from '../supabaseClient';

export const tasks = writable([]);
export const tasksLoading = writable(false);
export const tasksError = writable('');

export async function fetchTasks(projectId: string) {
  console.log('[Atlas] fetchTasks called with projectId:', projectId);
  tasksLoading.set(true);
  tasksError.set('');
  if (!projectId) {
    console.log('[Atlas] fetchTasks: no projectId, clearing tasks');
    tasks.set([]);
    tasksLoading.set(false);
    return;
  }
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });
  if (error) {
    console.log('[Atlas] fetchTasks error:', error.message);
    tasksError.set(error.message);
    tasks.set([]);
  } else {
    console.log('[Atlas] fetchTasks result:', data);
    tasks.set(data || []);
  }
  tasksLoading.set(false);
}
