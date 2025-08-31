import { writable } from 'svelte/store';
import { supabase } from '../supabaseClient';

export const projects = writable([]);
export const projectsLoading = writable(false);
export const projectsError = writable('');

export async function fetchProjects(spaceId: string) {
  projectsLoading.set(true);
  projectsError.set('');
  if (!spaceId) {
    projects.set([]);
    projectsLoading.set(false);
    return;
  }
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('space_id', spaceId)
    .order('created_at', { ascending: true });
  if (error) {
    projectsError.set(error.message);
    projects.set([]);
  } else {
    projects.set(data || []);
  }
  projectsLoading.set(false);
}
