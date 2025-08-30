<script>
  // This will orchestrate the main 4-panel layout and the terminal bar
  import SpacesPanel from './SpacesPanel.svelte';
  import ProjectsPanel from './ProjectsPanel.svelte';
  import TasksPanel from './TasksPanel.svelte';
  import TaskItemsPanel from './TaskItemsPanel.svelte';
</script>

<div class="flex flex-col min-h-[90vh] max-w-7xl mx-auto px-8 py-6 gap-6">
  <div class="flex-1 flex gap-8 min-h-[75vh]">
    <!-- Spaces (thinnest) -->
    <div class="flex flex-col w-[7%] min-w-[80px] max-w-[120px]">
      <SpacesPanel />
    </div>
    <!-- Projects (next thinnest) -->
    <div class="flex flex-col w-[18%] min-w-[160px] max-w-[220px]">
      <ProjectsPanel />
    </div>
    <!-- Tasks (granular, half of remaining) -->
    <div class="flex flex-col flex-1">
      <TasksPanel />
    </div>
    <!-- Task Items (granular, half of remaining) -->
    <div class="flex flex-col flex-1">
      <TaskItemsPanel />
    </div>
  </div>
  <!-- Terminal bar (expandable, placeholder for now) -->
  <div class="w-full bg-neutral rounded-md shadow-inner p-2 mt-2 min-h-[48px] flex items-center justify-between">
    <span class="text-neutral-content">CLI / Terminal (expandable bar placeholder)</span>
    <button class="btn btn-xs btn-ghost">Expand</button>
  </div>
</div>
