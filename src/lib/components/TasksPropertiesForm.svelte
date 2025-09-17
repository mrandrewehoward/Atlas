<script lang="ts">
import Icon from '@iconify/svelte';
import type { Task } from '../types';
import { get } from 'svelte/store';
export let onUpdate: ((task: Task, updates: Partial<Task>) => void) | null = null;
export let onDelete: ((task: Task) => void) | null = null;
export let onAdd: ((name: string) => void) | null = null;
export let tasks: Task[] = [];

const colorOptions = [
  '', '#34d399', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#6b7280', '#facc15',
];
const iconOptions = [
  '', // blank/none
  'material-symbols-light:check-circle-outline',
  'material-symbols-light:task-outline',
  'material-symbols-light:flag-outline',
  'material-symbols-light:star-outline',
  'material-symbols-light:bookmark-outline',
  'material-symbols-light:alarm-outline',
  'material-symbols-light:calendar-today-outline',
  'material-symbols-light:bolt-outline',
  'material-symbols-light:settings-outline',
  'material-symbols-light:extension-outline',
];

let newTaskName = '';
let localEdit: Record<string, any> = {};
let showQuickAdd = false;
let quickAddName = '';

$: {
  for (const task of tasks) {
    if (!localEdit[task.id]) localEdit[task.id] = { ...task };
  }
}

function handleUpdate(task: Task) {
  if (onUpdate) {
    const orig = task;
    const edit = localEdit[task.id];
    const updates: Partial<Task> = {};
    if (edit.name !== orig.name) updates.name = edit.name;
    if (edit.color !== orig.color) updates.color = edit.color;
    if (edit.icon !== orig.icon) updates.icon = edit.icon;
    if (edit.order !== orig.order) updates.order = edit.order;
    if (edit.priority !== orig.priority) updates.priority = edit.priority;
    if (edit.status !== orig.status) updates.status = edit.status;
    if (Object.keys(updates).length > 0) onUpdate(orig, updates);
  }
}
function handleDelete(task: Task) {
  if (onDelete) onDelete(task);
}
function handleAdd() {
  if (newTaskName.trim() && onAdd) {
    onAdd(newTaskName.trim());
    newTaskName = '';
  }
}
</script>

