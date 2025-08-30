<script>
// Placeholder for tasks data
const tasks = [
  { id: 1, name: 'Design UI', priority: 'high', status: 'open' },
  { id: 2, name: 'Write Docs', priority: 'medium', status: 'in progress' }
];
</script>

<section class="flex flex-col h-full">
  <div class="flex items-center px-3 h-9 border-b border-base-300 bg-base-200 font-semibold text-base-content text-xs tracking-widest select-none uppercase">
    Tasks
  </div>
  <ul class="flex flex-col divide-y divide-base-300 bg-base-100">
    {#each tasks as task}
  <li class="group flex items-center px-3 h-9 cursor-pointer select-none hover:bg-base-200 focus-within:bg-base-200 transition-all text-xs font-mono tracking-tight"
      aria-label={task.name}>
      <span class="absolute inset-y-0 left-0 w-0.5 bg-blue-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 rounded-sm transition-all"></span>
        <input type="checkbox" class="checkbox checkbox-xs mr-2" />
        <span class="flex-1 truncate">{task.name}</span>
        <span class="badge badge-xs badge-outline ml-2 capitalize">{task.priority}</span>
        <span class="badge badge-xs badge-neutral ml-2 capitalize">{task.status}</span>
        <span class="flex flex-row gap-1 ml-2">
          <button class="btn btn-xs btn-ghost px-1" aria-label="Edit task"></button>
          <button class="btn btn-xs btn-ghost px-1" aria-label="Delete task"></button>
        </span>
      </li>
    {/each}
  </ul>
</section>
