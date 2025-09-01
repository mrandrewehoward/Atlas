<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  export let projects: Array<{ id: string; name: string; icon?: string; color?: string; priority?: string }> = [];
  export let selectedId: string | null = null;
  export let loading: boolean = false;
  export let error: string = '';
</script>


<section class="flex flex-col h-full">
  <div class="flex items-center px-3 h-9 border-b border-base-300 bg-base-200 font-semibold text-base-content text-xs tracking-widest select-none uppercase">
    Projects
  </div>
  {#if loading}
    <div class="p-3 text-xs text-base-content/60">Loading projects...</div>
  {:else if error}
    <div class="alert alert-error text-xs m-2">{error}</div>
  {:else if projects.length === 0}
    <div class="p-3 text-xs text-base-content/60">No projects found.</div>
  {:else}
    <ul class="flex flex-col divide-y divide-base-300 bg-base-100">
      {#each projects as project, i}
        <li class="group flex items-center px-0 h-9 relative">
          <label class="flex items-center w-full h-9 px-3 cursor-pointer select-none hover:bg-base-200 focus:bg-base-200 transition-all text-left {selectedId === project.id ? 'font-extrabold text-emerald-700' : ''}">
            <span class="absolute inset-y-0 left-0 w-0.5 bg-emerald-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 rounded-sm transition-all"></span>
            <span class="font-medium text-base-content flex-1 truncate {selectedId === project.id ? 'font-extrabold text-emerald-700' : ''}">{project.name}</span>
            {#if project.priority}
              <span class="badge badge-xxs badge-outline ml-1 capitalize">{project.priority}</span>
            {/if}
            <button
              class="btn btn-xs btn-ghost ml-2"
              aria-label="Edit project"
              on:click={() => dispatch('projectEditClick', project)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L5 11l4-4z" /></svg>
            </button>
          </label>
        </li>
      {/each}
    </ul>
  {/if}
</section>
