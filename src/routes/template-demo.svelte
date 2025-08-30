<!-- VS Code-inspired layout demo: minimal, blocky, and clear -->
<script>
  // No logic, just layout blocks for now
</script>

<style>
  .outline-block { border: 2px dashed #a3a3a3; background: #f8fafc; }
  .label { color: #6b7280; font-size: 0.85em; font-weight: bold; margin-bottom: 0.5em; }
</style>

<div class="flex flex-row h-full w-full">
  <!-- Spaces Bar -->
  <div class="flex flex-col items-center outline-block w-12 min-w-[48px] py-2 gap-2 border-r border-base-300">
    <span class="label">Spaces</span>
    <span>S</span><span>P</span><span>A</span><span>C</span><span>E</span><span>S</span>
    <span style="margin-top:1em;">+</span>
  </div>
  <!-- Projects Explorer -->
  <div class="flex flex-col outline-block w-56 min-w-[180px] max-w-[240px] py-2 px-1 gap-2 border-r border-base-300">
    <span class="label">Projects (explorer)</span>
    <div class="outline-block p-2 mb-1">[Project 1]</div>
    <div class="outline-block p-2 mb-1">[Project 2]</div>
    <div class="outline-block p-2 mb-1">...</div>
  </div>
  <!-- Working Area: Tasks/Task Items and Terminal below -->
  <div class="flex flex-col flex-1 min-w-0">
    <div class="flex flex-row h-full">
      <div class="flex flex-col flex-1 min-w-0 outline-block p-2">
        <span class="label">Tasks</span>
      </div>
      <div class="flex flex-col flex-1 min-w-0 outline-block p-2">
        <span class="label">Task Items</span>
      </div>
    </div>
    <!-- Terminal/CLI below working area only -->
    <div class="w-full outline-block bg-neutral text-neutral-content p-2" style="min-height:48px;max-height:120px;">
      [Terminal: Text based CLI]
    </div>
  </div>
</div>
