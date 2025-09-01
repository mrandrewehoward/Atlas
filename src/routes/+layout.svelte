<script lang="ts">
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
import type { Space } from '$lib/types';
import { addSpace, deleteSpace, updateSpace } from '$lib/stores/spaces';
import { registerCliHandler } from '$lib/cli/cliParser';
import { spacesCliHandler } from '$lib/cli/spacesCliHandler';

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
			tasks.set([]);
			loggedIn = true;
			// Only fetch items for selected task
			if (selectedTaskId) {
				await fetchTaskItems(selectedTaskId);
			} else {
				taskItems.set([]);
			}
		}
		// Listen for auth state changes
		supabase.auth.onAuthStateChange((_event: any, session: any) => {
			if (session && session.user) {
				user = {
					email: session.user.email ?? "",
					username: session.user.user_metadata?.username ?? session.user.email?.split('@')[0] ?? ""
				};
				loggedIn = true;
				if (selectedTaskId) {
					fetchTaskItems(selectedTaskId);
				} else {
					taskItems.set([]);
				}
			} else {
				user = null;
				loggedIn = false;
				// projects = []; // now handled by store
				tasks.set([]);
				taskItems.set([]);
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


let selectedSpaceId = $state<string|null>(null);
let selectedProjectIds = $state(new Set<string>());
let selectedProjectId = $state<string|null>(null);
let selectedTaskId = $state<string|null>(null);
// --- CLI mode system ---
let cliMode: null | 'spaces' | 'projects' | 'tasks' | 'items' = null;


import { tasks, tasksLoading, tasksError, fetchTasks } from '$lib/stores/tasks';
import { taskItems, taskItemsLoading, taskItemsError, fetchTaskItems } from '$lib/stores/taskItems';

function handleToggleProject(id: string) {
	if (selectedProjectIds.has(id)) {
		selectedProjectIds.delete(id);
		if (selectedProjectId === id) {
			selectedProjectId = null;
			tasks.set([]);
			localStorage.removeItem('selectedProjectId');
			// Drill reset: clear task and task item selection
			selectedTaskId = null;
			localStorage.removeItem('selectedTaskId');
			taskItems.set([]);
		}
	} else {
		selectedProjectIds.add(id);
		selectedProjectId = id;
		fetchTasks(id);
		localStorage.setItem('selectedProjectId', id);
		// Drill reset: clear task and task item selection
		selectedTaskId = null;
		localStorage.removeItem('selectedTaskId');
		taskItems.set([]);
	}
	selectedProjectIds = new Set(selectedProjectIds);
}

function handleToggleTask(id: string) {
	if (selectedTaskId === id) {
		selectedTaskId = null;
		localStorage.removeItem('selectedTaskId');
		taskItems.set([]);
	} else {
		selectedTaskId = id;
		localStorage.setItem('selectedTaskId', id);
		fetchTaskItems(id);
		// Drill reset: clear task item selection (if you add deeper levels in future)
		// (No deeper entity now, so just clear items)
	}
}
function handleSelectSpace(id: string) {
	selectedSpaceId = id;
	localStorage.setItem('selectedSpaceId', id);
	fetchProjects(id);
	selectedProjectId = null;
	selectedProjectIds = new Set();
	localStorage.removeItem('selectedProjectId');
	selectedTaskId = null;
	localStorage.removeItem('selectedTaskId');
	tasks.set([]);
	// Drill reset: clear task items when switching space
	taskItems.set([]);
}

import { get } from 'svelte/store';
onMount(() => {
	console.log('[Atlas] onMount: restoring selection from localStorage');
	// Restore selected space, project, and task from localStorage
	const storedSpaceId = localStorage.getItem('selectedSpaceId');
	const storedProjectId = localStorage.getItem('selectedProjectId');
	const storedTaskId = localStorage.getItem('selectedTaskId');
	fetchSpaces().then(() => {
		// Use the spaces as already sorted by order+alpha from the store
		let spacesArr = get(spaces);
		if (spacesArr && spacesArr.length > 0) {
			selectedSpaceId = spacesArr[0].id;
			localStorage.setItem('selectedSpaceId', selectedSpaceId);
			fetchProjects(selectedSpaceId).then(() => {
				if (storedProjectId) {
					const id = storedProjectId;
					selectedProjectId = id;
					selectedProjectIds.add(id);
					fetchTasks(id).then(() => {
						if (storedTaskId) {
							selectedTaskId = storedTaskId;
							fetchTaskItems(storedTaskId);
						}
					});
					selectedProjectIds = new Set(selectedProjectIds);
				}
			});
		}
	});

	// Fallback: if a project is selected but tasks are empty and not loading, fetch tasks
	setTimeout(() => {
		if (selectedProjectId && get(tasks).length === 0 && !get(tasksLoading)) {
			fetchTasks(selectedProjectId);
		}
		// Fallback: if a task is selected but taskItems are empty and not loading, fetch taskItems
		if (selectedTaskId && get(taskItems).length === 0 && !get(taskItemsLoading)) {
			fetchTaskItems(selectedTaskId);
		}
	}, 0);
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
            // On successful login, select first space and first project (if any), no task
            loginModalOpen = false;
            loginEmail = '';
            loginPassword = '';
            loginError = '';
            // Wait for spaces to load, then select first
			setTimeout(() => {
				const spacesArr = get(spaces);
				if (spacesArr && spacesArr.length > 0) {
					selectedSpaceId = spacesArr[0].id;
					localStorage.setItem('selectedSpaceId', selectedSpaceId);
					fetchProjects(selectedSpaceId).then(() => {
						const projectsArr = get(projectsStore);
						if (projectsArr && projectsArr.length > 0) {
							selectedProjectId = projectsArr[0].id;
							selectedProjectIds = new Set([selectedProjectId]);
							localStorage.setItem('selectedProjectId', selectedProjectId);
							// Do not select a task
							selectedTaskId = null;
							localStorage.removeItem('selectedTaskId');
							tasks.set([]);
							taskItems.set([]);
						} else {
							selectedProjectId = null;
							selectedProjectIds = new Set();
							localStorage.removeItem('selectedProjectId');
							selectedTaskId = null;
							localStorage.removeItem('selectedTaskId');
							tasks.set([]);
							taskItems.set([]);
						}
					});
				} else {
					selectedSpaceId = null;
					localStorage.removeItem('selectedSpaceId');
					selectedProjectId = null;
					selectedProjectIds = new Set();
					localStorage.removeItem('selectedProjectId');
					selectedTaskId = null;
					localStorage.removeItem('selectedTaskId');
					tasks.set([]);
					taskItems.set([]);
				}
			}, 0);
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
	// let tasks: any[] = $state([]); // removed, now using store
	// let taskItems: any[] = $state([]); // removed, now using store
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

		// --- CLI context stack routing ---
		if (cliContextStack.length > 0) {
			const ctx = cliContextStack[cliContextStack.length - 1];
			if (cmdLower === 'help' || cmdLower === '/help' || cmdLower === '-h' || cmdLower === '--help') {
				// Contextual help for current mode
				if (ctx.mode === 'spaces') {
					terminalLines = [...terminalLines, { text:
`/spaces area commands:\n\nls - List all spaces\nsel n - Select space by number\nfields - List fields for selected space\nadd - Add a new space (prompts for fields)\nadd -d "Title" - Add a new space with name/title\ndel n - Delete space n (confirmation)\norder n up/down - Move space n up or down\nstats n - Show stats/details for space n\nsearch term - Search spaces\nback - Return to previous menu\nexit - Exit terminal\n\nAll commands are case-insensitive. See docs/cli-commands.md for full reference.`, type: 'info', blurred: false }];
					terminalInput = '';
					setTimeout(() => scrollTerminalToBottom(), 0);
					return;
				}
				// Future: add help for other entity modes
			}
			if (ctx.mode === 'spaces') {
				// If user types back/exit, pop context
				if (cmdLower === 'back' || cmdLower === 'exit') {
					popCliContext();
					terminalLines = [...terminalLines, { text: 'Exited /spaces mode.', type: 'info', blurred: false }];
				} else {
					handleSpacesCommand(cmd, ctx);
				}
				terminalInput = '';
				setTimeout(() => scrollTerminalToBottom(), 0);
				return;
			}
			// Future: handle other entity modes (projects, tasks, etc.)
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
					+ '/spaces - Manage spaces (type /spaces -h for help)\n'
					+ '/projects - Manage projects\n'
					+ '/tasks - Manage tasks\n'
					+ '/items - Manage items\n'
					+ '/settings - App/user settings\n'
					+ '/user - User info',
				type: 'info', blurred: false }];
		} else if (cmdLower.startsWith('/spaces')) {
			// Enter spaces mode
			pushCliContext('spaces');
			terminalLines = [...terminalLines, { text: 'Entered /spaces mode. Type "back" or "exit" to leave.', type: 'info', blurred: false }];
			const rest = cmd.replace(/^\/spaces\s*/i, '').trim();
			if (rest) handleSpacesCommand(rest, cliContextStack[cliContextStack.length - 1]);
		} else {
			terminalLines = [...terminalLines, { text: 'Unknown command.', type: 'error', blurred: false }];
		}
		terminalInput = '';
		setTimeout(() => scrollTerminalToBottom(), 0);
	}

	function logout() {
    supabase.auth.signOut();
    user = null;
    loggedIn = false;
    // Clear all selection state from localStorage and variables
    localStorage.removeItem('selectedSpaceId');
    localStorage.removeItem('selectedProjectId');
    localStorage.removeItem('selectedTaskId');
    selectedSpaceId = null;
    selectedProjectId = null;
    selectedProjectIds = new Set();
    selectedTaskId = null;
    tasks.set([]);
    taskItems.set([]);
    terminalBlurred = true;
    terminalLines = [
        ...terminalLines.map(l => ({ ...l, blurred: true })),
        { text: 'Logged out.', type: 'info', blurred: false }
    ];
    // Keep terminal input enabled so user can type login again
}

// Move fetchUserData above its first usage to fix TS error
	async function fetchUserData() {
		// Fetch projects
		const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
		// projects = projectsData || []; // now handled by store
		// Do NOT fetch all tasks globally here; tasks are loaded per project
		// Fetch task items (if needed globally)
		const { data: itemsData } = await supabase.from('items').select('*').order('created_at', { ascending: false });
		taskItems.set(itemsData || []);
	}

	function scrollTerminalToBottom() {
		const el = document.getElementById('atlas-terminal-scroll');
		if (el) el.scrollTop = el.scrollHeight;
	}

	// --- CLI context stack for drill-down navigation ---
	// Each stack frame: { mode: string, data?: any }
	let cliContextStack: Array<{ mode: string, data?: any }> = [];

	function pushCliContext(mode: string, data?: any) {
		cliContextStack.push({ mode, data });
		cliMode = mode as any;
	}
	function popCliContext() {
		cliContextStack.pop();
		cliMode = cliContextStack.length > 0 ? cliContextStack[cliContextStack.length - 1].mode as any : null;
	}
	function resetCliContext() {
		cliContextStack = [];
		cliMode = null;
	}

	// --- /spaces command dispatcher ---
	function handleSpacesCommand(cmd: string, ctx?: { mode: string, data?: any }) {
		// Remove leading /spaces (case-insensitive) if present
		const rest = cmd.replace(/^\/spaces\s*/i, '').trim();
		const args = rest.match(/(?:"[^"]*"|[^\s"]+)/g) || [];
		const spacesArr = get(spaces);
		// Context: top-level (list spaces)
		if (!ctx?.data || ctx.data.level === 'spaces') {
			if (args.length === 0 || args[0].toLowerCase() === 'ls') {
				if (!spacesArr || spacesArr.length === 0) {
					terminalLines = [...terminalLines, { text: 'No spaces found.', type: 'info', blurred: false }];
					return;
				}
				let out = 'Spaces:\n';
				spacesArr.forEach((s, i) => {
					out += `${i + 1}. ${s.name} (order: ${s.order ?? '-'})\n`;
				});
				terminalLines = [...terminalLines, { text: out.trim(), type: 'info', blurred: false }];
				return;
			}
			// sel n: drill into space details
			if (args[0].toLowerCase() === 'sel' && args[1]) {
				const n = parseInt(args[1]);
				if (!spacesArr || isNaN(n) || n < 1 || n > spacesArr.length) {
					terminalLines = [...terminalLines, { text: 'Invalid space number.', type: 'error', blurred: false }];
					return;
				}
				const selected = spacesArr[n - 1];
				pushCliContext('spaces', { level: 'spaceDetails', space: selected });
				terminalLines = [...terminalLines, { text: `Selected: ${selected.name}\nType 'fields' to list fields, 'back' to return.`, type: 'success', blurred: false }];
				return;
			}
			// add -d "Title"
			if (args[0].toLowerCase() === 'add') {
				if (args[1] && args[1] === '-d' && args[2]) {
					const title = args.slice(2).join(' ').replace(/^"|"$/g, '');
					addSpace(title);
					terminalLines = [...terminalLines, { text: `Space '${title}' added.`, type: 'success', blurred: false }];
					return;
				}
				// Interactive add (not implemented: would require async input mode)
				terminalLines = [...terminalLines, { text: 'Interactive add not implemented. Use add -d "Title".', type: 'info', blurred: false }];
				return;
			}
			// del n
			if (args[0].toLowerCase() === 'del' && args[1]) {
				const n = parseInt(args[1]);
				if (!spacesArr || isNaN(n) || n < 1 || n > spacesArr.length) {
					terminalLines = [...terminalLines, { text: 'Invalid space number.', type: 'error', blurred: false }];
					return;
				}
				deleteSpace(spacesArr[n - 1]);
				terminalLines = [...terminalLines, { text: `Space '${spacesArr[n - 1].name}' deleted.`, type: 'success', blurred: false }];
				return;
			}
		}
		// Context: spaceDetails (fields)
		if (ctx?.data?.level === 'spaceDetails') {
			const space = ctx.data.space;
			if (args[0].toLowerCase() === 'fields') {
				let out = 'Fields:\n1. name\n2. order';
				terminalLines = [...terminalLines, { text: out, type: 'info', blurred: false }];
				return;
			}
			// sel n: select field
			if (args[0].toLowerCase() === 'sel' && args[1]) {
				const n = parseInt(args[1]);
				if (n === 1) {
					pushCliContext('spaces', { level: 'fieldDetails', space, field: 'name' });
					terminalLines = [...terminalLines, { text: `Field: name\nCurrent value: ${space.name}\nType 'edit "NewName"' to change, or 'back' to return.`, type: 'info', blurred: false }];
					return;
				} else if (n === 2) {
					pushCliContext('spaces', { level: 'fieldDetails', space, field: 'order' });
					terminalLines = [...terminalLines, { text: `Field: order\nCurrent value: ${space.order ?? '-'}\nType 'edit <number>' to change, or 'back' to return.`, type: 'info', blurred: false }];
					return;
				} else {
					terminalLines = [...terminalLines, { text: 'Invalid field number.', type: 'error', blurred: false }];
					return;
				}
			}
			if (args[0].toLowerCase() === 'back' || args[0].toLowerCase() === 'exit') {
				popCliContext();
				return;
			}
			terminalLines = [...terminalLines, { text: "Unknown command in space details. Type 'fields', 'sel n', 'back'.", type: 'error', blurred: false }];
			return;
		}
		// Context: fieldDetails (edit field)
		if (ctx?.data?.level === 'fieldDetails') {
			const { space, field } = ctx.data;
			if (args[0].toLowerCase() === 'edit' && args[1]) {
				const value = args.slice(1).join(' ').replace(/^"|"$/g, '');
				updateSpace(space, { [field]: field === 'order' ? Number(value) : value });
				terminalLines = [...terminalLines, { text: `Field '${field}' updated to '${value}'.`, type: 'success', blurred: false }];
				popCliContext();
				return;
			}
			if (args[0].toLowerCase() === 'back' || args[0].toLowerCase() === 'exit') {
				popCliContext();
				return;
			}
			terminalLines = [...terminalLines, { text: "Unknown command in field details. Type 'edit <value>' or 'back'.", type: 'error', blurred: false }];
			return;
		}
		terminalLines = [...terminalLines, { text: 'Unknown /spaces command. Type /spaces -h for help.', type: 'error', blurred: false }];
	}

