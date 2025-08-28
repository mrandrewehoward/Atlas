<script>
	let dark = false;
	function toggleTheme() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
	}
	let colors = [
		'brand-500',
		'blue-500',
		'red-500',
		'green-500',
		'yellow-500',
		'purple-500',
		'gray-500'
	];
	let stats = [
		{ label: 'Users', value: 1234 },
		{ label: 'Projects', value: 42 },
		{ label: 'Tasks', value: 314 },
		{ label: 'Completed', value: 271 }
	];
</script>

<div class="min-h-screen transition bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-5xl font-extrabold tracking-tight">RipTicket Theme Demo</h1>
		<button
			class="px-4 py-2 rounded-lg font-bold bg-brand-500 text-white dark:bg-gray-800 dark:text-brand-500 shadow-lg transition"
			on:click={toggleTheme}
		>
			{dark ? 'Switch to Light' : 'Switch to Dark'}
		</button>
	</div>

	<div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
		{#each colors as color}
			<div
				class="rounded-xl shadow-lg p-6 flex flex-col items-center justify-center"
				style="background: var(--color-{color});"
			>
				<div
					class="w-12 h-12 rounded-full mb-2"
					style="background: var(--color-{color}); border: 2px solid #fff;"
				></div>
				<span class="font-bold text-lg">{color}</span>
			</div>
		{/each}
	</div>

	<div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
		{#each stats as stat}
			<div
				class="rounded-xl bg-gray-100 dark:bg-gray-800 p-6 flex flex-col items-center justify-center shadow"
			>
				<span class="text-3xl font-extrabold text-brand-500 dark:text-yellow-400">{stat.value}</span
				>
				<span class="font-medium text-gray-600 dark:text-gray-300">{stat.label}</span>
			</div>
		{/each}
	</div>

	<div class="mb-8">
		<h2 class="text-2xl font-bold mb-4">Buttons & Inputs</h2>
		<div class="flex gap-4 flex-wrap">
			<button
				class="px-6 py-2 rounded-lg font-bold bg-brand-500 text-white shadow hover:bg-blue-600 transition"
				>Primary</button
			>
			<button
				class="px-6 py-2 rounded-lg font-bold bg-gray-200 text-gray-900 shadow hover:bg-gray-300 transition"
				>Secondary</button
			>
			<button
				class="px-6 py-2 rounded-lg font-bold bg-yellow-400 text-gray-900 shadow hover:bg-yellow-500 transition"
				>Warning</button
			>
			<input
				class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow"
				placeholder="Type something..."
			/>
			<select
				class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow"
			>
				<option>Option 1</option>
				<option>Option 2</option>
				<option>Option 3</option>
			</select>
		</div>
	</div>

	<div class="mb-8">
		<h2 class="text-2xl font-bold mb-4">Cards & Containers</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div
				class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700"
			>
				<h3 class="font-bold text-xl mb-2">Project Alpha</h3>
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					A modern project card with stats and actions.
				</p>
				<div class="flex gap-2">
					<button class="px-4 py-1 rounded bg-brand-500 text-white font-bold">Open</button>
					<button class="px-4 py-1 rounded bg-gray-200 text-gray-900 font-bold">Archive</button>
				</div>
			</div>
			<div
				class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700"
			>
				<h3 class="font-bold text-xl mb-2">Project Beta</h3>
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					Distinct layout, color pops, and hierarchy.
				</p>
				<div class="flex gap-2">
					<button class="px-4 py-1 rounded bg-green-500 text-white font-bold">Open</button>
					<button class="px-4 py-1 rounded bg-gray-200 text-gray-900 font-bold">Archive</button>
				</div>
			</div>
			<div
				class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700"
			>
				<h3 class="font-bold text-xl mb-2">Project Gamma</h3>
				<p class="text-gray-600 dark:text-gray-300 mb-4">
					Experiment with spacing, borders, and stats.
				</p>
				<div class="flex gap-2">
					<button class="px-4 py-1 rounded bg-purple-500 text-white font-bold">Open</button>
					<button class="px-4 py-1 rounded bg-gray-200 text-gray-900 font-bold">Archive</button>
				</div>
			</div>
		</div>
	</div>

	<div class="mb-8">
		<h2 class="text-2xl font-bold mb-4">Alerts & Badges</h2>
		<div class="flex gap-4 flex-wrap">
			<div class="px-4 py-2 rounded-lg bg-green-100 text-green-800 font-bold">
				Success! Everything is working.
			</div>
			<div class="px-4 py-2 rounded-lg bg-red-100 text-red-800 font-bold">
				Error! Something went wrong.
			</div>
			<div class="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800 font-bold">
				Warning! Check your input.
			</div>
			<span class="px-3 py-1 rounded-full bg-brand-500 text-white font-bold">New</span>
			<span class="px-3 py-1 rounded-full bg-gray-300 text-gray-900 font-bold">Beta</span>
			<span class="px-3 py-1 rounded-full bg-purple-500 text-white font-bold">Pro</span>
		</div>
	</div>

	<footer class="mt-12 text-center text-gray-500 dark:text-gray-400">
		<p>RipTicket Theme Demo &copy; 2025</p>
	</footer>
</div>
