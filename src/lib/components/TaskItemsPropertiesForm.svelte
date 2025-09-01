<script lang="ts">
import Icon from '@iconify/svelte';
import type { Item as TaskItem } from '../types';
export let onUpdate: ((item: TaskItem, updates: Partial<TaskItem>) => void) | null = null;
export let onDelete: ((item: TaskItem) => void) | null = null;
export let onAdd: ((name: string) => void) | null = null;
export let items: TaskItem[] = [];

let newItemName = '';
let localOrder: Record<string, string> = {};

function handleUpdate(item: TaskItem, updates: Partial<TaskItem>) {
  if (onUpdate) onUpdate(item, updates);
}
function handleDelete(item: TaskItem) {
  if (onDelete) onDelete(item);
}
function handleAdd() {
  if (newItemName.trim() && onAdd) {
    onAdd(newItemName.trim());
    newItemName = '';
  }
}

$: {
  for (const item of items) {
    localOrder[item.id] =
      item.order === undefined || item.order === null ? '' : String(item.order);
  }
}
</script>

<ul class="flex flex-col gap-2 mb-4">
  {#each items as item (item.id)}
    <li class="flex items-center gap-2">
      <form class="flex-1 flex gap-2 items-center" on:submit|preventDefault={() => handleUpdate(item, { name: item.name, order: localOrder[item.id] ? Number(localOrder[item.id]) : undefined })}>
        <input
          class="input input-sm flex-1 border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1"
          type="text"
          bind:value={item.name}
          aria-label="Edit item name"
          on:keydown={(e) => {
            const input = e.target as HTMLInputElement;
            if (e.key === 'Enter' && input.form) input.form.requestSubmit();
          }}
        />
        <input
          class="input input-xs w-16 text-center"
          type="text"
          inputmode="numeric"
          pattern="[1-9][0-9]*"
          bind:value={localOrder[item.id]}
          aria-label="Order"
          list={`order-options-${item.id}`}
          on:input={(e) => {
            const val = (e.target as HTMLInputElement).value;
            localOrder[item.id] = val;
          }}
          on:blur={() => {
            const val = localOrder[item.id];
            if (val === '' || val === null) {
              handleUpdate(item, { order: undefined });
            } else {
              const num = Number(val);
              if (!isNaN(num) && num >= 1 && num <= items.length) handleUpdate(item, { order: num });
            }
          }}
          style="width:3.5rem;"
        />
        <datalist id={`order-options-${item.id}`}>
          {#each Array(items.length) as _, i}
            <option value={i + 1}></option>
          {/each}
        </datalist>
        <button class="btn btn-xs btn-error ml-2 flex items-center gap-1" type="button" aria-label="Delete item" on:click={() => handleDelete(item)}>
          <Icon icon="material-symbols-light:delete-outline" width="16" height="16" />
        </button>
      </form>
    </li>
  {/each}
  <li class="flex items-center gap-2 mt-2">
    <input
      class="input input-sm flex-1 border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1"
      type="text"
      bind:value={newItemName}
      placeholder="Add new item..."
      aria-label="Add new item"
      on:keydown={(e) => {
        if (e.key === 'Enter') handleAdd();
      }}
    />
    <button class="btn btn-xs btn-primary ml-2 flex items-center gap-1" type="button" aria-label="Add item" on:click={handleAdd}>
      <Icon icon="material-symbols-light:add" width="16" height="16" />
      <span class="hidden sm:inline">Add</span>
    </button>
  </li>
</ul>
