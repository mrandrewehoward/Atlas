import { writable } from 'svelte/store';
import type { Space } from '../types';
import { supabase } from '../supabaseClient';

export const spaces = writable<Space[]>([]);
export const spacesLoading = writable<boolean>(false);
export const spacesError = writable<string | null>(null);

export async function fetchSpaces() {
  spacesLoading.set(true);
  spacesError.set(null);
  const { data, error } = await supabase
    .from('spaces')
    .select('*')
  .order('order', { ascending: true })
    .order('name', { ascending: true });
  // ...removed debug logging...
  if (error) {
    spacesError.set(error.message);
    spaces.set([]);
  } else {
    spaces.set(data || []);
  }
  spacesLoading.set(false);
}

export async function addSpace(name: string) {
  if (!name.trim()) return;
  const { error } = await supabase
    .from('spaces')
    .insert([{ name: name.trim() }]);
  if (!error) {
    fetchSpaces();
  } else {
  // ...removed error logging...
  }
}

export async function deleteSpace(space: Space) {
  const { error } = await supabase
    .from('spaces')
    .delete()
    .eq('id', space.id);
  if (!error) {
    fetchSpaces();
  } else {
  // ...removed error logging...
  }
}

export async function updateSpace(space: Space, updates: Partial<Space>) {
  const { error } = await supabase
    .from('spaces')
    .update(updates)
    .eq('id', space.id);
  if (!error) {
    fetchSpaces();
  } else {
  // ...removed error logging...
  }
}
