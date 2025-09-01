// Properties panel state
import type { Project, Task, Item } from '$lib/types';
export type PropertiesPanelType = 'project' | 'task' | 'taskItem' | null;
export const propertiesPanelOpen = writable<boolean>(false);
export const propertiesPanelType = writable<PropertiesPanelType>(null);
export const propertiesPanelEntity = writable<Project | Task | Item | null>(null);

export function openPropertiesPanel(type: PropertiesPanelType, entity: Project | Task | Item | null) {
	propertiesPanelType.set(type);
	propertiesPanelEntity.set(entity);
	propertiesPanelOpen.set(true);
}
export function closePropertiesPanel() {
	propertiesPanelOpen.set(false);
	propertiesPanelType.set(null);
	propertiesPanelEntity.set(null);
}
import { writable, type Writable } from 'svelte/store';

// Selection state
export const selectedSpaceId = writable<string | null>(null);
export const selectedProjectIds = writable<Set<string>>(new Set());
export const selectedProjectId = writable<string | null>(null);
export const selectedTaskId = writable<string | null>(null);

// Sidebar section
export const sidebarSection = writable<string>('');

// Terminal state
export const terminalOpen = writable<boolean>(true);
export const terminalInput = writable<string>('');
export const terminalLines = writable<Array<{ text: string; type: string; blurred: boolean }>>([
	{ text: 'Welcome to Atlas Workbench! Type /help for commands.', type: 'info', blurred: false }
]);
export const terminalInputActive = writable<boolean>(false);
export const terminalBlurred = writable<boolean>(false);

// Auth/login modal state
export const loginModalOpen = writable<boolean>(false);
export const loginEmail = writable<string>('');
export const loginPassword = writable<string>('');
export const loginError = writable<string>('');
export const loggedIn = writable<boolean>(false);
export const user = writable<{ email: string; username: string } | null>(null);
export const changePasswordMode = writable<boolean>(false);
export const registerMode = writable<boolean>(false);
export const awaitingPasswordChangeConfirm = writable<boolean>(false);