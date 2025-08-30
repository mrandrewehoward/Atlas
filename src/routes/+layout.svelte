

<script>
	import favicon from '$lib/assets/favicon.ico';
	import '../app.css';
	import ProjectsPanel from '$lib/components/ProjectsPanel.svelte';
	import TasksPanel from '$lib/components/TasksPanel.svelte';
	import TaskItemsPanel from '$lib/components/TaskItemsPanel.svelte';
	import { supabase } from '$lib/supabaseClient.js';
	let { children } = $props();
	// Auth state
	let loggedIn = $state(false);
	let loginModalOpen = $state(false);
	let loginEmail = $state('');
	let loginPassword = $state('');
	let user = $state(null); // { email, username }
	let loginError = $state('');
	let projects = $state([]);
	let tasks = $state([]);
	let taskItems = $state([]);
	let terminalOpen = $state(true);
	let sidebarSection = $state('projects');
	const spaces = [
		{ id: 1, name: 'Home' },
		{ id: 2, name: 'Work' },
		{ id: 3, name: 'Camping' }
	];
	function getAbbreviation(name) {
		return name
			.split(/\s+/)
			.map(word => word.slice(0, 2).toUpperCase())
			.join('');
	}
	function openLogin() {
		loginModalOpen = true;
	}
	function closeLogin() {
		loginModalOpen = false;
	}
	async function handleLogin(e) {
		e.preventDefault();
		loginError = '';
		const { data, error } = await supabase.auth.signInWithPassword({
			email: loginEmail,
			password: loginPassword
		});
		if (error) {
			loginError = error.message;
			return;
		}
		// Get user info
		user = data.user ? { email: data.user.email, username: data.user.user_metadata?.username || data.user.email.split('@')[0] } : null;
		loggedIn = true;
		loginModalOpen = false;
		// Fetch user data
		await fetchUserData();
	}

	async function fetchUserData() {
		// Fetch projects
		const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
		projects = projectsData || [];
		// Fetch tasks
		const { data: tasksData } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
		tasks = tasksData || [];
		// Fetch task items
		const { data: itemsData } = await supabase.from('items').select('*').order('created_at', { ascending: false });
		taskItems = itemsData || [];
	}
	function logout() {
		supabase.auth.signOut();
		user = null;
		loggedIn = false;
		projects = [];
		tasks = [];
		taskItems = [];
	}
</script>


<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>


