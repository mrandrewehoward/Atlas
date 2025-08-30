<script>
// Placeholder for projects data
const projects = [
  { id: 1, name: 'Atlas UI', icon: '🧭', color: 'accent', priority: 'high' },
  { id: 2, name: 'API', icon: '🔌', color: 'primary', priority: 'medium' }
];
</script>

<section class="flex flex-col h-full">
  <div class="stat bg-base-100 rounded-md shadow-sm mb-2">
    <div class="stat-value text-base-content">Projects</div>
  </div>
  <div class="flex flex-col gap-2">
    {#each projects as project}
      <div class="card card-compact bg-base-200 border-l-4 border-{project.color} p-2 cursor-pointer hover:bg-base-300 transition">
        <div class="flex items-center gap-2">
          <span class="font-semibold">{project.name}</span>
          <span class="badge badge-xs badge-outline ml-auto capitalize">{project.priority}</span>
        </div>
      </div>
    {/each}
  </div>
</section>
