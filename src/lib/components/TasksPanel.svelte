<script>
// Placeholder for tasks data
const tasks = [
  { id: 1, name: 'Design UI', priority: 'high', status: 'open' },
  { id: 2, name: 'Write Docs', priority: 'medium', status: 'in progress' }
];
</script>

<section class="flex flex-col h-full">
  <div class="stat bg-base-100 rounded-md shadow-sm mb-2">
    <div class="stat-value text-base-content">Tasks</div>
  </div>
  <ul class="bg-base-200 rounded-md w-full flex flex-col gap-2 p-0">
    {#each tasks as task}
  <li class="flex flex-row items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis px-2 py-1 rounded">
        <input type="checkbox" class="checkbox checkbox-xs" />
        <span class="flex-1">{task.name}</span>
        <span class="badge badge-xs badge-outline capitalize">{task.priority}</span>
        <span class="badge badge-xs badge-neutral capitalize">{task.status}</span>
  <button class="btn btn-xs btn-ghost"></button>
  <button class="btn btn-xs btn-ghost"></button>
      </li>
    {/each}
  </ul>
</section>
