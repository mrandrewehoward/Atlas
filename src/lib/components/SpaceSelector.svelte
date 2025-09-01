<script lang="ts">
// ...existing code...


import { onMount, createEventDispatcher, onDestroy } from 'svelte';
import ConfirmModal from './ConfirmModal.svelte';

export let loggedIn: boolean = false;
import { spaces, spacesLoading, spacesError, fetchSpaces } from '../stores/spaces';
import type { Space } from '../types';
import { supabase } from '../supabaseClient';
import { toastStore } from '../stores/toast';

export let selectedId: string | null = null;
const dispatch = createEventDispatcher();

onMount(() => {
  fetchSpaces();
});

function getAbbreviation(name: string, length = 2): string {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  let abbr = words.map(w => w[0]).join('').toUpperCase();
  if (abbr.length < length && words.length === 1) {
    abbr = (words[0].substring(0, length)).toUpperCase();
  }
  return abbr.substring(0, length);
}

let showDrawer = false;
function closeDrawer() { showDrawer = false; }

// Close drawer on logout (listen for custom event)
function handleLogout() { closeDrawer(); }
if (typeof window !== 'undefined') {
  window.addEventListener('atlas-logout', handleLogout);
  onDestroy(() => window.removeEventListener('atlas-logout', handleLogout));
}

let newSpaceName = '';

let confirmOpen = false;
let confirmMessage = '';
let confirmAction: (() => void) | null = null;

function showConfirm(message: string, action: () => void) {
  confirmMessage = message;
  confirmAction = action;
  confirmOpen = true;
}
function handleConfirm() {
  confirmOpen = false;
  if (confirmAction) confirmAction();
  confirmAction = null;
}
function handleCancel() {
  confirmOpen = false;
  confirmAction = null;
}

async function addSpace() {
  if (!newSpaceName.trim()) return;
  const name = newSpaceName.trim();
  showConfirm(`Add space '${name}'?`, async () => {
    const { data, error } = await supabase
      .from('spaces')
      .insert([{ name }]);
    if (!error) {
      fetchSpaces();
      toastStore.show('Space added!', 'success');
      newSpaceName = '';
    } else {
      toastStore.show('Failed to add space', 'error');
      console.error('Failed to add space:', error.message);
    }
  });
}

async function deleteSpace(space: Space) {
  showConfirm(`Delete space '${space.name}'?`, async () => {
    const { error } = await supabase
      .from('spaces')
      .delete()
      .eq('id', space.id);
    if (!error) {
      fetchSpaces();
      toastStore.show('Space deleted!', 'success');
    } else {
      toastStore.show('Failed to delete space', 'error');
      console.error('Failed to delete space:', error.message);
    }
  });
}


async function updateSpace(space: Space, updates: Partial<Space>) {
  const { error } = await supabase
    .from('spaces')
    .update(updates)
    .eq('id', space.id);
  if (!error) {
    fetchSpaces();
    toastStore.show('Space updated', 'success');
  } else {
    toastStore.show('Failed to update space', 'error');
    console.error('Failed to update space:', error.message);
  }
}
</script>

