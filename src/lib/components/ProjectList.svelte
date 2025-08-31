<script lang="ts">
  export let projects: Array<{ id: string; name: string; icon?: string; color?: string; priority?: string }> = [];
  export let selectedProjectIds: Set<string> | string[] = [];
  export let selectedId: string | null = null;
  export let onToggleProject: (id: string) => void = () => {};
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
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-2"
              checked={Array.isArray(selectedProjectIds) ? selectedProjectIds.includes(project.id) : selectedProjectIds.has(project.id)}
              on:change={() => onToggleProject(project.id)}
              aria-label="Select project {project.name}"
            />
            <span class="text-xs text-base-content/60 mr-2">{i + 1}</span>
            <span class="font-medium text-base-content flex-1 truncate {selectedId === project.id ? 'font-extrabold text-emerald-700' : ''}">{project.name}</span>
            {#if project.priority}
              <span class="badge badge-xs badge-outline ml-2 capitalize">{project.priority}</span>
            {/if}
          </label>
        </li>
      {/each}
    </ul>
  {/if}
</section>
