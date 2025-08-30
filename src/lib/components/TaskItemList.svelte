<script lang="ts">
  export let items: Array<{ id: number; name: string; priority?: string; status?: string }> = [];
  export let onEdit: (id: number) => void = () => {};
  export let onDelete: (id: number) => void = () => {};
  export let onToggle: (id: number) => void = () => {};
  export let loading: boolean = false;
  export let error: string = '';
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
        <li class="group relative flex items-center px-3 h-9 cursor-pointer select-none hover:bg-blue-50/80 focus-within:bg-blue-50/80 transition-all text-xs font-mono tracking-tight" aria-label={item.name}>
          <span class="absolute inset-y-0 left-0 w-0.5 bg-blue-400 opacity-0 group-hover:opacity-70 group-focus-within:opacity-70 rounded-sm transition-all z-10"></span>
          <input type="checkbox" class="checkbox checkbox-xs mr-2" on:change={() => onToggle(item.id)} />
          <span class="flex-1 truncate">{item.name}</span>
          {#if item.priority}
            <span class="badge badge-xs badge-outline ml-2 capitalize">{item.priority}</span>
          {/if}
          {#if item.status}
            <span class="badge badge-xs badge-neutral ml-2 capitalize">{item.status}</span>
          {/if}
          <span class="flex flex-row gap-1 ml-2">
            <button class="btn btn-xs btn-ghost px-1" aria-label="Edit item" on:click={() => onEdit(item.id)}></button>
            <button class="btn btn-xs btn-ghost px-1" aria-label="Delete item" on:click={() => onDelete(item.id)}></button>
          </span>
        </li>
      {/each}
    </ul>
  {/if}
</section>
