<script lang="ts">
import '../app.css';
import ProjectList from '$lib/components/ProjectList.svelte';
import EntityPropertiesPanel from '$lib/components/EntityPropertiesPanel.svelte';
import TasksPropertiesForm from '$lib/components/TasksPropertiesForm.svelte';
import TaskItemsPropertiesForm from '$lib/components/TaskItemsPropertiesForm.svelte';
import { propertiesPanelOpen, propertiesPanelType, propertiesPanelEntity, openPropertiesPanel, closePropertiesPanel } from '$lib/stores/uiStore';
import { addTask, updateTask, deleteTask } from '$lib/stores/tasks';
import { addTaskItem, updateTaskItem, deleteTaskItem } from '$lib/stores/taskItems';
// State for entity properties panel
// Properties panel state now in uiStore
import ProjectsPropertiesForm from '$lib/components/ProjectsPropertiesForm.svelte';
import TaskList from '$lib/components/TaskList.svelte';
import TaskItemList from '$lib/components/TaskItemList.svelte';
// Removed duplicate import of toastStore
import HeaderBar from '$lib/components/HeaderBar.svelte';
import ActivityBar from '$lib/components/ActivityBar.svelte';
import SidebarAccordion from '$lib/components/SidebarAccordion.svelte';
import StatusBar from '$lib/components/StatusBar.svelte';
import TerminalPanel from '$lib/components/TerminalPanel.svelte';
import ToastContainer from '$lib/components/ToastContainer.svelte';
import LoginModal from '$lib/components/LoginModal.svelte';
import SpaceSelector from '$lib/components/SpaceSelector.svelte';
import { spaces, spacesLoading, spacesError, fetchSpaces } from '$lib/stores/spaces';
import { supabase } from '$lib/supabaseClient';
import { projects as projectsStore, projectsLoading, projectsError, fetchProjects } from '$lib/stores/projects';
import { projects, addProject, updateProject, deleteProject } from '$lib/stores/projects';
import { onMount } from 'svelte';
import {
	selectedSpaceId,
	selectedProjectIds,
	selectedProjectId,
	selectedTaskId,
	sidebarSection,
	terminalOpen,
	terminalInput,
	terminalLines,
	terminalInputActive,
	terminalBlurred,
	loginModalOpen,
	loginEmail,
	loginPassword,
	loginError,
	loggedIn,
	user,
	changePasswordMode,
	registerMode,
	awaitingPasswordChangeConfirm
} from '$lib/stores/uiStore';
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
	// ...removed debug logging...
		if (session && session.user) {
			// ...removed debug logging...
			user.set({
				email: session.user.email ?? "",
				username: session.user.user_metadata?.username ?? session.user.email?.split('@')[0] ?? ""
			});
			tasks.set([]);
			loggedIn.set(true);
			// Only fetch items for selected task
			if ($selectedTaskId) {
				await fetchTaskItems($selectedTaskId);
			} else {
				taskItems.set([]);
			}
		} else {
			// ...removed debug logging...
			loggedIn.set(false);
		}
		// Listen for auth state changes
		supabase.auth.onAuthStateChange((event: any, session: any) => {
			// ...removed debug logging...
			if (session && session.user) {
				// ...removed debug logging...
				user.set({
					email: session.user.email ?? "",
					username: session.user.user_metadata?.username ?? session.user.email?.split('@')[0] ?? ""
				});
				loggedIn.set(true);
				if ($selectedTaskId) {
					fetchTaskItems($selectedTaskId);
				} else {
					taskItems.set([]);
				}
			} else {
				// ...removed debug logging...
				user.set(null);
				loggedIn.set(false);
				tasks.set([]);
				taskItems.set([]);
			}
		});
	})();
	// Show a toast when the page is ready
	toastStore.show('All items loaded', 'success');
	// Keyboard shortcut for terminal: Ctrl+` or Ctrl+T
	const keyHandler = (e: KeyboardEvent) => {
		if (e.ctrlKey && (e.key === '`' || e.key === '~')) {
			e.preventDefault();
			if ($terminalOpen) {
				// If already open, just focus input
				setTimeout(() => {
					const input = document.getElementById('atlas-terminal-input');
					if (input) input.focus();
				}, 0);
			} else {
				terminalOpen.set(true);
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


// --- CLI mode system ---
let cliMode: null | 'spaces' | 'projects' | 'tasks' | 'items' = null;


import { tasks, tasksLoading, tasksError, fetchTasks } from '$lib/stores/tasks';
import { taskItems, taskItemsLoading, taskItemsError, fetchTaskItems } from '$lib/stores/taskItems';

function handleToggleProject(id: string) {
	const ids = new Set($selectedProjectIds);
	if (ids.has(id)) {
		ids.delete(id);
		if ($selectedProjectId === id) {
			selectedProjectId.set(null);
			tasks.set([]);
			localStorage.removeItem('selectedProjectId');
			selectedTaskId.set(null);
			localStorage.removeItem('selectedTaskId');
			taskItems.set([]);
		}
	} else {
		ids.add(id);
		selectedProjectId.set(id);
		fetchTasks(id);
		localStorage.setItem('selectedProjectId', id);
		selectedTaskId.set(null);
		localStorage.removeItem('selectedTaskId');
		taskItems.set([]);
	}
	selectedProjectIds.set(new Set(ids));
}

function handleToggleTask(id: string) {
	if ($selectedTaskId === id) {
		selectedTaskId.set(null);
		localStorage.removeItem('selectedTaskId');
		taskItems.set([]);
	} else {
		selectedTaskId.set(id);
		localStorage.setItem('selectedTaskId', id);
		fetchTaskItems(id);
	}
}
function handleSelectSpace(id: string) {
	selectedSpaceId.set(id);
	localStorage.setItem('selectedSpaceId', id);
	fetchProjects(id);
	selectedProjectId.set(null);
	selectedProjectIds.set(new Set());
	localStorage.removeItem('selectedProjectId');
	selectedTaskId.set(null);
	localStorage.removeItem('selectedTaskId');
	tasks.set([]);
	taskItems.set([]);
}

// Select a project and load its tasks (used by ProjectList on:select)
function handleSelectProject(id: string) {
	selectedProjectId.set(id);
	fetchTasks(id);
}

import { get } from 'svelte/store';
onMount(() => {
	// ...removed debug logging...
	const storedSpaceId = localStorage.getItem('selectedSpaceId');
	const storedProjectId = localStorage.getItem('selectedProjectId');
	const storedTaskId = localStorage.getItem('selectedTaskId');
	fetchSpaces().then(() => {
		let spacesArr = get(spaces);
		if (spacesArr && spacesArr.length > 0) {
			selectedSpaceId.set(spacesArr[0].id);
			localStorage.setItem('selectedSpaceId', spacesArr[0].id);
			fetchProjects(spacesArr[0].id).then(() => {
				if (storedProjectId) {
					const id = storedProjectId;
					selectedProjectId.set(id);
					const ids = new Set($selectedProjectIds);
					ids.add(id);
					selectedProjectIds.set(ids);
					fetchTasks(id).then(() => {
						if (storedTaskId) {
							selectedTaskId.set(storedTaskId);
							fetchTaskItems(storedTaskId);
						}
					});
				}
			});
		}
	});
	setTimeout(() => {
		if ($selectedProjectId && get(tasks).length === 0 && !get(tasksLoading)) {
			fetchTasks($selectedProjectId);
		}
		if ($selectedTaskId && get(taskItems).length === 0 && !get(taskItemsLoading)) {
			fetchTaskItems($selectedTaskId);
		}
	}, 0);
});
// sidebarSection now from store

async function handleLogin(e: Event) {
    e.preventDefault();
	loginError.set('');
	if (!$loginEmail || !$loginPassword) {
		loginError.set('Email and password are required.');
		return;
	}
	if ($registerMode) {
		const { error } = await supabase.auth.signUp({
			email: $loginEmail,
			password: $loginPassword
		});
		if (error) {
			loginError.set(error.message || 'Registration failed.');
		} else {
			registerMode.set(false);
			loginModalOpen.set(false);
			loginEmail.set('');
			loginPassword.set('');
			loginError.set('');
			toastStore.show('Registration successful! Please check your email to confirm your account.', 'success');
		}
	} else {
		const { error } = await supabase.auth.signInWithPassword({
			email: $loginEmail,
			password: $loginPassword
		});
		if (error) {
			loginError.set(error.message || 'Login failed.');
		} else {
			loginModalOpen.set(false);
			loginEmail.set('');
			loginPassword.set('');
			loginError.set('');
			setTimeout(() => {
				const spacesArr = get(spaces);
				if (spacesArr && spacesArr.length > 0) {
					selectedSpaceId.set(spacesArr[0].id);
					localStorage.setItem('selectedSpaceId', spacesArr[0].id);
					fetchProjects(spacesArr[0].id).then(() => {
						const projectsArr = get(projectsStore);
						if (projectsArr && projectsArr.length > 0) {
							selectedProjectId.set(projectsArr[0].id);
							selectedProjectIds.set(new Set([projectsArr[0].id]));
							localStorage.setItem('selectedProjectId', projectsArr[0].id);
							selectedTaskId.set(null);
							localStorage.removeItem('selectedTaskId');
							tasks.set([]);
							taskItems.set([]);
						} else {
							selectedProjectId.set(null);
							selectedProjectIds.set(new Set());
							localStorage.removeItem('selectedProjectId');
							selectedTaskId.set(null);
							localStorage.removeItem('selectedTaskId');
							tasks.set([]);
							taskItems.set([]);
						}
					});
				} else {
					selectedSpaceId.set(null);
					localStorage.removeItem('selectedSpaceId');
					selectedProjectId.set(null);
					selectedProjectIds.set(new Set());
					localStorage.removeItem('selectedProjectId');
					selectedTaskId.set(null);
					localStorage.removeItem('selectedTaskId');
					tasks.set([]);
					taskItems.set([]);
				}
			}, 0);
		}
	}
}


function closeLogin() {
	loginModalOpen.set(false);
	loginEmail.set('');
	loginPassword.set('');
	loginError.set('');
	changePasswordMode.set(false);
	registerMode.set(false);
}

	let { children } = $props();



	function getTerminalWelcome() {
		return 'Welcome to Atlas Workbench! Type /help for commands.';
	}

	function openLogin(changePassword = false, register = false) {
		changePasswordMode.set(changePassword);
		registerMode.set(register);
		loginModalOpen.set(true);
		loginEmail.set('');
		loginPassword.set('');
		loginError.set('');
	}

	// Single, valid handleTerminalInput function
	function handleTerminalInput(e: KeyboardEvent) {
		if (e.key !== 'Enter') return;
		const cmd = $terminalInput.trim();
		const cmdLower = cmd.toLowerCase();
		terminalLines.set([
			...$terminalLines,
			{ text: '> ' + $terminalInput, type: 'input', blurred: false }
		]);

		// Awaiting password change confirm
		if ($awaitingPasswordChangeConfirm) {
			if (cmdLower === 'y' || cmdLower === 'yes') {
				terminalLines.set([...$terminalLines, { text: 'Opening password change modal...', type: 'info', blurred: false }]);
				changePasswordMode.set(true);
				loginModalOpen.set(true);
			} else if (cmdLower === 'n' || cmdLower === 'no') {
				terminalLines.set([...$terminalLines, { text: 'Password change cancelled.', type: 'info', blurred: false }]);
			} else {
				terminalLines.set([...$terminalLines, { text: 'Please answer y (yes) or n (no).', type: 'info', blurred: false }]);
				terminalInput.set('');
				setTimeout(() => scrollTerminalToBottom(), 0);
				return;
			}
			awaitingPasswordChangeConfirm.set(false);
			terminalInput.set('');
			setTimeout(() => scrollTerminalToBottom(), 0);
			return;
		}

		// --- CLI context stack routing ---
		if (cliContextStack.length > 0) {
			const ctx = cliContextStack[cliContextStack.length - 1];
			if (cmdLower === 'help' || cmdLower === '/help' || cmdLower === '-h' || cmdLower === '--help') {
				if (ctx.mode === 'spaces') {
					terminalLines.set([...$terminalLines, { text:
`/spaces area commands:\n\nls - List all spaces\nsel n - Select space by number\nfields - List fields for selected space\nadd - Add a new space (prompts for fields)\nadd -d "Title" - Add a new space with name/title\ndel n - Delete space n (confirmation)\norder n up/down - Move space n up or down\nstats n - Show stats/details for space n\nsearch term - Search spaces\nback - Return to previous menu\nexit - Exit terminal\n\nAll commands are case-insensitive. See docs/cli-commands.md for full reference.`, type: 'info', blurred: false }]);
					terminalInput.set('');
					setTimeout(() => scrollTerminalToBottom(), 0);
					return;
				}
			}
			if (ctx.mode === 'spaces') {
				if (cmdLower === 'back' || cmdLower === 'exit') {
					popCliContext();
					terminalLines.set([...$terminalLines, { text: 'Exited /spaces mode.', type: 'info', blurred: false }]);
				} else {
					handleSpacesCommand(cmd, ctx);
				}
				terminalInput.set('');
				setTimeout(() => scrollTerminalToBottom(), 0);
				return;
			}
		}

		// Universal CLI commands
		if (cmdLower === '/help' || cmdLower === 'help') {
			terminalLines.set([...$terminalLines, {
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
				type: 'info', blurred: false }]);
		} else if (cmdLower.startsWith('/spaces')) {
			pushCliContext('spaces');
			terminalLines.set([...$terminalLines, { text: 'Entered /spaces mode. Type "back" or "exit" to leave.', type: 'info', blurred: false }]);
			const rest = cmd.replace(/^\/spaces\s*/i, '').trim();
			if (rest) handleSpacesCommand(rest, cliContextStack[cliContextStack.length - 1]);
		} else {
			terminalLines.set([...$terminalLines, { text: 'Unknown command.', type: 'error', blurred: false }]);
		}
		terminalInput.set('');
		setTimeout(() => scrollTerminalToBottom(), 0);
	}

	function logout() {
    supabase.auth.signOut();
	user.set(null);
	loggedIn.set(false);
	localStorage.removeItem('selectedSpaceId');
	localStorage.removeItem('selectedProjectId');
	localStorage.removeItem('selectedTaskId');
	selectedSpaceId.set(null);
	selectedProjectId.set(null);
	selectedProjectIds.set(new Set());
	selectedTaskId.set(null);
	tasks.set([]);
	taskItems.set([]);
	terminalBlurred.set(true);
	terminalLines.set([
		...$terminalLines.map(l => ({ ...l, blurred: true })),
		{ text: 'Logged out.', type: 'info', blurred: false }
	]);
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
					terminalLines.set([...$terminalLines, { text: 'No spaces found.', type: 'info', blurred: false }]);
					return;
				}
				let out = 'Spaces:\n';
				spacesArr.forEach((s, i) => {
					out += `${i + 1}. ${s.name} (order: ${s.order ?? '-'})\n`;
				});
				terminalLines.set([...$terminalLines, { text: out.trim(), type: 'info', blurred: false }]);
				return;
			}
			   // sel n: drill into space details
			   if ((args[0].toLowerCase() === 'sel' && args[1]) || (!isNaN(Number(args[0])) && args.length === 1)) {
				   // Support both 'sel n' and just 'n' for selection
				   const n = args[0].toLowerCase() === 'sel' ? parseInt(args[1]) : parseInt(args[0]);
				   if (!spacesArr || isNaN(n) || n < 1 || n > spacesArr.length) {
					   terminalLines.set([...$terminalLines, { text: 'Invalid space number.', type: 'error', blurred: false }]);
					   return;
				   }
				   const selected = spacesArr[n - 1];
				   pushCliContext('spaces', { level: 'spaceDetails', space: selected });
				   // Show all fields as pretty JSON with line numbers
				   const fields = Object.entries(selected);
				   let out = `Selected: ${selected.name}\nFields:`;
				   fields.forEach(([key, value], i) => {
					   out += `\n${i + 1}. \x1b[36m${key}\x1b[0m: ${JSON.stringify(value)}`;
				   });
				   out += `\n\nType the number to select a field, or 'back' to return.`;
				   terminalLines.set([...$terminalLines, { text: out, type: 'success', blurred: false }]);
				   return;
			   }
			// add -d "Title"
			if (args[0].toLowerCase() === 'add') {
				if (args[1] && args[1] === '-d' && args[2]) {
					const title = args.slice(2).join(' ').replace(/^"|"$/g, '');
					addSpace(title);
					terminalLines.set([...$terminalLines, { text: `Space '${title}' added.`, type: 'success', blurred: false }]);
					return;
				}
				// Interactive add (not implemented: would require async input mode)
				terminalLines.set([...$terminalLines, { text: 'Interactive add not implemented. Use add -d "Title".', type: 'info', blurred: false }]);
				return;
			}
			// del n
			if (args[0].toLowerCase() === 'del' && args[1]) {
				const n = parseInt(args[1]);
				if (!spacesArr || isNaN(n) || n < 1 || n > spacesArr.length) {
					terminalLines.set([...$terminalLines, { text: 'Invalid space number.', type: 'error', blurred: false }]);
					return;
				}
				deleteSpace(spacesArr[n - 1]);
					terminalLines.set([...$terminalLines, { text: `Space '${spacesArr[n - 1].name}' deleted.`, type: 'success', blurred: false }]);
				return;
			}
		}
		// Context: spaceDetails (fields)
		if (ctx?.data?.level === 'spaceDetails') {
			const space = ctx.data.space;
			if (args[0].toLowerCase() === 'fields') {
				let out = 'Fields:\n1. name\n2. order';
				terminalLines.set([...$terminalLines, { text: out, type: 'info', blurred: false }]);
				return;
			}
			   // sel n: select field, or just a number to select a field
			   if ((args[0].toLowerCase() === 'sel' && args[1]) || (!isNaN(Number(args[0])) && args.length === 1)) {
				   const n = args[0].toLowerCase() === 'sel' ? parseInt(args[1]) : parseInt(args[0]);
				   const fields = Object.entries(space);
				   if (isNaN(n) || n < 1 || n > fields.length) {
					   terminalLines.set([...$terminalLines, { text: 'Invalid field number.', type: 'error', blurred: false }]);
					   return;
				   }
				   const [field, value] = fields[n - 1];
				   pushCliContext('spaces', { level: 'fieldDetails', space, field });
				   terminalLines.set([...$terminalLines, { text: `Field: ${field}\nCurrent value: ${JSON.stringify(value)}\nType 'edit <value>' to change, or 'back' to return.`, type: 'info', blurred: false }]);
				   return;
			   }
			if (args[0].toLowerCase() === 'back' || args[0].toLowerCase() === 'exit') {
				popCliContext();
				return;
			}
			terminalLines.set([...$terminalLines, { text: "Unknown command in space details. Type 'fields', 'sel n', 'back'.", type: 'error', blurred: false }]);
			return;
		}
		// Context: fieldDetails (edit field)
		if (ctx?.data?.level === 'fieldDetails') {
			const { space, field } = ctx.data;
			if (args[0].toLowerCase() === 'edit' && args[1]) {
				const value = args.slice(1).join(' ').replace(/^"|"$/g, '');
				updateSpace(space, { [field]: field === 'order' ? Number(value) : value });
				terminalLines.set([...$terminalLines, { text: `Field '${field}' updated to '${value}'.`, type: 'success', blurred: false }]);
				popCliContext();
				return;
			}
			if (args[0].toLowerCase() === 'back' || args[0].toLowerCase() === 'exit') {
				popCliContext();
				return;
			}
			terminalLines.set([...$terminalLines, { text: "Unknown command in field details. Type 'edit <value>' or 'back'.", type: 'error', blurred: false }]);
			return;
		}
		terminalLines.set([...$terminalLines, { text: 'Unknown /spaces command. Type /spaces -h for help.', type: 'error', blurred: false }]);
	}