<div class="min-h-screen flex flex-col bg-base-200">
	<!-- Header -->
	<header class="h-14 flex items-center px-6 bg-base-100 border-b border-base-300 shadow-sm z-20 sticky top-0">
		<div class="flex items-center gap-4 flex-1">
			<span class="font-mono text-xl font-bold text-emerald-700">Atlas</span>
			<nav class="hidden md:flex gap-2 ml-6">
				<a href="/" class="btn btn-ghost btn-sm rounded-btn">Dashboard</a>
				<a href="/projects" class="btn btn-ghost btn-sm rounded-btn">Projects</a>
				<a href="/settings" class="btn btn-ghost btn-sm rounded-btn">Settings</a>
			</nav>
		</div>
		<div class="flex items-center gap-2">
			{#if !loggedIn}
				<button class="btn btn-accent btn-sm" onclick={openLogin}>Login</button>
			{:else}
				<button class="btn btn-ghost btn-sm" onclick={logout}>Logout</button>
			{/if}
		</div>
	</header>
	<!-- Main layout row: Activity bar, sidebar, main, panel -->
	<div class="flex flex-1 min-h-0">
		<!-- Activity Bar -->
				<nav class="flex flex-col items-center gap-4 py-4 px-1 bg-base-100 border-r border-base-300 shadow-sm w-14 min-w-14" aria-label="Spaces Bar">
					{#each spaces as space}
						<button class="btn btn-ghost btn-circle w-10 h-10 flex items-center justify-center text-xs font-bold" aria-label={space.name} tabindex="0">
							{getAbbreviation(space.name)}
						</button>
					{/each}
			<!-- nav closed above after spaces bar -->
		</nav>
		<!-- Primary Side Bar (Accordion) -->
		<aside class="bg-base-100 border-r border-base-300 shadow-sm w-60 min-w-60 flex flex-col">
			<div class="flex flex-col flex-1">
				<!-- Projects section (top) -->
				<div class="flex flex-col flex-1 relative">
					<ProjectsPanel />
					<div class="flex-1"></div>
					{#if !loggedIn}
						<div class="absolute inset-0 z-20 bg-base-100/80"></div>
					{/if}
				</div>
				<div class="flex-1"></div>
				<!-- Bottom section: Search and Settings -->
				<div class="flex flex-col gap-0 pb-2">
					<div>
						<button class="w-full text-left px-4 py-2 font-bold text-base-content bg-base-100 hover:bg-base-200 transition flex items-center" aria-expanded={sidebarSection==='search'} onclick={() => sidebarSection = (sidebarSection==='search' ? '' : 'search')}>
							<span class="mr-2 text-xs font-mono">{sidebarSection==='search' ? 'v' : '>'}</span>
							<span>Search</span>
						</button>
						{#if sidebarSection==='search'}
							<div class="p-4 bg-base-100 border-t border-base-300 animate-fade-in-up">
								<input class="input input-bordered input-sm w-full" placeholder="Search..." />
								<div class="mt-2 text-xs text-base-content/70">No results.</div>
							</div>
						{/if}
					</div>
					<div>
						<button class="w-full text-left px-4 py-2 font-bold text-base-content bg-base-100 hover:bg-base-200 transition flex items-center" aria-expanded={sidebarSection==='settings'} onclick={() => sidebarSection = (sidebarSection==='settings' ? '' : 'settings')}>
							<span class="mr-2 text-xs font-mono">{sidebarSection==='settings' ? 'v' : '>'}</span>
							<span>Settings</span>
						</button>
						{#if sidebarSection==='settings'}
							<div class="p-4 bg-base-100 border-t border-base-300 animate-fade-in-up">
								<div class="text-xs text-base-content/70">Settings panel.</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</aside>
		<!-- Main Editor Area -->
		<div class="flex-1 flex flex-col min-w-0">
			<div class="flex-1 flex flex-col min-w-0">
				<div class="flex flex-1 min-h-0 gap-0 relative">
					<section class="flex-1 min-w-0 border-r border-base-300 bg-base-100 flex flex-col p-0">
						<TasksPanel />
					</section>
					<section class="flex-1 min-w-0 bg-base-100 flex flex-col p-0">
						<TaskItemsPanel />
					</section>
					{#if !loggedIn}
						<div class="absolute inset-0 z-20 flex items-center justify-center bg-base-100/80">
							<button class="btn btn-accent btn-lg" onclick={openLogin}>Sign in to view your workspace</button>
						</div>
					{/if}
				</div>
			</div>
			<!-- Terminal Panel always at the bottom -->
			<div class="relative w-full select-none">
				<div class="w-full border-t border-base-300">
					<button type="button"
						class="flex items-center w-full px-4 h-8 bg-base-200 text-base-content font-mono text-xs border-b border-base-300 cursor-pointer select-none"
						onclick={() => terminalOpen = !terminalOpen}
						aria-label="Toggle terminal"
						onkeydown={e => (e.key === 'Enter' || e.key === ' ') && (terminalOpen = !terminalOpen)}>
						<span class="flex-1">TERMINAL</span>
						<span class="text-xs">{terminalOpen ? '▼' : '▲'}</span>
					</button>
				</div>
				<div class="overflow-hidden transition-all duration-300 bg-base-200 border-t border-base-300"
					style="height: {terminalOpen ? '160px' : '0'};">
					<div class="h-full p-3 text-xs font-mono">Terminal output here...</div>
				</div>
			</div>
			<!-- Login Modal -->
			{#if loginModalOpen && !loggedIn}
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-base-300/60">
					<form class="bg-base-200 border border-base-300 rounded-lg shadow-lg p-8 flex flex-col gap-6 w-full max-w-xs animate-fade-in-up" onsubmit={handleLogin}>
						<h2 class="text-xl font-bold text-center text-emerald-700">Sign In</h2>
						<input class="input input-accent input-bordered" type="email" placeholder="Email" aria-label="Email" bind:value={loginEmail} required autofocus />
						<input class="input input-accent input-bordered" type="password" placeholder="Password" aria-label="Password" bind:value={loginPassword} required />
						{#if loginError}
							<div class="text-error text-xs text-center">{loginError}</div>
						{/if}
						<button class="btn btn-accent w-full mt-2" type="submit">Sign In</button>
						<button class="btn btn-ghost w-full mt-2" type="button" onclick={closeLogin}>Cancel</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
	<!-- Status Bar -->
	<footer class="h-7 bg-base-300 text-base-content flex items-center px-4 text-xs border-t border-base-200 select-none">
		{#if loggedIn && user}
			<span class="mr-4 font-mono">{user.username} ({user.email})</span>
			<span class="mr-4">Projects: {projects.length}</span>
			<span class="mr-4">Tasks: {tasks.length}</span>
			<span class="mr-4">Task Items: {taskItems.length}</span>
		{:else}
			<span class="mr-4">Ln 1, Col 1</span>
			<span class="mr-4">Spaces: 2</span>
			<span class="mr-4">UTF-8</span>
			<span class="mr-4">Git: main</span>
		{/if}
		<span class="ml-auto">Emerald Light Mode</span>
	</footer>
</div>
