<script lang="ts">
import type { Item as TaskItem } from '../types';
import Icon from '@iconify/svelte';
export let onUpdate: ((item: TaskItem, updates: Partial<TaskItem>) => void) | null = null;
export let onDelete: ((item: TaskItem) => void) | null = null;
export let item: TaskItem | null = null;
export let onAdd: ((name: string) => void) | null = null;

let localOrder: string = item && item.order !== undefined && item.order !== null ? String(item.order) : '';
let showQuickAdd = false;
let quickAddName = '';

function handleUpdate(updates: Partial<TaskItem>) {
  if (item && onUpdate) onUpdate(item, updates);
}
function handleDelete() {
  if (item && onDelete) onDelete(item);
}
</script>


{#if item}
<form class="flex flex-col gap-4" on:submit|preventDefault={() => handleUpdate({
  name: item.name,
  description: item.description,
  status: item.status,
  priority: item.priority,
  order: localOrder ? Number(localOrder) : undefined
})} aria-label="Task Item Properties Form">
  <div class="flex flex-col">
    <label class="text-xs font-semibold mb-1" for="item-name">Name</label>
    <input
      id="item-name"
      class="input input-sm border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1"
      type="text"
      bind:value={item.name}
      aria-label="Edit item name"
      required
    />
  </div>
  <div class="flex flex-col">
    <label class="text-xs font-semibold mb-1" for="item-description">Description</label>
    <textarea
      id="item-description"
      class="textarea textarea-sm border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1"
      bind:value={item.description}
      aria-label="Edit item description"
      rows="2"
    ></textarea>
  </div>
  <div class="flex flex-row gap-4">
    <div class="flex flex-col w-32">
      <label class="text-xs font-semibold mb-1" for="item-order">Order</label>
      <input
        id="item-order"
        class="input input-xs w-16 text-center"
        type="number"
        min="1"
        bind:value={localOrder}
        aria-label="Order"
        style="width:3.5rem;"
      />
    </div>
    <div class="flex flex-col w-32">
      <label class="text-xs font-semibold mb-1" for="item-status">Status</label>
      <select
        id="item-status"
        class="select select-xs"
        bind:value={item.status}
        aria-label="Edit item status"
      >
        <option value="">--</option>
        <option value="open">Open</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
    <div class="flex flex-col w-32">
      <label class="text-xs font-semibold mb-1" for="item-priority">Priority</label>
      <select
        id="item-priority"
        class="select select-xs"
        bind:value={item.priority}
        aria-label="Edit item priority"
      >
        <option value="">--</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  </div>
  <div class="flex flex-row gap-2 mt-2">
    <button class="btn btn-sm btn-primary" type="submit" aria-label="Save changes">Save</button>
    <button class="btn btn-sm btn-error" type="button" aria-label="Delete item" on:click={handleDelete}>
      <Icon icon="material-symbols-light:delete-outline" width="16" height="16" />
      Delete
    </button>
  </div>
  <!-- Compact quick-add for items (useful when editing/inspecting items) -->
  <div class="mt-3">
    {#if !showQuickAdd}
      <button class="btn btn-xs btn-outline" type="button" on:click={() => { showQuickAdd = true; setTimeout(() => { const el = document.getElementById('quick-add-item'); if (el) (el as HTMLInputElement).focus(); }, 0); }} aria-label="Add item">+ Add item</button>
    {:else}
      <div class="flex gap-2 items-center">
        <input id="quick-add-item" class="input input-xs" type="text" bind:value={quickAddName} placeholder="New item name" on:keydown={(e) => { if (e.key === 'Enter') { if (quickAddName.trim() && onAdd) { onAdd(quickAddName.trim()); quickAddName = ''; showQuickAdd = false; } } if (e.key === 'Escape') { showQuickAdd = false; quickAddName = ''; } }} />
        <button class="btn btn-xs btn-primary" type="button" on:click={() => { if (quickAddName.trim() && onAdd) { onAdd(quickAddName.trim()); quickAddName = ''; showQuickAdd = false; } }} aria-label="Confirm add">Add</button>
        <button class="btn btn-xs btn-ghost" type="button" on:click={() => { showQuickAdd = false; quickAddName = ''; }} aria-label="Cancel add">Cancel</button>
      </div>
    {/if}
  </div>
</form>
{:else}
<div class="text-base-content/60 italic">No task item selected.</div>
{/if}
