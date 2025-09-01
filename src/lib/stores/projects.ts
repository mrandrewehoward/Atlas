import { writable } from 'svelte/store';
import { supabase } from '../supabaseClient';
import type { Project } from '../types';

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
    .order('order', { ascending: true })
    .order('name', { ascending: true });
  if (error) {
    projectsError.set(error.message);
    projects.set([]);
  } else {
    // Sort: order (nulls last), then alpha by name
    let arr = (data || []).slice();
    arr.sort((a, b) => {
      if (a.order == null && b.order == null) return a.name.localeCompare(b.name);
      if (a.order == null) return 1;
      if (b.order == null) return -1;
      if (a.order === b.order) return a.name.localeCompare(b.name);
      return a.order - b.order;
    });
    projects.set(arr);
  }
  projectsLoading.set(false);
}

export async function addProject(spaceId: string, name: string, order?: number, color?: string, icon?: string) {
  if (!spaceId || !name.trim()) return;
  const { error } = await supabase
    .from('projects')
    .insert([{ space_id: spaceId, name: name.trim(), order, color, icon }]);
  if (!error) {
    fetchProjects(spaceId);
  } else {
    projectsError.set(error.message);
  }
}

export async function updateProject(project: Project, updates: Partial<Project>) {
  const { error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', project.id);
  if (!error) {
    fetchProjects(project.space_id);
  } else {
    projectsError.set(error.message);
  }
}

export async function deleteProject(project: Project) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', project.id);
  if (!error) {
    fetchProjects(project.space_id);
  } else {
    projectsError.set(error.message);
  }
}