registerCliHandler('spaces', spacesCliHandler);
</script>


<svelte:head>
	<link rel="icon" href="/favicon.ico" type="image/x-icon" />
</svelte:head>



<div class="min-h-screen flex flex-col bg-base-200">
	<ToastContainer />
	<!-- Header -->
	<HeaderBar {loggedIn} onLogin={() => openLogin(false)} onLogout={logout} />
	<!-- Main layout row: Activity bar, sidebar, main, panel -->
	<div class="flex flex-1 min-h-0">
		<!-- Activity Bar -->
			<SpaceSelector selectedId={selectedSpaceId} {loggedIn} on:select={e => handleSelectSpace(e.detail)} />
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
								selectedId={selectedProjectId}
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
								tasks={$tasks}
								selectedId={selectedTaskId}
								onEdit={() => {}}
								onDelete={() => {}}
								onToggle={handleToggleTask}
								loading={$tasksLoading}
								error={$tasksError}
							/>
					</section>
								<section class="flex-1 min-w-0 bg-base-100 flex flex-col p-0">
									<TaskItemList
										items={$taskItems}
										onEdit={() => {}}
										onDelete={() => {}}
										onToggle={() => {}}
										loading={$taskItemsLoading}
										error={$taskItemsError}
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
			<StatusBar {loggedIn} {user} projects={$projectsStore} tasks={$tasks} taskItems={$taskItems} />
		</div>
	</div>
<!-- Close main layout container -->
</div>
