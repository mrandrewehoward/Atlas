<script lang="ts">
import favicon from '$lib/assets/favicon.ico';
import '../app.css';
import ProjectList from '$lib/components/ProjectList.svelte';
import TaskList from '$lib/components/TaskList.svelte';
import TaskItemList from '$lib/components/TaskItemList.svelte';
import HeaderBar from '$lib/components/HeaderBar.svelte';
import ActivityBar from '$lib/components/ActivityBar.svelte';
import SidebarAccordion from '$lib/components/SidebarAccordion.svelte';
import StatusBar from '$lib/components/StatusBar.svelte';
import TerminalPanel from '$lib/components/TerminalPanel.svelte';
import ToastContainer from '$lib/components/ToastContainer.svelte';
import LoginModal from '$lib/components/LoginModal.svelte';
import SpaceSelector from '$lib/components/SpaceSelector.svelte';
import { spaces, spacesLoading, spacesError, fetchSpaces } from '$lib/stores/spaces';
import { supabase } from '$lib/supabaseClient.js';
import { projects as projectsStore, projectsLoading, projectsError, fetchProjects } from '$lib/stores/projects';
import { onMount } from 'svelte';
import { toastStore } from '$lib/stores/toast';

// Universal CLI fun/utility messages (moved to module scope)
const motds = [
	"Welcome to Atlas! Stay curious.",
	"Tip: Use /help to see all commands.",
	"Every great project starts with a single task.",
	"Atlas: Organize your world, one task at a time.",
	"Did you hydrate today?",
	"Pro tip: /cls clears your mind and your screen.",
	"You are the architect of your own workspace.",
	"Keep calm and code on!",
	"Atlas: Where productivity meets fun.",
	"Remember to take breaks!"
];
const fortunes = [
	"You will complete your next task with ease.",
	"A bug will reveal itself soon—be ready!",
	"Happiness is a clean terminal.",
	"A new project is on your horizon.",
	"You will discover a shortcut today.",
	"Your code will compile on the first try.",
	"A cup of coffee is in your future.",
	"You will inspire a teammate.",
	"A random act of kindness will come your way.",
	"The answer you seek is in the docs."
];
function getRandom(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

onMount(() => {
	(async () => {
		const { data: { session } } = await supabase.auth.getSession();
		if (session && session.user) {
			user = {
				email: session.user.email ?? "",
				username: session.user.user_metadata?.username ?? session.user.email?.split('@')[0] ?? ""
			};
			loggedIn = true;
			await fetchUserData();
		}
		// Listen for auth state changes
		supabase.auth.onAuthStateChange((_event: any, session: any) => {
			if (session && session.user) {
				user = {
					email: session.user.email ?? "",
					username: session.user.user_metadata?.username ?? session.user.email?.split('@')[0] ?? ""
				};
				loggedIn = true;
				fetchUserData();
			} else {
				user = null;
				loggedIn = false;
				// projects = []; // now handled by store
				tasks = [];
				taskItems = [];
			}
		});
	})();
	// Show a toast when the page is ready
	toastStore.show('All items loaded', 'success');
	// Keyboard shortcut for terminal: Ctrl+` or Ctrl+T
	const keyHandler = (e: KeyboardEvent) => {
		// Ctrl+` (backtick) toggles terminal
		if (e.ctrlKey && (e.key === '`' || e.key === '~')) {
			e.preventDefault();
			terminalOpen = !terminalOpen;
			if (terminalOpen) {
				setTimeout(() => {
					const input = document.getElementById('atlas-terminal-input');
					if (input) input.focus();
				}, 0);
			}
		}
	};
	window.addEventListener('keydown', keyHandler);
	return () => window.removeEventListener('keydown', keyHandler);
});
// Stubs for missing props/vars for layout to compile

let selectedSpaceId = $state(null);
let selectedProjectIds = $state(new Set<number>());

function handleToggleProject(id: number) {
	if (selectedProjectIds.has(id)) {
		selectedProjectIds.delete(id);
	} else {
		selectedProjectIds.add(id);
	}
	// Force reactivity for Set
	selectedProjectIds = new Set(selectedProjectIds);
}
function handleSelectSpace(id: string) {
	selectedSpaceId = id;
	fetchProjects(id);
}

onMount(() => {
	fetchSpaces();
});
let sidebarSection = $state('');

async function handleLogin(e: Event) {
	e.preventDefault();
	loginError = '';
	if (!loginEmail || !loginPassword) {
		loginError = 'Email and password are required.';
		return;
	}
	if (registerMode) {
		// Registration flow
		const { error } = await supabase.auth.signUp({
			email: loginEmail,
			password: loginPassword
		});
		if (error) {
			loginError = error.message || 'Registration failed.';
		} else {
			registerMode = false;
			loginModalOpen = false;
			loginEmail = '';
			loginPassword = '';
			loginError = '';
			toastStore.show('Registration successful! Please check your email to confirm your account.', 'success');
		}
	} else {
		// Login flow
		const { error } = await supabase.auth.signInWithPassword({
			email: loginEmail,
			password: loginPassword
		});
		if (error) {
			loginError = error.message || 'Login failed.';
		} else {
			loginModalOpen = false;
			loginEmail = '';
			loginPassword = '';
			loginError = '';
		}
	}
}
function closeLogin() { loginModalOpen = false; loginEmail = ''; loginPassword = ''; loginError = ''; changePasswordMode = false; registerMode = false; }

	let { children } = $props();
	// Auth state
	let loggedIn = $state(false);
	let loginModalOpen = $state(false);
	let loginEmail = $state('');
	let loginPassword = $state('');
	let user: { email: string; username: string } | null = $state(null); // { email, username }
	let loginError = $state('');
	// let projects: any[] = $state([]); // removed, now using store
	let tasks: any[] = $state([]);
	let taskItems: any[] = $state([]);
	let terminalOpen = $state(true);
	let terminalInput = $state('');
	let terminalLines = $state([
		{ text: getTerminalWelcome(), type: 'info', blurred: false }
	]);
	let terminalInputActive = $state(false);
	let terminalBlurred = $state(false);
	let awaitingPasswordChangeConfirm = $state(false);
	let changePasswordMode = $state(false);
	let registerMode = $state(false);


	function getTerminalWelcome() {
		return 'Welcome to Atlas Workbench! Type /help for commands.';
	}

	function openLogin(changePassword = false, register = false) {
		changePasswordMode = changePassword;
		registerMode = register;
		loginModalOpen = true;
		loginEmail = '';
		loginPassword = '';
		loginError = '';
	}

	// Single, valid handleTerminalInput function
	function handleTerminalInput(e: KeyboardEvent) {
		if (e.key !== 'Enter') return;
		const cmd = terminalInput.trim();
		const cmdLower = cmd.toLowerCase();
		terminalLines = [
			...terminalLines,
			{ text: '> ' + terminalInput, type: 'input', blurred: false }
		];
		// Awaiting password change confirm
		if (awaitingPasswordChangeConfirm) {
			if (cmdLower === 'y' || cmdLower === 'yes') {
				terminalLines = [...terminalLines, { text: 'Opening password change modal...', type: 'info', blurred: false }];
				changePasswordMode = true;
				loginModalOpen = true;
			} else if (cmdLower === 'n' || cmdLower === 'no') {
				terminalLines = [...terminalLines, { text: 'Password change cancelled.', type: 'info', blurred: false }];
			} else {
				terminalLines = [...terminalLines, { text: 'Please answer y (yes) or n (no).', type: 'info', blurred: false }];
				terminalInput = '';
				setTimeout(() => scrollTerminalToBottom(), 0);
				return;
			}
			awaitingPasswordChangeConfirm = false;
			terminalInput = '';
			setTimeout(() => scrollTerminalToBottom(), 0);
			return;
		}
		// Universal CLI commands
		if (cmdLower === '/help' || cmdLower === 'help') {
			terminalLines = [...terminalLines, {
				text:
					'Universal commands:\n'
					+ '/help - Show all available commands\n'
					+ '/datetime - Show the current date and time\n'
					+ '/cls - Clear the terminal screen\n'
					+ '/whoami - Show the current user info\n'
					+ '/motd - Show a random message of the day\n'
					+ '/fortune - Show a random fortune/cookie\n'
					+ '/echo [txt] - Print text back to the terminal\n'
					+ '/about - Show info about Atlas Workbench\n'
					+ '/version - Show app version\n'
					+ '/theme - Toggle light/dark mode (future)\n\n'
					+ 'System commands:\n'
					+ '/login - Log in\n'
					+ '/logout - Log out\n'
					+ '/tasks - List your tasks\n'
					+ '/tasks -help - Show help for /tasks',
				type: 'info', blurred: false }];
		} else if (cmdLower === '/datetime') {
			terminalLines = [...terminalLines, { text: new Date().toLocaleString(), type: 'info', blurred: false }];
		} else if (cmdLower === '/cls' || cmdLower === 'cls') {
			terminalLines = [{ text: getTerminalWelcome(), type: 'info', blurred: false }];
		} else if (cmdLower === '/whoami') {
			if (user && loggedIn) {
				terminalLines = [...terminalLines, { text: `User: ${user.username} (${user.email})`, type: 'info', blurred: false }];
			} else {
				terminalLines = [...terminalLines, { text: 'Not logged in.', type: 'info', blurred: false }];
			}
		} else if (cmdLower === '/motd') {
			terminalLines = [...terminalLines, { text: getRandom(motds), type: 'info', blurred: false }];
		} else if (cmdLower === '/fortune') {
			terminalLines = [...terminalLines, { text: getRandom(fortunes), type: 'info', blurred: false }];
		} else if (cmdLower.startsWith('/echo ')) {
			terminalLines = [...terminalLines, { text: cmd.slice(6), type: 'info', blurred: false }];
		} else if (cmdLower === '/about') {
			terminalLines = [...terminalLines, { text: 'Atlas Workbench: Modular, modern, and fun. Built with SvelteKit 5, Tailwind v4, DaisyUI 5, and Supabase.', type: 'info', blurred: false }];
		} else if (cmdLower === '/version') {
			terminalLines = [...terminalLines, { text: 'Atlas version 0.1.1', type: 'info', blurred: false }];
		} else if (cmdLower === '/theme') {
			terminalLines = [...terminalLines, { text: 'Theme switching coming soon!', type: 'info', blurred: false }];
		// System commands (login state aware)
		} else if (!loggedIn) {
			if (cmdLower === 'login' || cmdLower === '/login') {
				terminalLines = [...terminalLines, { text: 'Enter credentials.', type: 'info', blurred: false }];
				openLogin();
			} else {
				terminalLines = [...terminalLines, { text: 'Unknown command.', type: 'error', blurred: false }];
			}
		} else {
			if (cmdLower === 'login' || cmdLower === '/login') {
				terminalLines = [...terminalLines, { text: 'You are already logged in. Do you want to change your password? (y/n)', type: 'info', blurred: false }];
				awaitingPasswordChangeConfirm = true;
			} else if (cmdLower === 'logout' || cmdLower === '/logout') {
				logout();
			} else if (cmdLower === '/tasks -help' || cmdLower === '/tasks --help') {
				terminalLines = [...terminalLines, {
					text: '/tasks usage:\n/tasks - List all your tasks\n/tasks -help - Show this help message',
					type: 'info', blurred: false }];
			} else if (cmdLower === '/tasks') {
				terminalLines = [...terminalLines, {
					text: 'Tasks command coming soon! (This will list your tasks.)',
					type: 'info', blurred: false }];
			} else {
				terminalLines = [...terminalLines, { text: 'Unknown command.', type: 'error', blurred: false }];
			}
		}
		terminalInput = '';
		setTimeout(() => scrollTerminalToBottom(), 0);
	}

	// (duplicate removed)
	function logout() {
		supabase.auth.signOut();
		user = null;
		loggedIn = false;
	// projects = []; // now handled by store
		tasks = [];
		taskItems = [];
		terminalBlurred = true;
		terminalLines = [
			...terminalLines.map(l => ({ ...l, blurred: true })),
			{ text: 'Logged out.', type: 'info', blurred: false }
		];
		// Keep terminal input enabled so user can type login again
	}

	// ...existing code...
	// Move fetchUserData above its first usage to fix TS error
	async function fetchUserData() {
		// Fetch projects
		const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
	// projects = projectsData || []; // now handled by store
		// Fetch tasks
		const { data: tasksData } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
		tasks = tasksData || [];
		// Fetch task items
		const { data: itemsData } = await supabase.from('items').select('*').order('created_at', { ascending: false });
		taskItems = itemsData || [];
	}

	function scrollTerminalToBottom() {
		const el = document.getElementById('atlas-terminal-scroll');
		if (el) el.scrollTop = el.scrollHeight;
	}


</script>


<svelte:head>
	<link rel="icon" href={favicon} type="image/x-icon" />
</svelte:head>


<div class="min-h-screen flex flex-col bg-base-200">
	<ToastContainer />
	<!-- Header -->
	<HeaderBar {loggedIn} onLogin={() => openLogin(false)} onLogout={logout} />
	<!-- Main layout row: Activity bar, sidebar, main, panel -->
	<div class="flex flex-1 min-h-0">
		<!-- Activity Bar -->
				<SpaceSelector on:select={e => handleSelectSpace(e.detail)} />
		<!-- Primary Side Bar (Accordion) -->
		<aside class="bg-base-100 border-r border-base-300 shadow-sm w-60 min-w-60 flex flex-col">
			<div class="flex flex-col flex-1">
				<!-- Projects section (top) -->
				<div class="flex flex-col flex-1 relative">
					{#if !selectedSpaceId}
						<div class="flex items-center justify-center h-32 text-base-content/40 italic select-none">
							Select a space to continue
						</div>
					{:else}
						<ProjectList
							projects={$projectsStore}
							selectedProjectIds={selectedProjectIds}
							onToggleProject={handleToggleProject}
							loading={$projectsLoading}
							error={$projectsError}
						/>
					{/if}
					<div class="flex-1"></div>
					{#if !loggedIn}
						<div class="absolute inset-0 z-20 bg-base-100/80"></div>
					{/if}
				</div>
				<div class="flex-1"></div>
				<!-- Bottom section: Search and Settings -->
				<SidebarAccordion {sidebarSection} setSidebarSection={s => sidebarSection = s} />
			</div>
		</aside>
		<!-- Main Editor Area -->
		<div class="flex-1 flex flex-col min-w-0">
			<div class="flex-1 flex flex-col min-w-0">
				<div class="flex flex-1 min-h-0 gap-0 relative">
					<section class="flex-1 min-w-0 border-r border-base-300 bg-base-100 flex flex-col p-0">
												<TaskList
													tasks={tasks}
													onEdit={() => {}}
													onDelete={() => {}}
													onToggle={() => {}}
													loading={false}
													error={''}
												/>
					</section>
					<section class="flex-1 min-w-0 bg-base-100 flex flex-col p-0">
												<TaskItemList
													items={taskItems}
													onEdit={() => {}}
													onDelete={() => {}}
													onToggle={() => {}}
													loading={false}
													error={''}
												/>
						<!-- {@render children()} -->
					</section>
					{#if !loggedIn}
						<div class="absolute inset-0 z-20 flex items-center justify-center bg-base-100/80">
							<button class="btn btn-primary btn-lg" onclick={() => openLogin(false)}>Sign in to view your workspace</button>
						</div>
					{/if}
				</div>
			</div>
			<!-- Terminal Panel always at the bottom -->
			<TerminalPanel
				lines={terminalLines}
				input={terminalInput}
				inputActive={terminalInputActive}
				open={terminalOpen}
				onInput={handleTerminalInput}
				onInputChange={v => terminalInput = v}
				onFocus={() => terminalInputActive = true}
				onBlur={() => terminalInputActive = false}
				onToggle={() => terminalOpen = !terminalOpen}
			/>
			<LoginModal
				open={loginModalOpen}
				changePasswordMode={changePasswordMode}
				registerMode={registerMode}
				loginEmail={loginEmail}
				loginPassword={loginPassword}
				loginError={loginError}
				onEmailChange={v => loginEmail = v}
				onPasswordChange={v => loginPassword = v}
				onSubmit={handleLogin}
				onCancel={() => { closeLogin(); registerMode = false; }}
				onRegister={() => { registerMode = true; loginError = ''; }}
			/>
		</div>
	</div>
	<!-- Status Bar -->
	<StatusBar {loggedIn} {user} projects={$projectsStore} {tasks} {taskItems} />
</div>
