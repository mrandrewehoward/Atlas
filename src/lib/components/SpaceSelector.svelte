
<script lang="ts">
import { onMount, createEventDispatcher } from 'svelte';
import { spaces, spacesLoading, spacesError, fetchSpaces } from '../stores/spaces';
import type { Space } from '../types';


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
</script>

<section class="flex flex-col h-full px-2 py-3">
  {#if $spacesLoading}
    <div class="p-4 text-center text-base-content/60">Loading...</div>
  {:else if $spacesError}
    <div class="alert alert-error">{$spacesError}</div>
  {:else if $spaces.length === 0}
    <div class="p-4 text-center text-base-content/60">No spaces found.</div>
  {:else}
    <ul class="flex flex-col gap-2 items-center py-2">
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
</section>
