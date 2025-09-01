import { writable } from 'svelte/store';
import { supabase } from '../supabaseClient';
import type { Item } from '../types';

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

export async function addTaskItem(taskId: string, name: string, order?: number, description?: string, status?: string, priority?: string) {
  if (!taskId || !name.trim()) return;
  const { error } = await supabase
    .from('items')
    .insert([{ task_id: taskId, name: name.trim(), order, description, status, priority }]);
  if (!error) {
    fetchTaskItems(taskId);
  } else {
    taskItemsError.set(error.message);
  }
}

export async function updateTaskItem(item: Item, updates: Partial<Item>) {
  const { error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', item.id);
  if (!error) {
    fetchTaskItems(item.task_id);
  } else {
    taskItemsError.set(error.message);
  }
}

export async function deleteTaskItem(item: Item) {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', item.id);
  if (!error) {
    fetchTaskItems(item.task_id);
  } else {
    taskItemsError.set(error.message);
  }
}
