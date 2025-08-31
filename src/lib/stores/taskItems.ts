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
    .order('created_at', { ascending: true });
  if (error) {
    console.log('[Atlas] fetchTaskItems error:', error.message);
    taskItemsError.set(error.message);
    taskItems.set([]);
  } else {
    console.log('[Atlas] fetchTaskItems result:', data);
    taskItems.set(data || []);
  }
  taskItemsLoading.set(false);
}
