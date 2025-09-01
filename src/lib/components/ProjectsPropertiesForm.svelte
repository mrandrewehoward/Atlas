<script lang="ts">
// import { fetchProjects } from '../stores/projects';
import type { Project } from '../types';
import { spaces } from '../stores/spaces';
import { get } from 'svelte/store';
export let project: Project | null = null;
export let onUpdate: ((project: Project, updates: Partial<Project>) => void) | null = null;
export let onDelete: ((project: Project) => void) | null = null;

// Theme color palette (add or adjust as needed)
const colorOptions = [
  '#34d399', // emerald
  '#60a5fa', // blue
  '#fbbf24', // yellow
  '#f87171', // red
  '#a78bfa', // purple
  '#f472b6', // pink
  '#6b7280', // gray
  '#facc15', // gold
];
import Icon from '@iconify/svelte';
// Verified Material Symbols Light icons for projects (see icon-sets.iconify.design)
const iconOptions = [
  'material-symbols-light:folder-outline',
  'material-symbols-light:work-outline',
  'material-symbols-light:lightbulb-outline',
  'material-symbols-light:rocket-launch-outline',
  'material-symbols-light:star-outline',
  'material-symbols-light:bookmark-outline',
  'material-symbols-light:dashboard-outline',
  'material-symbols-light:list-alt-outline',
  'material-symbols-light:settings-outline',
  'material-symbols-light:extension-outline',
];

// Get the parent space name
$: spaceName = project ? (get(spaces).find(s => s.id === project.space_id)?.name ?? project.space_id) : '';

let edit = project ? { ...project } : null;
$: if (project) edit = { ...project };

function handleSave() {
  if (project && onUpdate) {
    // Only send changed fields
    const updates: Partial<Project> = {};
    if (edit.name !== project.name) updates.name = edit.name;
    if (edit.color !== project.color) updates.color = edit.color;
    if (edit.icon !== project.icon) updates.icon = edit.icon;
    if (edit.order !== project.order) updates.order = edit.order;
    if (Object.keys(updates).length > 0) onUpdate(project, updates);
  }
}
function handleDelete() {
  if (project && onDelete) onDelete(project);
}
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    // Dispatch close event for parent to handle
    const event = new CustomEvent('close', { bubbles: true });
    dispatchEvent(event);
  }
}
</script>

{#if project}
<form class="flex flex-col gap-4 p-2" on:submit|preventDefault={handleSave} autocomplete="off">
  <div class="form-control">
    <label class="label text-xs font-semibold" for="project-name">Name</label>
    <input id="project-name" class="input input-sm border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1" type="text" bind:value={edit.name} required />
  </div>
  <div class="form-control">
    <label class="label text-xs font-semibold" for="project-color">Color</label>
    <div class="flex gap-1 flex-wrap mt-1">
      {#each colorOptions as color}
        <button
          type="button"
          class="w-7 h-7 rounded-full border-2 flex items-center justify-center {edit.color === color ? 'border-emerald-500 ring-2 ring-emerald-300' : 'border-base-300'}"
          style="background: {color}"
          aria-label={color}
          on:click={() => edit.color = color}
        >
          {edit.color === color ? '✓' : ''}
        </button>
      {/each}
    </div>
  </div>
  <div class="form-control">
    <label class="label text-xs font-semibold" for="project-icon">Icon</label>
    <div class="flex gap-1 flex-wrap mt-1">
      {#each iconOptions as icon}
        <button
          type="button"
          class="w-8 h-8 rounded border-2 flex items-center justify-center {edit.icon === icon ? 'border-emerald-500 ring-2 ring-emerald-300' : 'border-base-300'}"
          aria-label={icon}
          on:click={() => edit.icon = icon}
        >
          <Icon icon={icon} width="22" height="22" />
        </button>
      {/each}
    </div>
  </div>
  <div class="form-control">
    <label class="label text-xs font-semibold" for="project-order">Order</label>
    <input id="project-order" class="input input-sm border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1 w-20" type="number" min="1" bind:value={edit.order} />
  </div>
  <div class="flex gap-2 mt-4">
    <button class="btn btn-primary btn-sm" type="submit">Save</button>
    <button class="btn btn-ghost btn-sm" type="button" on:click={() => dispatchEvent(new CustomEvent('close', { bubbles: true }))}>Cancel</button>
    <button class="btn btn-error btn-sm ml-auto" type="button" on:click={handleDelete}>Delete</button>
  </div>
</form>
  <div class="text-xs text-base-content/60 mt-2">
    <div><b>ID:</b> {project.id}</div>
    <div><b>Space:</b> {spaceName}</div>
    <div><b>Created:</b> {project.created_at}</div>
  </div>
{/if}
