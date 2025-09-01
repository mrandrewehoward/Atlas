<script lang="ts">
import { spaces, fetchSpaces } from '../stores/spaces';
import { supabase } from '../supabaseClient';
import { toastStore } from '../stores/toast';
import type { Space } from '../types';
import { onDestroy } from 'svelte';
import { get } from 'svelte/store';

export let onUpdate: ((space: Space, updates: Partial<Space>) => void) | null = null;
export let onDelete: ((space: Space) => void) | null = null;
export let onAdd: ((name: string) => void) | null = null;

let newSpaceName = '';

function handleUpdate(space: Space, updates: Partial<Space>) {
  if (onUpdate) onUpdate(space, updates);
}
function handleDelete(space: Space) {
  if (onDelete) onDelete(space);
}
function handleAdd() {
  if (newSpaceName.trim() && onAdd) {
    onAdd(newSpaceName.trim());
    newSpaceName = '';
  }
}

// Local order state for each space
let localOrder: Record<string, string> = {};

$: {
  for (const space of get(spaces)) {
    localOrder[space.id] =
      space.order === undefined || space.order === null ? '' : String(space.order);
  }
}

onDestroy(() => {
  localOrder = {};
});
</script>

<ul class="flex flex-col gap-2 mb-4">
  {#each $spaces as space (space.id)}
    <li class="flex items-center gap-2">
      <form class="flex-1 flex gap-2 items-center" on:submit|preventDefault={() => handleUpdate(space, { name: space.name, order: localOrder[space.id] ? Number(localOrder[space.id]) : undefined })}>
        <input
          class="input input-sm flex-1 border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1"
          type="text"
          bind:value={space.name}
          aria-label="Edit space name"
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
          bind:value={localOrder[space.id]}
          aria-label="Order"
          list={`order-options-${space.id}`}
          on:input={(e) => {
            const val = (e.target as HTMLInputElement).value;
            localOrder[space.id] = val;
          }}
          on:blur={() => {
            const val = localOrder[space.id];
            if (val === '' || val === null) {
              handleUpdate(space, { order: undefined });
            } else {
              const num = Number(val);
              if (!isNaN(num) && num >= 1 && num <= $spaces.length) handleUpdate(space, { order: num });
            }
          }}
          style="width:3.5rem;"
        />
        <datalist id={`order-options-${space.id}`}>
          {#each Array($spaces.length) as _, i}
            <option value={i+1}>{i+1}</option>
          {/each}
        </datalist>
        <span class="text-xs text-base-content/50">/ {$spaces.length}</span>
        <button type="button" class="btn btn-xs btn-ghost text-error ml-1" aria-label="Delete space" title="Delete space" on:click={() => handleDelete(space)}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </form>
    </li>
  {/each}
</ul>
<form class="flex gap-2" on:submit|preventDefault={handleAdd}>
  <input class="input input-sm flex-1 border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1" type="text" bind:value={newSpaceName} placeholder="New space name" aria-label="New space name" />
  <button class="btn btn-sm btn-success" type="submit">Add</button>
</form>
