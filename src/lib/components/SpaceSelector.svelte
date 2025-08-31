

<script lang="ts">
// ...existing code...

import { onMount, createEventDispatcher } from 'svelte';
import { spaces, spacesLoading, spacesError, fetchSpaces } from '../stores/spaces';
import type { Space } from '../types';
import { supabase } from '../supabaseClient';

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
let newSpaceName = '';

function addSpace() {
  if (!newSpaceName.trim()) return;
  // TODO: Add Supabase insert logic here
  newSpaceName = '';
}

async function updateSpaceName(space: Space) {
  if (!space.name.trim()) return;
  const { error } = await supabase
    .from('spaces')
    .update({ name: space.name })
    .eq('id', space.id);
  if (!error) {
    fetchSpaces();
  } else {
    // Optionally show a toast or error
    console.error('Failed to update space:', error.message);
  }
}
</script>

<section class="flex flex-col h-full px-2 py-3 relative">
  {#if $spacesLoading}
    <div class="p-4 text-center text-base-content/60">Loading...</div>
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
              {getAbbreviation(space.name, 2)}
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
                <form class="flex-1" on:submit|preventDefault={() => updateSpaceName(space)}>
                  <input
                    class="input input-sm w-full border border-base-300 bg-base-100 text-base-content font-mono px-2 py-1"
                    type="text"
                    bind:value={space.name}
                    aria-label="Edit space name"
                    on:keydown={(e) => {
                      const input = e.target as HTMLInputElement;
                      if (e.key === 'Enter' && input.form) input.form.requestSubmit();
                    }}
                  />
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
</section>
