
<script lang="ts">
  export let items: Array<{ id: number|string; name: string; description?: string; created_at?: string; priority?: string; status?: string }> = [];
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  export let onDelete: (id: number|string) => void = () => {};
  export let onToggle: (id: number|string) => void = () => {};
  export let loading: boolean = false;
  export let error: string = '';
  let expandedId: number|string|null = null;
  function toggleExpand(id: number|string) {
    expandedId = expandedId === id ? null : id;
  }
</script>

<section class="flex flex-col h-full bg-base-100 border border-base-100">
  <div class="flex items-center px-3 h-9 border-b border-base-300 bg-base-200 font-semibold text-base-content text-xs tracking-widest select-none uppercase">
    Task Items
  </div>
  {#if loading}
    <div class="p-3 text-xs text-base-content/60">Loading items...</div>
  {:else if error}
    <div class="alert alert-error text-xs m-2">{error}</div>
  {:else if items.length === 0}
    <div class="p-3 text-xs text-base-content/60">No items found.</div>
  {:else}
    <ul class="flex flex-col divide-y divide-base-300 bg-base-100">
      {#each items as item}
        <li class="group relative flex flex-col select-none transition-all text-xs font-mono tracking-tight">
          <div class="flex items-center px-3 h-9 w-full hover:bg-blue-50/80 focus-within:bg-blue-50/80">
            <span class="absolute inset-y-0 left-0 w-0.5 bg-blue-400 opacity-0 group-hover:opacity-70 group-focus-within:opacity-70 rounded-sm transition-all z-10"></span>
            <input type="checkbox" class="checkbox checkbox-xs mr-2" on:click|stopPropagation on:change={() => onToggle(item.id)} />
            <span class="flex-1 truncate">{item.name}</span>
            {#if item.priority}
              <span class="badge badge-xs badge-outline ml-2 capitalize">{item.priority}</span>
            {/if}
            {#if item.status}
              <span class="badge badge-xs badge-neutral ml-2 capitalize">{item.status}</span>
            {/if}
            <span class="flex flex-row gap-1 ml-2">
              <button class="btn btn-xs btn-ghost px-1" aria-label="Edit item" on:click|stopPropagation={() => dispatch('taskItemEditClick', item)}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" /></svg>
              </button>
              <button class="btn btn-xs btn-ghost px-1" aria-label="Delete item" on:click|stopPropagation={() => onDelete(item.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
            <button type="button" class="ml-2 btn btn-xs btn-ghost px-1" aria-label="Expand details" on:click={() => toggleExpand(item.id)}>
              <svg class={expandedId === item.id ? 'rotate-90 transition-transform' : 'transition-transform'} width="12" height="12" viewBox="0 0 20 20"><path fill="currentColor" d="M6 8l4 4 4-4"/></svg>
            </button>
          </div>
          {#if expandedId === item.id}
            <div class="bg-base-200 px-4 py-2 border-l-2 border-blue-400/60 rounded-b-md animate-fade-in text-xs">
              {#if item.description}
                <div class="mb-1"><span class="font-semibold">Description:</span> {item.description}</div>
              {/if}
              {#if item.created_at}
                <div class="mb-1"><span class="font-semibold">Created:</span> {new Date(item.created_at).toLocaleString()}</div>
              {/if}
              {#if item.priority}
                <div class="mb-1"><span class="font-semibold">Priority:</span> {item.priority}</div>
              {/if}
              {#if item.status}
                <div class="mb-1"><span class="font-semibold">Status:</span> {item.status}</div>
              {/if}
              <!-- Add more fields as needed -->
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</section>
