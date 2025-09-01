<script lang="ts">
import type { Task } from '../types';
export let onUpdate: ((task: Task, updates: Partial<Task>) => void) | null = null;
export let onDelete: ((task: Task) => void) | null = null;
export let onAdd: ((name: string) => void) | null = null;
export let tasks: Task[] = [];

let newTaskName = '';
let localOrder: Record<string, string> = {};

function handleUpdate(task: Task, updates: Partial<Task>) {
  if (onUpdate) onUpdate(task, updates);
}
function handleDelete(task: Task) {
  if (onDelete) onDelete(task);
}
function handleAdd() {
  if (newTaskName.trim() && onAdd) {
    onAdd(newTaskName.trim());
    newTaskName = '';
  }
}

$: {
  for (const task of tasks) {
    localOrder[task.id] =
      task.order === undefined || task.order === null ? '' : String(task.order);
  }
}
</script>

<ul class="flex flex-col gap-2 mb-4">
  {#each tasks as task (task.id)}
    <li class="flex items-center gap-2">
      <form class="flex-1 flex gap-2 items-center" on:submit|preventDefault={() => handleUpdate(task, { name: task.name, order: localOrder[task.id] ? Number(localOrder[task.id]) : undefined })}>
        <input
          class="input input-sm flex-1 border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1"
          type="text"
          bind:value={task.name}
          aria-label="Edit task name"
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
          bind:value={localOrder[task.id]}
          aria-label="Order"
          list={`order-options-${task.id}`}
          on:input={(e) => {
            const val = (e.target as HTMLInputElement).value;
            localOrder[task.id] = val;
          }}
          on:blur={() => {
            const val = localOrder[task.id];
            if (val === '' || val === null) {
              handleUpdate(task, { order: undefined });
            } else {
              const num = Number(val);
              if (!isNaN(num) && num >= 1 && num <= tasks.length) handleUpdate(task, { order: num });
            }
          }}
          style="width:3.5rem;"
        />
        <datalist id={`order-options-${task.id}`}>
          {#each Array(tasks.length) as _, i}
            <option value={i + 1}></option>
          {/each}
        </datalist>
        <button class="btn btn-xs btn-error ml-2" type="button" aria-label="Delete task" on:click={() => handleDelete(task)}>
          &#x2715;
        </button>
      </form>
    </li>
  {/each}
  <li class="flex items-center gap-2 mt-2">
    <input
      class="input input-sm flex-1 border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1"
      type="text"
      bind:value={newTaskName}
      placeholder="Add new task..."
      aria-label="Add new task"
      on:keydown={(e) => {
        if (e.key === 'Enter') handleAdd();
      }}
    />
    <button class="btn btn-xs btn-primary ml-2" type="button" on:click={handleAdd}>Add</button>
  </li>
</ul>
