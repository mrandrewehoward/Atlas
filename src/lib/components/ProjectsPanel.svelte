<script>
// Placeholder for projects data
const projects = [
  { id: 1, name: 'Atlas UI', icon: '🧭', color: 'accent', priority: 'high' },
  { id: 2, name: 'API', icon: '🔌', color: 'primary', priority: 'medium' }
];
</script>

<section class="flex flex-col h-full">
  <div class="flex items-center px-3 h-9 border-b border-base-300 bg-base-200 font-semibold text-base-content text-xs tracking-widest select-none uppercase">
    Projects
  </div>
  <ul class="flex flex-col divide-y divide-base-300 bg-base-100">
    {#each projects as project, i}
  <li class="group flex items-center px-3 h-9 cursor-pointer select-none hover:bg-base-200 focus-within:bg-base-200 transition-all relative aria-label={project.name}">
      <span class="absolute inset-y-0 left-0 w-0.5 bg-emerald-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 rounded-sm transition-all"></span>
        <span class="text-xs text-base-content/60 mr-2">{i + 1}</span>
        <span class="font-medium text-base-content flex-1 truncate">{project.name}</span>
        <span class="badge badge-xs badge-outline ml-2 capitalize">{project.priority}</span>
      </li>
    {/each}
  </ul>
</section>
