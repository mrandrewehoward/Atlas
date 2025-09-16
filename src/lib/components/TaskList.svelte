<script lang="ts">
import Icon from '@iconify/svelte';
import { createEventDispatcher } from 'svelte';
export let tasks: Array<{ id: string; name: string; icon?: string; color?: string; priority?: 'low' | 'medium' | 'high' | null; status?: string }> = [];
export let selectedTasks: Set<string> = new Set();
export let loading: boolean = false;
export let error: string = '';
const dispatch = createEventDispatcher();

function toggleSelect(id: string) {
  if (selectedTasks.has(id)) selectedTasks.delete(id);
  else selectedTasks.add(id);
  selectedTasks = new Set(selectedTasks);
  dispatch('updateSelected', Array.from(selectedTasks));
}

function printSelected() {
  const toPrint = tasks.filter(t => selectedTasks.has(t.id));
  dispatch('printSelected', toPrint);
}
</script>

<section class="flex flex-col h-full bg-base-100 border-t border-b border-l border-base-300">
  <div class="flex items-center px-3 h-9 border-b border-base-300 bg-base-200 font-semibold text-base-content text-xs tracking-widest select-none uppercase">
    Tasks
  </div>
  <div class="flex items-center px-3 h-6 border-b border-base-200 bg-base-100 text-base-content text-[10px] tracking-widest select-none font-semibold opacity-40">
    <span class="w-[120px] flex-shrink-0 flex-grow-0 ml-2 text-left">Name</span>
    <span class="flex-1"></span>
    <div class="flex flex-row items-center gap-2 min-w-[120px] justify-end">
      <span class="w-8 text-center px-1" title="Icon" aria-label="Icon">I</span>
      <span class="w-8 text-center px-1" title="Priority" aria-label="Priority">P</span>
      <span class="w-8 text-right px-1"></span>
    </div>
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
        {#if task && task.name}
        <li class="group flex items-center px-0 h-9 relative">
          <div class="flex items-center w-full h-9 px-3 select-none hover:bg-base-200 focus:bg-base-200 transition-all text-left">
            <input type="checkbox" class="checkbox checkbox-xs mr-2" checked={selectedTasks.has(task.id)} on:change={() => toggleSelect(task.id)} />
            <button
              type="button"
              class="w-[200px] flex-shrink-0 flex-grow-0 truncate font-medium text-base-content ml-2 cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-primary text-left"
              on:click={() => dispatch('select', task)}
              aria-label={`Load items for ${task.name}`}
              title={`Load items for ${task.name}`}
            >
              {task.name.length > 30 ? task.name.slice(0, 30) + '\u2026' : task.name}
            </button>
            <span class="flex-1"></span>
            <div class="flex flex-row items-center gap-2 min-w-[120px] justify-end">
              <span class="w-9 flex items-center justify-center px-1">
                {#if task.icon}
                  <span class="inline-flex items-center justify-center w-6 h-6 rounded-full border border-base-300" style={task.color ? `background:${task.color};` : ''}>
                    <Icon icon={task.icon} width="18" height="18" style={task.color ? 'color: #fff' : ''} />
                  </span>
                {:else if task.color}
                  <span class="w-4 h-4 rounded-full border-2 border-base-300" style={`background:${task.color}`}></span>
                {:else}
                  <Icon icon="material-symbols-light:circle" width="18" height="18" style="opacity:0;" />
                {/if}
              </span>
              <span class="w-9 flex items-center justify-center px-1">
                {#if task.priority === 'low'}
                  <Icon icon="material-symbols-light:stat-1" width="18" height="18" class="text-green-500" />
                {:else if task.priority === 'medium'}
                  <Icon icon="material-symbols-light:stat-2" width="18" height="18" class="text-yellow-400" />
                {:else if task.priority === 'high'}
                  <Icon icon="material-symbols-light:stat-3" width="18" height="18" class="text-red-500" />
                {:else}
                  <Icon icon="material-symbols-light:stat-0-outline-rounded" width="18" height="18" class="text-base-300" />
                {/if}
              </span>
              <span class="w-8 flex items-center justify-end pl-1 pr-1">
                <button
                  class="btn btn-xs btn-ghost inline-flex items-center justify-center !px-1 !py-0.5 rounded"
                  style="min-width:unset;width:24px;height:24px;"
                  aria-label="Edit task"
                  title="Edit task"
                  tabindex="0"
                  on:click|stopPropagation={() => dispatch('taskEditClick', task)}
                >
                  <Icon icon="material-symbols-light:edit" width="18" height="18" />
                </button>
                <button
                  class="btn btn-xs btn-ghost inline-flex items-center justify-center !px-1 !py-0.5 rounded"
                  style="min-width:unset;width:24px;height:24px;"
                  aria-label="Print task"
                  title="Print task"
                  tabindex="0"
                  on:click|stopPropagation={() => dispatch('taskPrintClick', task)}
                >
                  <Icon icon="material-symbols:print-outline" width="18" height="18" />
                </button>
              </span>
            </div>
          </div>
        </li>
        {/if}
      {/each}
    </ul>
  {/if}
</section>
