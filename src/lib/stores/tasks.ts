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
    .order('order', { ascending: true })
    .order('name', { ascending: true });
  if (error) {
    console.log('[Atlas] fetchTasks error:', error.message);
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
