<script lang="ts">
import Icon from '@iconify/svelte';
import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
// import { fetchProjects } from '../stores/projects';
import type { Project } from '../types';
import { spaces } from '../stores/spaces';
import { get } from 'svelte/store';
const dispatch = createEventDispatcher();
export let project: Project | null = null;
export let onUpdate: ((project: Project, updates: Partial<Project>) => void) | null = null;
export let onDelete: ((project: Project) => void) | null = null;
export let onAdd: ((spaceId: string, name: string, order?: number, color?: string, icon?: string) => Promise<any> | any) | null = null;

// Theme color palette (add or adjust as needed)
const colorOptions = [
  '', // blank (no color)
  '#34d399', // emerald
  '#60a5fa', // blue
  '#fbbf24', // yellow
  '#f87171', // red
  '#a78bfa', // purple
  '#f472b6', // pink
  '#6b7280', // gray
  '#facc15', // gold
];
// Verified Material Symbols Light icons for projects (see icon-sets.iconify.design)
const iconOptions = [
  '', // blank/none
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

let edit = project ? { ...project } : { name: '', color: '', icon: '', order: 1, priority: null };
$: if (project) edit = { ...project };
let nameInput: HTMLInputElement | null = null;

onMount(() => {
  if (nameInput) nameInput.focus();
});

afterUpdate(() => {
  // Focus name input whenever the project prop changes or form is shown
  if (nameInput) {
    nameInput.focus();
  }
});

function handleSave() {
  if (project && onUpdate) {
    // Only send changed fields
    const updates: Partial<Project> = {};
    if (edit.name !== project.name) updates.name = edit.name;
    if (edit.color !== project.color) updates.color = edit.color;
    if (edit.icon !== project.icon) updates.icon = edit.icon;
    if (edit.order !== project.order) updates.order = edit.order;
    if (edit.priority !== project.priority) updates.priority = edit.priority;
    if (Object.keys(updates).length > 0) onUpdate(project, updates);
    // notify parent for toasts
    dispatch('saved', { project: { ...project, ...updates } });
    // Close panel after save (behavior requested)
    dispatch('close');
  }
}

async function handleAdd() {
  if (!onAdd) return;
  // Use project.space_id if this form was opened for a project, otherwise fallback to first space
  const spaceId = (project && (project as any).space_id) || (get(spaces)[0] && get(spaces)[0].id) || null;
  if (!spaceId) return;
  const created = await onAdd(spaceId, edit.name || '', edit.order, edit.color || '', edit.icon || '');
  if (created) {
    dispatch('created', { project: created });
  }
}
function handleDelete() {
  if (project && onDelete) onDelete(project);
}
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    // Dispatch close event for parent to handle
    dispatch('close');
  }
}
</script>

