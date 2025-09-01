<script lang="ts">
// ...existing code...


import { onMount, createEventDispatcher, onDestroy } from 'svelte';
import EntityPropertiesPanel from './EntityPropertiesPanel.svelte';
import SpacesPropertiesForm from './SpacesPropertiesForm.svelte';

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
async function handleConfirm() {
  const action = confirmAction;
  confirmOpen = false;
  confirmAction = null;
  if (action) {
    await action();
    // After action (e.g., delete), refresh spaces and reset modal state
    fetchSpaces();
    confirmOpen = false;
    confirmMessage = '';
    confirmAction = null;
  }
}
function handleCancel() {
  confirmOpen = false;
  confirmAction = null;
}


async function addSpace(name: string) {
  showConfirm(`Add space '${name}'?`, async () => {
    const { data, error } = await supabase
      .from('spaces')
      .insert([{ name }]);
    if (!error) {
      fetchSpaces();
      toastStore.show('Space added!', 'success');
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


<!-- Drawer/Modal for managing spaces using generic panel -->
<EntityPropertiesPanel
  open={showDrawer}
  title="Spaces Properties"
  width="md"
  onClose={closeDrawer}
  confirmOpen={confirmOpen}
  confirmMessage={confirmMessage}
  on:confirm={handleConfirm}
  on:cancel={handleCancel}
>
  <SpacesPropertiesForm
    onUpdate={updateSpace}
    onDelete={deleteSpace}
    onAdd={addSpace}
  />
</EntityPropertiesPanel>
</section>
