import { writable } from 'svelte/store';
import { supabase } from '../supabaseClient';

export const taskItems = writable([]);
export const taskItemsLoading = writable(false);
export const taskItemsError = writable('');

export async function fetchTaskItems(taskId: string) {
  console.log('[Atlas] fetchTaskItems called with taskId:', taskId);
  taskItemsLoading.set(true);
  taskItemsError.set('');
  if (!taskId) {
    console.log('[Atlas] fetchTaskItems: no taskId, clearing taskItems');
    taskItems.set([]);
    taskItemsLoading.set(false);
    return;
  }
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('task_id', taskId)
    .order('order', { ascending: true })
    .order('name', { ascending: true });
  if (error) {
    console.log('[Atlas] fetchTaskItems error:', error.message);
    taskItemsError.set(error.message);
    taskItems.set([]);
  } else {
    let arr = (data || []).slice();
    arr.sort((a, b) => {
      if (a.order == null && b.order == null) return a.name.localeCompare(b.name);
      if (a.order == null) return 1;
      if (b.order == null) return -1;
      if (a.order === b.order) return a.name.localeCompare(b.name);
      return a.order - b.order;
    });
    taskItems.set(arr);
  }
  taskItemsLoading.set(false);
}