{#if project}
<form class="flex flex-col gap-4 p-2" on:submit|preventDefault={handleSave} autocomplete="off">
  <div class="form-control">
    <label class="label text-xs font-semibold" for="project-name">Name</label>
    <input bind:this={nameInput} id="project-name" class="input input-sm border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1" type="text" bind:value={edit.name} required />
  </div>
  <div class="form-control">
    <fieldset>
      <legend class="label text-xs font-semibold">Priority</legend>
      <div class="flex gap-2 mt-1" role="radiogroup" aria-labelledby="project-priority-label">
        <button type="button" class="w-6 h-6 rounded-full border-2 flex items-center justify-center {edit.priority == null ? 'border-base-300 ring-2 ring-base-200' : 'border-base-300'}" aria-label="No Priority" aria-checked={edit.priority == null} role="radio" on:click={() => edit.priority = null}>
          <Icon icon="material-symbols-light:stat-0-outline-rounded" width="18" height="18" class="text-base-300" />
        </button>
        <button type="button" class="w-6 h-6 rounded-full border-2 flex items-center justify-center {edit.priority === 'low' ? 'border-green-500 ring-2 ring-green-300' : 'border-base-300'}" aria-label="Low Priority" aria-checked={edit.priority === 'low'} role="radio" on:click={() => edit.priority = 'low'}>
          <Icon icon="material-symbols-light:stat-1" width="18" height="18" class="text-green-500" />
        </button>
        <button type="button" class="w-6 h-6 rounded-full border-2 flex items-center justify-center {edit.priority === 'medium' ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-base-300'}" aria-label="Medium Priority" aria-checked={edit.priority === 'medium'} role="radio" on:click={() => edit.priority = 'medium'}>
          <Icon icon="material-symbols-light:stat-2" width="18" height="18" class="text-yellow-400" />
        </button>
        <button type="button" class="w-6 h-6 rounded-full border-2 flex items-center justify-center {edit.priority === 'high' ? 'border-red-500 ring-2 ring-red-300' : 'border-base-300'}" aria-label="High Priority" aria-checked={edit.priority === 'high'} role="radio" on:click={() => edit.priority = 'high'}>
          <Icon icon="material-symbols-light:stat-3" width="18" height="18" class="text-red-500" />
        </button>
      </div>
    </fieldset>
  </div>
  <div class="form-control">
    <label class="label text-xs font-semibold" for="project-color">Color</label>
    <div class="flex gap-1 flex-wrap mt-1">
      {#each colorOptions as color, i}
        <button
          type="button"
          class="w-7 h-7 rounded-full border-2 flex items-center justify-center {edit.color === color ? 'border-emerald-500 ring-2 ring-emerald-300' : 'border-base-300'}"
          style={color ? `background: ${color}` : 'background: transparent'}
          aria-label={color ? color : 'No color'}
          on:click={() => edit.color = color}
        >
          {#if color === ''}
            <span class="w-4 h-4 block border border-dashed border-base-300 rounded-full"></span>
          {/if}
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
          aria-label={icon ? icon : 'No icon'}
          on:click={() => edit.icon = icon}
        >
          {#if icon === ''}
            <span class="w-5 h-5 block border border-dashed border-base-300 rounded"></span>
          {:else}
            <Icon icon={icon} width="22" height="22" />
          {/if}
        </button>
      {/each}
    </div>
  </div>
  <div class="form-control">
    <label class="label text-xs font-semibold" for="project-order">Order</label>
    <input id="project-order" class="input input-sm border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1 w-20" type="number" min="1" bind:value={edit.order} />
  </div>
  <div class="flex gap-2 mt-4">
    <button class="btn btn-primary btn-sm flex items-center gap-1" type="submit" aria-label="Save">
      <Icon icon="material-symbols-light:save-outline" width="18" height="18" />
      <span class="hidden sm:inline">Save</span>
    </button>
    {#if !project}
      <button class="btn btn-success btn-sm flex items-center gap-1" type="button" aria-label="Add" on:click={handleAdd}>
        <Icon icon="material-symbols-light:add" width="18" height="18" />
        <span class="hidden sm:inline">Add</span>
      </button>
    {/if}
    <button class="btn btn-ghost btn-sm flex items-center gap-1" type="button" aria-label="Cancel" on:click={() => dispatch('close')}>
      <Icon icon="material-symbols-light:close" width="18" height="18" />
      <span class="hidden sm:inline">Cancel</span>
    </button>
    <button class="btn btn-error btn-sm ml-auto flex items-center gap-1" type="button" aria-label="Delete" on:click={handleDelete}>
      <Icon icon="material-symbols-light:delete-outline" width="18" height="18" />
      <span class="hidden sm:inline">Delete</span>
    </button>
  </div>
</form>
  <div class="text-xs text-base-content/60 mt-2">
    <div><b>ID:</b> {project.id}</div>
    <div><b>Space:</b> {spaceName}</div>
    <div><b>Created:</b> {project.created_at}</div>
  </div>
{/if}
