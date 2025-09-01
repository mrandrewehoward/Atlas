<script lang="ts">
import { createEventDispatcher, onMount, onDestroy } from 'svelte';
import ConfirmModal from './ConfirmModal.svelte';

export let open: boolean = false;
export let title: string = 'Properties';
export let width: 'sm' | 'md' | 'lg' | 'xl' = 'md'; // Panel width
export let onClose: (() => void) | null = null;

export let confirmMessage: string = '';
export let confirmOpen: boolean = false;

const dispatch = createEventDispatcher();

function handleClose() {
  if (onClose) onClose();
  dispatch('close');
}

function handleConfirm() {
  dispatch('confirm');
}
function handleCancel() {
  dispatch('cancel');
}

let panelWidth = 'w-1/3 max-w-lg';
$: panelWidth = width === 'sm' ? 'w-1/4 max-w-sm' : width === 'lg' ? 'w-1/2 max-w-2xl' : width === 'xl' ? 'w-2/3 max-w-4xl' : 'w-1/3 max-w-lg';
</script>

{#if open}
  <button
    type="button"
    class="fixed inset-0 z-[99] bg-transparent"
    aria-label="Close properties panel"
    on:click={handleClose}
    on:keydown={(e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') handleClose(); }}
    style="background: transparent;"
  ></button>
  <div class={`fixed right-0 z-[100] flex flex-col items-end justify-start ${panelWidth} h-auto pointer-events-none`} style="top: calc(var(--header-height, 48px) + 6px); bottom: calc(var(--footer-height, 40px) - 12px); margin: 0; padding: 0; border: none;">
    <div class="w-full h-full bg-base-100 border-l border-base-300 shadow-2xl pointer-events-auto transition-transform duration-300 ease-in-out flex flex-col" style="transform: translateX(0);" role="dialog" tabindex="0" aria-label={title}>
      <div class="flex items-center justify-between border-b border-base-300 bg-base-200 px-4 py-2">
        <span class="font-bold text-base">{title}</span>
        <button class="btn btn-xs btn-ghost" aria-label="Close" on:click={handleClose}>✕</button>
      </div>
      <div class="flex-1 overflow-y-auto px-4 py-4 relative">
        <slot />
        {#if confirmOpen}
          <div class="absolute top-0 left-0 w-full h-full flex justify-center items-start z-50" style="pointer-events: auto;">
            <div class="absolute inset-0 bg-white/80" style="z-index: 0;"></div>
            <div style="margin-top: 12rem; width: max-content; z-index: 10; pointer-events: auto;">
              <ConfirmModal
                open={confirmOpen}
                message={confirmMessage}
                on:confirm={handleConfirm}
                on:cancel={handleCancel}
              />
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

{/if}