<section class="flex flex-col h-full px-2 py-3 relative">
  {#if !loggedIn}
    <ul class="flex flex-col gap-2 items-center py-2 flex-1">
      {#each Array(2) as _, i}
        <li>
          <span class="w-10 h-10 flex items-center justify-center rounded-full bg-base-200 border-2 border-base-300 text-base-content/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m0 14v1m8-8h1M4 12H3m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
          </span>
        </li>
      {/each}
    </ul>
        <!-- End of SpaceSelector -->
    <ul class="flex flex-col gap-2 items-center py-2 flex-1">
      {#each Array(2) as _, i}
        <li>
          <span class="w-10 h-10 flex items-center justify-center rounded-full bg-base-200 border-2 border-base-300 text-base-content/20 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m0 14v1m8-8h1M4 12H3m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
          </span>
        </li>
      {/each}
    </ul>
  {:else if $spacesError}
    <div class="alert alert-error">{$spacesError}</div>
  {:else if $spaces.length === 0}
    <div class="p-4 text-center text-base-content/60">No spaces found.</div>
  {:else}
    <ul class="flex flex-col gap-2 items-center py-2 flex-1">
      {#each $spaces as space}
        <li>
          <button
            class="w-10 h-10 flex items-center justify-center rounded-full bg-white border-2 border-base-300 hover:bg-base-200 focus:bg-base-200 transition outline-none shadow-sm {selectedId === space.id ? 'ring-2 ring-emerald-400' : ''}"
            type="button"
            aria-label={space.name}
            title={space.name}
            style="border-color: {space.color ? `${space.color}33` : '#d1d5db'};"
            on:click={() => dispatch('select', space.id)}
          >
            <span class="w-8 h-8 flex items-center justify-center rounded-full font-bold text-base-content text-sm select-none {selectedId === space.id ? 'font-extrabold text-emerald-700' : ''}" style="color: #222;">
              {space && space.name ? getAbbreviation(space.name, 2) : '?'}
            </span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
  <!-- Manage/Options Button locked to bottom -->
  <div class="flex-1"></div>
  <div class="sticky bottom-0 left-0 w-full flex justify-center z-10">
    <button class="btn btn-xs btn-ghost rounded-full" aria-label="Panel Options" title="Panel Options" on:click={() => showDrawer = !showDrawer}>
      <!-- Vertical Ellipsis Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="6" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="18" r="1.5"/></svg>
    </button>
  </div>

  <!-- Drawer/Modal for managing spaces -->
  {#if showDrawer}
  <button
    type="button"
    class="fixed inset-0 z-[99] bg-transparent"
    aria-label="Close properties panel"
    on:click={closeDrawer}
    on:keydown={(e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') closeDrawer(); }}
    style="background: transparent;"
  ></button>
  <div class="fixed right-0 z-[100] flex flex-col items-end justify-start w-1/3 max-w-lg h-auto pointer-events-none" style="top: calc(var(--header-height, 48px) + 6px); bottom: calc(var(--footer-height, 40px) - 12px); margin: 0; padding: 0; border: none;">
  <div class="w-full h-full bg-base-100 border-l border-base-300 shadow-2xl pointer-events-auto transition-transform duration-300 ease-in-out flex flex-col" style="transform: translateX(0);" role="dialog" tabindex="0" aria-label="Properties Panel">
        <div class="flex items-center justify-between border-b border-base-300 bg-base-200 px-4 py-2">
          <span class="font-bold text-base">Properties</span>
          <button class="btn btn-xs btn-ghost" aria-label="Close" on:click={() => showDrawer = false}>✕</button>
        </div>
        <div class="flex-1 overflow-y-auto px-4 py-4">
          <ul class="flex flex-col gap-2 mb-4">
            {#each $spaces as space (space.id)}
              <li class="flex items-center gap-2">
                <form class="flex-1 flex gap-2 items-center" on:submit|preventDefault={() => updateSpace(space, { name: space.name, order: space.order })}>
                  <input
                    class="input input-sm flex-1 border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1"
                    type="text"
                    bind:value={space.name}
                    aria-label="Edit space name"
                    on:keydown={(e) => {
                      const input = e.target as HTMLInputElement;
                      if (e.key === 'Enter' && input.form) input.form.requestSubmit();
                    }}
                  />
                  <input
                    class="input input-xs w-16 text-center"
                    type="number"
                    min="1"
                    max={$spaces.length}
                    bind:value={space.order}
                    aria-label="Order"
                    on:change={() => updateSpace(space, { order: Number(space.order) })}
                    style="width:3.5rem;"
                  />
                  <span class="text-xs text-base-content/50">/ {$spaces.length}</span>
                  <button type="button" class="btn btn-xs btn-ghost text-error ml-1" aria-label="Delete space" title="Delete space" on:click={() => deleteSpace(space)}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </form>
              </li>
            {/each}
          </ul>
          <form class="flex gap-2" on:submit|preventDefault={addSpace}>
            <input class="input input-sm flex-1 border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1" type="text" bind:value={newSpaceName} placeholder="New space name" aria-label="New space name" />
            <button class="btn btn-sm btn-success" type="submit">Add</button>
          </form>
        </div>
      </div>
    </div>
  {/if}


<!-- ConfirmModal rendered above properties panel if open -->
{#if showDrawer}
  <div class="fixed right-0 z-[2001] flex flex-col items-end justify-start w-1/3 max-w-lg pointer-events-none" style="top: calc(var(--header-height, 48px) + 6px); margin: 0; padding: 0; border: none;">
    <div class="relative w-full">
      <div class="absolute top-2 right-4 left-4 flex justify-center pointer-events-auto">
        <ConfirmModal
          open={confirmOpen}
          message={confirmMessage}
          on:confirm={handleConfirm}
          on:cancel={handleCancel}
        />
      </div>
    </div>
  </div>
{/if}
</section>
