<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';
  const dispatch = createEventDispatcher();
  export let projects: Array<{ id: string; name: string; icon?: string; color?: string; priority?: 'low' | 'medium' | 'high' | null }> = [];
  export let selectedId: string | null = null;
  export let loading: boolean = false;
  export let error: string = '';

  // Status helper
  function getStatus(priority: 'low' | 'medium' | 'high' | null | undefined): { label: string; color: string } {
    if (priority === 'high') return { label: 'High', color: 'badge-error' };
    if (priority === 'low') return { label: 'Low', color: 'badge-info' };
    if (priority === 'medium') return { label: 'Medium', color: 'badge-ghost' };
    return { label: 'None', color: 'badge-ghost' };
  }
</script>


<section class="flex flex-col h-full min-w-[340px] border-t border-b bg-base-100 border-base-300" style="min-width:340px;">
  <div class="flex items-center px-3 h-9 border-b border-base-300 bg-base-200 font-semibold text-base-content text-xs tracking-widest select-none uppercase">
    Projects
  </div>
  <div class="flex items-center px-3 h-6 border-b border-base-200 bg-base-100 text-base-content text-[10px] tracking-widest select-none font-semibold opacity-40">
  <span class="w-[120px] flex-shrink-0 flex-grow-0 ml-2 text-left">Name</span>
    <span class="flex-1"></span>
    <div class="flex flex-row items-center gap-2 min-w-[120px] justify-end">
  <span class="w-8 text-center px-1" title="Priority" aria-label="Priority">P</span>
  <span class="w-8 text-center px-1" title="Icon" aria-label="Icon">I</span>
      <span class="w-8 text-right px-1"></span>
    </div>
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
          <div class="flex items-center w-full h-9 px-3 cursor-pointer select-none hover:bg-base-200 focus:bg-base-200 transition-all text-left {selectedId === project.id ? 'font-extrabold text-emerald-700' : ''}"
            tabindex="0"
            role="button"
            aria-label={`Select project ${project.name}`}
            on:click={() => dispatch('select', project.id)}
            on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && dispatch('select', project.id)}
          >
            <span class="w-[200px] flex-shrink-0 flex-grow-0 truncate font-medium text-base-content ml-2 {selectedId === project.id ? 'font-extrabold text-emerald-700' : ''}">{project.name.length > 30 ? project.name.slice(0, 30) + '…' : project.name}</span>
            <span class="flex-1"></span>
            <div class="flex flex-row items-center gap-2 min-w-[120px] justify-end">
              <span class="w-9 flex items-center justify-center px-1">
                {#if project.priority === 'low'}
                  <Icon icon="material-symbols-light:stat-1" width="18" height="18" class="text-green-500" />
                {:else if project.priority === 'medium'}
                  <Icon icon="material-symbols-light:stat-2" width="18" height="18" class="text-yellow-400" />
                {:else if project.priority === 'high'}
                  <Icon icon="material-symbols-light:stat-3" width="18" height="18" class="text-red-500" />
                {:else}
                  <Icon icon="material-symbols-light:stat-0-outline-rounded" width="18" height="18" class="text-base-300" />
                {/if}
              </span>
              <span class="w-9 flex items-center justify-center px-1">
                {#if project.icon}
                  <span class="inline-flex items-center justify-center w-6 h-6 rounded-full border border-base-300" style={project.color ? `background:${project.color};` : ''}>
                    <Icon icon={project.icon} width="18" height="18" style={project.color ? 'color: #fff' : ''} />
                  </span>
                {:else if project.color}
                  <span class="w-4 h-4 rounded-full border-2 border-base-300" style={`background:${project.color}`}></span>
                {:else}
                  <Icon icon="material-symbols-light:circle" width="18" height="18" style="opacity:0;" />
                {/if}
              </span>
              <span class="w-8 flex items-center justify-end pl-1 pr-1">
                <button
                  class="btn btn-xs btn-ghost inline-flex items-center justify-center !px-1 !py-0.5 rounded"
                  style="min-width:unset;width:24px;height:24px;"
                  aria-label="Edit project"
                  title="Edit project"
                  tabindex="0"
                  on:click|stopPropagation={() => dispatch('projectEditClick', project)}
                >
                  <Icon icon="material-symbols-light:edit" width="18" height="18" />
                </button>
              </span>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>
