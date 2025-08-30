<script>
// Placeholder for spaces data
const spaces = [
  { id: 1, name: 'Personal', icon: '🏠', color: 'primary' },
  { id: 2, name: 'Work', icon: '💼', color: 'secondary' }
];
</script>

<section class="flex flex-col h-full">
  <div class="stat bg-base-100 rounded-md shadow-sm mb-2">
    <div class="stat-value text-base-content">Spaces</div>
  </div>
  <ul class="flex flex-col gap-2">
    {#each spaces as space}
      <li class="card card-compact bg-base-200 border-l-4 border-{space.color} p-2 cursor-pointer hover:bg-base-300 transition">
        <div class="flex items-center gap-2">
          <span class="font-semibold">{space.name}</span>
        </div>
      </li>
    {/each}
  </ul>
</section>
