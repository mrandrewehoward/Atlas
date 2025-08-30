
<!-- VS Code-inspired layout: clean slate for redesign -->
<div class="flex flex-row h-full w-full">
	<!-- Spaces Bar -->
	<div class="flex flex-col items-center bg-base-200 w-12 min-w-[48px] py-2 gap-2 border-r border-base-300" aria-label="Spaces Bar">
		<span class="text-xs font-bold text-base-content/70 mb-2">Spaces</span>
		<span aria-label="S">S</span><span aria-label="P">P</span><span aria-label="A">A</span><span aria-label="C">C</span><span aria-label="E">E</span><span aria-label="S">S</span>
		<span class="mt-2" aria-label="Add Space">+</span>
	</div>
	<!-- Projects Explorer -->
	<div class="flex flex-col bg-base-100 w-56 min-w-[180px] max-w-[240px] py-2 px-1 gap-2 border-r border-base-300" aria-label="Projects Explorer">
		<span class="text-xs font-bold text-base-content/70 mb-2">Projects (explorer)</span>
		<div class="border border-dashed border-emerald-400 p-2 mb-1 bg-base-100">[Project 1]</div>
		<div class="border border-dashed border-emerald-400 p-2 mb-1 bg-base-100">[Project 2]</div>
		<div class="border border-dashed border-emerald-400 p-2 mb-1 bg-base-100">...</div>
	</div>
	<!-- Working Area: Tasks/Task Items and Terminal below -->
	<div class="flex flex-col flex-1 min-w-0">
		<div class="flex flex-row h-full">
			<div class="flex flex-col flex-1 min-w-0 border-r border-base-300 p-2" aria-label="Tasks">
				<span class="text-xs font-bold text-base-content/70 mb-2">Tasks</span>
			</div>
			<div class="flex flex-col flex-1 min-w-0 p-2" aria-label="Task Items">
				<span class="text-xs font-bold text-base-content/70 mb-2">Task Items</span>
			</div>
		</div>
		<!-- Terminal/CLI below working area only -->
		<div class="w-full bg-neutral text-neutral-content p-2 min-h-12 max-h-30" aria-label="Terminal">
			[Terminal: Text based CLI]
		</div>
	</div>
</div>