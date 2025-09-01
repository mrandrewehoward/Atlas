<script lang="ts">
  export let tasks: Array<{ id: string; name: string; priority?: string; status?: string }> = [];
  export let selectedId: string | null = null;
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
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
          <div class="group relative flex items-center w-full px-3 h-9 cursor-pointer select-none hover:bg-blue-50/80 focus:bg-blue-50/80 transition-all text-xs font-mono tracking-tight text-left {selectedId === task.id ? 'font-extrabold text-emerald-700' : ''}">
            <span class="absolute inset-y-0 left-0 w-0.5 bg-blue-400 opacity-0 group-hover:opacity-70 group-focus-within:opacity-70 rounded-sm transition-all z-10"></span>
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-2"
              on:click|stopPropagation={() => onToggle(task.id)}
            />
            <button
              type="button"
              class="flex-1 truncate text-left bg-transparent border-0 p-0 m-0 appearance-none {selectedId === task.id ? 'font-extrabold text-emerald-700' : ''}"
              aria-pressed={selectedId === task.id}
              aria-label={`Select task ${task.name}`}
              on:click={() => onToggle(task.id)}
              on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { onToggle(task.id); } }}
            >
              {task.name}
            </button>
            {#if task.priority}
              <span class="badge badge-xs badge-outline ml-2 capitalize">{task.priority}</span>
            {/if}
            {#if task.status}
              <span class="badge badge-xs badge-neutral ml-2 capitalize">{task.status}</span>
            {/if}
            <button
              class="btn btn-xs btn-ghost px-1 ml-2"
              aria-label="Edit task"
              on:click={(e) => { e.stopPropagation(); dispatch('taskEditClick', task); }}
              on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); dispatch('taskEditClick', task); } }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" /></svg>
            </button>
            <button
              class="btn btn-xs btn-ghost px-1"
              aria-label="Delete task"
              on:click={(e) => { e.stopPropagation(); onDelete(task.id); }}
              on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onDelete(task.id); } }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>
