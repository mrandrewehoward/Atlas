

<script lang="ts">
	// Dummy data for demonstration; replace with real data sources
	let projects = [
		{ id: 'p1', name: 'Project 1', type: 'project' },
		{ id: 'p2', name: 'Project 2', type: 'project' }
	];
	let tasks = [
		{ id: 't1', name: 'Task 1', type: 'task' },
		{ id: 't2', name: 'Task 2', type: 'task' }
	];
	let items = [
		{ id: 'i1', name: 'Item 1', type: 'item' },
		{ id: 'i2', name: 'Item 2', type: 'item' },
		{ id: 'i3', name: 'Item 3', type: 'item' }
	];

	let selected = new Set<string>();

	function toggleSelect(id: string) {
		if (selected.has(id)) selected.delete(id);
		else selected.add(id);
		selected = new Set(selected); // trigger reactivity
	}

	function flattenSelected() {
		let result = [];
		for (const p of projects) if (selected.has(p.id)) result.push(p);
		for (const t of tasks) if (selected.has(t.id)) result.push(t);
		for (const i of items) if (selected.has(i.id)) result.push(i);
		return result;
	}

	async function printSelected() {
		const toPrint = flattenSelected();
		if (!toPrint.length) return;
		await fetch('/api/print', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(toPrint)
		});
		selected.clear();
	}
</script>

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
		<ul>
			{#each projects as project}
				<li>
					<input type="checkbox" checked={selected.has(project.id)} on:change={() => toggleSelect(project.id)} />
					{project.name}
				</li>
			{/each}
		</ul>
	</div>
	<!-- Working Area: Tasks/Task Items and Terminal below -->
	<div class="flex flex-col flex-1 min-w-0">
		<div class="flex flex-row h-full">
			<div class="flex flex-col flex-1 min-w-0 border-r border-base-300 p-2" aria-label="Tasks">
				<span class="text-xs font-bold text-base-content/70 mb-2">Tasks</span>
				<ul>
					{#each tasks as task}
						<li>
							<input type="checkbox" checked={selected.has(task.id)} on:change={() => toggleSelect(task.id)} />
							{task.name}
						</li>
					{/each}
				</ul>
			</div>
			<div class="flex flex-col flex-1 min-w-0 p-2" aria-label="Task Items">
				<span class="text-xs font-bold text-base-content/70 mb-2">Task Items</span>
				<ul>
					{#each items as item}
						<li>
							<input type="checkbox" checked={selected.has(item.id)} on:change={() => toggleSelect(item.id)} />
							{item.name}
						</li>
					{/each}
				</ul>
			</div>
		</div>
		<!-- Print Selected Button -->
		{#if selected.size > 0}
			<div class="w-full flex justify-end p-2">
				<button class="btn btn-primary" on:click={printSelected}>Print Selected</button>
			</div>
		{/if}
		<!-- Terminal/CLI below working area only -->
		<div class="w-full bg-neutral text-neutral-content p-2 min-h-12 max-h-30" aria-label="Terminal">
			[Terminal: Text based CLI]
		</div>
	</div>
</div>