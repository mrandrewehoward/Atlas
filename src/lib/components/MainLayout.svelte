<script>
  import SpacesPanel from './SpacesPanel.svelte';
  import ProjectsPanel from './ProjectsPanel.svelte';
  import TasksPanel from './TasksPanel.svelte';
  import TaskItemsPanel from './TaskItemsPanel.svelte';
</script>

<div class="flex flex-row h-full w-full gap-0 relative">
  <!-- Spaces Bar -->
  <div class="flex flex-col items-center bg-base-200 w-12 min-w-[48px] py-2 gap-2 border-r border-base-300">
    <SpacesPanel />
  </div>
  <!-- Projects Explorer -->
  <div class="flex flex-col bg-base-200 w-56 min-w-[180px] max-w-[240px] py-2 px-1 gap-2 border-r border-base-300">
    <ProjectsPanel />
  </div>
  <!-- Working Area: Tasks/Task Items and Terminal below -->
  <div class="flex flex-col flex-1 min-w-0">
    <div class="flex flex-col h-full">
      <div class="flex flex-row h-full">
        <div class="flex flex-col flex-1 min-w-0">
          <TasksPanel />
        </div>
        <div class="flex flex-col flex-1 min-w-0">
          <TaskItemsPanel />
        </div>
      </div>
      <!-- Terminal/CLI below working area only -->
      <div class="w-full">
        <div class="mockup-code bg-base-300 min-h-[56px] max-h-40 overflow-auto border-t border-base-300">
          <pre data-prefix="$"><code>Welcome to the Atlas CLI. Type 'help' for commands.</code></pre>
        </div>
      </div>
    </div>
  </div>
</div>