<form class="flex flex-col gap-4 p-2" autocomplete="off">
  {#each tasks as task (task.id)}
    <div class="border-b border-base-200 pb-2 mb-2">
      <div class="form-control mb-2">
        <label class="label text-xs font-semibold" for={`task-name-${task.id}`}>Name</label>
        <input id={`task-name-${task.id}`} class="input input-sm border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1" type="text" bind:value={localEdit[task.id].name} required />
      </div>
      <div class="form-control mb-2">
        <fieldset>
          <legend class="label text-xs font-semibold">Priority</legend>
          <div class="flex gap-2 mt-1" role="radiogroup" aria-labelledby={`task-priority-label-${task.id}`}> 
            <button type="button" class="w-6 h-6 rounded-full border-2 flex items-center justify-center {localEdit[task.id].priority == null ? 'border-base-300 ring-2 ring-base-200' : 'border-base-300'}" aria-label="No Priority" aria-checked={localEdit[task.id].priority == null} role="radio" on:click={() => localEdit[task.id].priority = null}>
              <Icon icon="material-symbols-light:stat-0-outline-rounded" width="18" height="18" class="text-base-300" />
            </button>
            <button type="button" class="w-6 h-6 rounded-full border-2 flex items-center justify-center {localEdit[task.id].priority === 'low' ? 'border-green-500 ring-2 ring-green-300' : 'border-base-300'}" aria-label="Low Priority" aria-checked={localEdit[task.id].priority === 'low'} role="radio" on:click={() => localEdit[task.id].priority = 'low'}>
              <Icon icon="material-symbols-light:stat-1" width="18" height="18" class="text-green-500" />
            </button>
            <button type="button" class="w-6 h-6 rounded-full border-2 flex items-center justify-center {localEdit[task.id].priority === 'medium' ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-base-300'}" aria-label="Medium Priority" aria-checked={localEdit[task.id].priority === 'medium'} role="radio" on:click={() => localEdit[task.id].priority = 'medium'}>
              <Icon icon="material-symbols-light:stat-2" width="18" height="18" class="text-yellow-400" />
            </button>
            <button type="button" class="w-6 h-6 rounded-full border-2 flex items-center justify-center {localEdit[task.id].priority === 'high' ? 'border-red-500 ring-2 ring-red-300' : 'border-base-300'}" aria-label="High Priority" aria-checked={localEdit[task.id].priority === 'high'} role="radio" on:click={() => localEdit[task.id].priority = 'high'}>
              <Icon icon="material-symbols-light:stat-3" width="18" height="18" class="text-red-500" />
            </button>
          </div>
        </fieldset>
      </div>
      <div class="form-control mb-2">
        <label class="label text-xs font-semibold" for={`task-color-${task.id}`}>Color</label>
        <div class="flex gap-1 flex-wrap mt-1">
          {#each colorOptions as color, i}
            <button
              type="button"
              class="w-7 h-7 rounded-full border-2 flex items-center justify-center {localEdit[task.id].color === color ? 'border-emerald-500 ring-2 ring-emerald-300' : 'border-base-300'}"
              style={color ? `background: ${color}` : 'background: transparent'}
              aria-label={color ? color : 'No color'}
              on:click={() => localEdit[task.id].color = color}
            >
              {#if color === ''}
                <span class="w-4 h-4 block border border-dashed border-base-300 rounded-full"></span>
              {/if}
              {localEdit[task.id].color === color ? '✓' : ''}
            </button>
          {/each}
        </div>
      </div>
      <div class="form-control mb-2">
        <label class="label text-xs font-semibold" for={`task-icon-${task.id}`}>Icon</label>
        <div class="flex gap-1 flex-wrap mt-1">
          {#each iconOptions as icon}
            <button
              type="button"
              class="w-8 h-8 rounded border-2 flex items-center justify-center {localEdit[task.id].icon === icon ? 'border-emerald-500 ring-2 ring-emerald-300' : 'border-base-300'}"
              aria-label={icon ? icon : 'No icon'}
              on:click={() => localEdit[task.id].icon = icon}
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
      <div class="form-control mb-2">
        <label class="label text-xs font-semibold" for={`task-order-${task.id}`}>Order</label>
        <input id={`task-order-${task.id}`} class="input input-sm border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1 w-20" type="number" min="1" bind:value={localEdit[task.id].order} />
      </div>
      <div class="form-control mb-2">
        <label class="label text-xs font-semibold" for={`task-status-${task.id}`}>Status</label>
        <input id={`task-status-${task.id}`} class="input input-sm border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1" type="text" bind:value={localEdit[task.id].status} />
      </div>
      <div class="flex gap-2 mt-2">
        <button class="btn btn-primary btn-xs flex items-center gap-1" type="button" aria-label="Save" on:click={() => handleUpdate(task)}>
          <Icon icon="material-symbols-light:save-outline" width="18" height="18" />
          <span class="hidden sm:inline">Save</span>
        </button>
        <button class="btn btn-error btn-xs ml-auto flex items-center gap-1" type="button" aria-label="Delete" on:click={() => handleDelete(task)}>
          <Icon icon="material-symbols-light:delete-outline" width="18" height="18" />
          <span class="hidden sm:inline">Delete</span>
        </button>
      </div>
      <div class="text-xs text-base-content/60 mt-2">
        <div><b>ID:</b> {task.id}</div>
        <div><b>Project:</b> {task.project_id}</div>
        <div><b>Created:</b> {task.created_at}</div>
      </div>
    </div>
  {/each}

  {#if tasks.length > 0}
    <!-- Compact quick-add when editing a task (small button that reveals an inline input) -->
    <div class="mt-2">
      {#if !showQuickAdd}
        <button class="btn btn-xs btn-outline" type="button" on:click={() => { showQuickAdd = true; setTimeout(() => { const el = document.getElementById('quick-add-task'); if (el) (el as HTMLInputElement).focus(); }, 0); }} aria-label="Add task">+ Add task</button>
      {:else}
        <div class="flex gap-2 items-center">
          <input id="quick-add-task" class="input input-xs flex-1" type="text" bind:value={quickAddName} placeholder="New task name" on:keydown={(e) => { if (e.key === 'Enter') { if (quickAddName.trim()) { onAdd && onAdd(quickAddName.trim()); quickAddName = ''; showQuickAdd = false; } } if (e.key === 'Escape') { showQuickAdd = false; quickAddName = ''; } }} />
          <button class="btn btn-xs btn-primary" type="button" on:click={() => { if (quickAddName.trim()) { onAdd && onAdd(quickAddName.trim()); quickAddName = ''; showQuickAdd = false; } }} aria-label="Confirm add">Add</button>
          <button class="btn btn-xs btn-ghost" type="button" on:click={() => { showQuickAdd = false; quickAddName = ''; }} aria-label="Cancel add">Cancel</button>
        </div>
      {/if}
    </div>
  {/if}
  {#if tasks.length === 0}
    <div class="form-control mt-4">
      <label class="label text-xs font-semibold" for="new-task-name">Add New Task</label>
      <div class="flex gap-2">
        <input
          id="new-task-name"
          class="input input-sm flex-1 border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1"
          type="text"
          bind:value={newTaskName}
          placeholder="Add new task..."
          aria-label="Add new task"
          on:keydown={(e) => { if (e.key === 'Enter') handleAdd(); }}
        />
        <button class="btn btn-xs btn-primary flex items-center gap-1" type="button" aria-label="Add task" on:click={handleAdd}>
          <Icon icon="material-symbols-light:add" width="16" height="16" />
          <span class="hidden sm:inline">Add</span>
        </button>
      </div>
    </div>
  {/if}
</form>