registerCliHandler('spaces', spacesCliHandler);
</script>


<svelte:head>
	<link rel="icon" href="/favicon.ico" type="image/x-icon" />
</svelte:head>



<div class="min-h-screen flex flex-col bg-base-200">
	<ToastContainer />
	<!-- Header -->
	<HeaderBar loggedIn={$loggedIn} onLogin={() => openLogin(false)} onLogout={logout} />
	<!-- Main layout row: Activity bar, sidebar, main, panel -->
	<div class="flex flex-1 min-h-0">
		<!-- Activity Bar -->
					<SpaceSelector selectedId={$selectedSpaceId} loggedIn={$loggedIn} on:select={e => handleSelectSpace(e.detail)} />
		<!-- Primary Side Bar (Accordion) -->
	<aside class="bg-base-100 border-r border-base-300 shadow-sm w-80 min-w-72 flex flex-col">
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
												selectedId={$selectedProjectId}
												loading={$projectsLoading}
												error={$projectsError}
												on:projectEditClick={e => openPropertiesPanel('project', e.detail)}
												on:select={e => handleSelectProject(e.detail)}
											/>

						<!-- Global entity properties panel -->
						<EntityPropertiesPanel
							open={$propertiesPanelOpen}
							title={$propertiesPanelType === 'project' ? 'Project Properties' : $propertiesPanelType === 'task' ? 'Task Properties' : $propertiesPanelType === 'taskItem' ? 'Task Item Properties' : 'Properties'}
							width="md"
							onClose={closePropertiesPanel}
						>
							{#if $propertiesPanelType === 'project'}
								<ProjectsPropertiesForm
									project={$propertiesPanelType === 'project' && $propertiesPanelEntity && 'space_id' in $propertiesPanelEntity ? $propertiesPanelEntity : null}
									onUpdate={updateProject}
									onDelete={deleteProject}
								/>
							{:else if $propertiesPanelType === 'task'}
								<TasksPropertiesForm
									tasks={$tasks}
									onAdd={name => $selectedProjectId && addTask($selectedProjectId, name)}
									onUpdate={updateTask}
									onDelete={deleteTask}
								/>
							{:else if $propertiesPanelType === 'taskItem'}
								<TaskItemsPropertiesForm
									item={($propertiesPanelType === 'taskItem' && $propertiesPanelEntity && 'task_id' in $propertiesPanelEntity) ? $propertiesPanelEntity : null}
									onUpdate={updateTaskItem}
									onDelete={deleteTaskItem}
								/>
							{/if}
						</EntityPropertiesPanel>
					{/if}
					   <!-- Removed extra flex-1 spacer to eliminate blank bordered element -->
					{#if !loggedIn}
						<div class="absolute inset-0 z-20 bg-base-100/80"></div>
					{/if}
				</div>
				   <!-- Removed extra flex-1 spacer to eliminate blank bordered element -->
				<!-- Bottom section: Search and Settings -->
				<SidebarAccordion sidebarSection={$sidebarSection} setSidebarSection={s => sidebarSection.set(s)} />
			</div>
		</aside>
		<!-- Main Editor Area -->
		<div class="flex-1 flex flex-col min-w-0">
					<div class="flex-1 flex flex-col min-w-0">
						<div class="flex flex-1 min-h-0 gap-0 relative">
							<section class="flex-1 min-w-0 border-r border-base-300 bg-base-100 flex flex-col p-0">
								<TaskList
									tasks={$tasks}
									selectedId={$selectedTaskId}
									loading={$tasksLoading}
									error={$tasksError}
									on:taskEditClick={e => openPropertiesPanel('task', e.detail)}
									on:select={e => handleToggleTask(e.detail)}
								/>
							</section>
							<section class="flex-1 min-w-0 bg-base-100 flex flex-col p-0">
								<TaskItemList
									items={$taskItems}
									loading={$taskItemsLoading}
									error={$taskItemsError}
									on:taskItemEditClick={e => openPropertiesPanel('taskItem', e.detail)}
									on:taskItemPrintClick={async e => {
										const item = e.detail;
										try {
											const res = await fetch('/api/print-task-item', {
												method: 'POST',
												headers: { 'Content-Type': 'application/json' },
												body: JSON.stringify({ name: item.name, description: item.description })
											});
											const result = await res.json();
											if (result.success) {
												toastStore.show('Sent to printer!', 'success');
											} else {
												toastStore.show('Printer error: ' + (result.error || 'Unknown error'), 'error');
											}
										} catch (err) {
											toastStore.show('Printer error: ' + err.message, 'error');
										}
									}}
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
					lines={$terminalLines}
					input={$terminalInput}
					inputActive={$terminalInputActive}
					open={$terminalOpen}
					onInput={handleTerminalInput}
					onInputChange={v => terminalInput.set(v)}
					onFocus={() => terminalInputActive.set(true)}
					onBlur={() => terminalInputActive.set(false)}
					onToggle={() => terminalOpen.set(!$terminalOpen)}
				/>
				<LoginModal
					open={$loginModalOpen}
					changePasswordMode={$changePasswordMode}
					registerMode={$registerMode}
					loginEmail={$loginEmail}
					loginPassword={$loginPassword}
					loginError={$loginError}
					onEmailChange={v => loginEmail.set(v)}
					onPasswordChange={v => loginPassword.set(v)}
					onSubmit={handleLogin}
					onCancel={() => { closeLogin(); registerMode.set(false); }}
					onRegister={() => { registerMode.set(true); loginError.set(''); }}
				/>
				<StatusBar loggedIn={$loggedIn} user={$user} projects={$projectsStore} tasks={$tasks} taskItems={$taskItems} />
		</div>
	</div>
<!-- Close main layout container -->
</div>
