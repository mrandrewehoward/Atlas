<script lang="ts">
export let loggedIn: boolean = false;
export let user: { email: string; username: string } | null = null;
export let projects: any[] = [];
export let tasks: any[] = [];
export let taskItems: any[] = [];

import { onMount } from 'svelte';
let isLight = true;
import { tick } from 'svelte';
onMount(() => {
  document.documentElement.setAttribute('data-theme', 'emerald');
  isLight = true;
});
function toggleTheme(e: Event) {
  isLight = (e.target as HTMLInputElement).checked;
  document.documentElement.setAttribute('data-theme', isLight ? 'emerald' : 'night');
}

</script>

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

  <span class="ml-auto flex items-center gap-2">
  <input type="checkbox" class="toggle toggle-xs" id="theme-toggle" checked={isLight} on:change={toggleTheme} />
  <label for="theme-toggle" class="cursor-pointer select-none">{isLight ? 'Light Mode' : 'Dark Mode'}</label>
  </span>
</footer>
