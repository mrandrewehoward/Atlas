<script lang="ts">
import type { Item as TaskItem } from '../types';
import Icon from '@iconify/svelte';
export let onUpdate: ((item: TaskItem, updates: Partial<TaskItem>) => void) | null = null;
export let onDelete: ((item: TaskItem) => void) | null = null;
export let item: TaskItem | null = null;

let localOrder: string = item && item.order !== undefined && item.order !== null ? String(item.order) : '';

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
</form>
{:else}
<div class="text-base-content/60 italic">No task item selected.</div>
{/if}
