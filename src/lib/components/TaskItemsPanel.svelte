<script>
// Placeholder for task items data
const items = [
  { id: 1, name: 'Create wireframes', priority: 'medium', status: 'open' },
  { id: 2, name: 'Review PR', priority: 'low', status: 'done' }
];
</script>

<section class="flex flex-col h-full">
  <div class="stat bg-base-100 rounded-md shadow-sm mb-2">
    <div class="stat-value text-base-content">Task Items</div>
  </div>
  <ul class="bg-base-200 rounded-md w-full flex flex-col gap-2 p-0">
    {#each items as item}
  <li class="flex flex-row items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis px-2 py-1 rounded">
        <input type="checkbox" class="checkbox checkbox-xs" />
        <span class="flex-1">{item.name}</span>
        <span class="badge badge-xs badge-outline capitalize">{item.priority}</span>
        <span class="badge badge-xs badge-neutral capitalize">{item.status}</span>
  <button class="btn btn-xs btn-ghost"></button>
  <button class="btn btn-xs btn-ghost"></button>
      </li>
    {/each}
  </ul>
</section>
