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
  console.log('fetchSpaces result:', { data, error });
  if (error) {
    spacesError.set(error.message);
    spaces.set([]);
  } else {
    spaces.set(data || []);
  }
  spacesLoading.set(false);
}
