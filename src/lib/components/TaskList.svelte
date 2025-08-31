<script lang="ts">
  export let tasks: Array<{ id: string; name: string; priority?: string; status?: string }> = [];
  export let selectedId: string | null = null;
  export let onEdit: (id: string) => void = () => {};
  export let onDelete: (id: string) => void = () => {};
  export let onToggle: (id: string) => void = () => {};
  export let loading: boolean = false;
  export let error: string = '';
</script>

<section class="flex flex-col h-full bg-base-100 border border-base-100">
  <div class="flex items-center px-3 h-9 border-b border-base-300 bg-base-200 font-semibold text-base-content text-xs tracking-widest select-none uppercase">
    Tasks
  </div>
  {#if loading}
    <div class="p-3 text-xs text-base-content/60">Loading tasks...</div>
  {:else if error}
    <div class="alert alert-error text-xs m-2">{error}</div>
  {:else if tasks.length === 0}
    <div class="p-3 text-xs text-base-content/60">No tasks found.</div>
  {:else}
    <ul class="flex flex-col divide-y divide-base-300 bg-base-100">
      {#each tasks as task}
        <li>
          <button
            type="button"
            class="group relative flex items-center w-full px-3 h-9 cursor-pointer select-none hover:bg-blue-50/80 focus:bg-blue-50/80 transition-all text-xs font-mono tracking-tight text-left {selectedId === task.id ? 'font-extrabold text-emerald-700' : ''}"
            aria-label={task.name}
            on:click={() => onToggle(task.id)}
          >
            <span class="absolute inset-y-0 left-0 w-0.5 bg-blue-400 opacity-0 group-hover:opacity-70 group-focus-within:opacity-70 rounded-sm transition-all z-10"></span>
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-2"
              on:click|stopPropagation={() => onToggle(task.id)}
            />
            <span class="flex-1 truncate {selectedId === task.id ? 'font-extrabold text-emerald-700' : ''}">{task.name}</span>
            {#if task.priority}
              <span class="badge badge-xs badge-outline ml-2 capitalize">{task.priority}</span>
            {/if}
            {#if task.status}
              <span class="badge badge-xs badge-neutral ml-2 capitalize">{task.status}</span>
            {/if}
            <span class="flex flex-row gap-1 ml-2">
              <span
                class="btn btn-xs btn-ghost px-1"
                role="button"
                tabindex="0"
                aria-label="Edit task"
                on:click={(e) => { e.stopPropagation(); onEdit(task.id); }}
                on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onEdit(task.id); } }}
              ></span>
              <span
                class="btn btn-xs btn-ghost px-1"
                role="button"
                tabindex="0"
                aria-label="Delete task"
                on:click={(e) => { e.stopPropagation(); onDelete(task.id); }}
                on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onDelete(task.id); } }}
              ></span>
            </span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</section>
