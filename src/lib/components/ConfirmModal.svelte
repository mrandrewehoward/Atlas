<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  export let open: boolean = false;
  export let message: string = '';
  export let confirmText: string = 'Confirm';
  export let cancelText: string = 'Cancel';
  const dispatch = createEventDispatcher();
  let dialogEl: HTMLDivElement | null = null;

  function handleKeydown(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Enter') {
      dispatch('confirm');
    } else if (e.key === 'Escape') {
      dispatch('cancel');
    }
  }

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeydown);
      return () => window.removeEventListener('keydown', handleKeydown);
    }
  });
</script>

{#if open}
  <div class="fixed inset-0 z-[2000] flex items-end justify-end pointer-events-none">
    <div class="absolute inset-0 bg-transparent"></div>
    <div bind:this={dialogEl} class="relative z-10 m-6 pointer-events-auto">
      <div class="bg-base-200 border border-base-300 rounded-lg shadow-xl px-6 py-4 flex flex-col items-center min-w-[220px] max-w-xs animate-fade-in-up">
        <div class="text-base-content text-sm mb-3 text-center">{message}</div>
        <div class="flex gap-2 w-full justify-center">
          <button class="btn btn-xs btn-primary" on:click={() => dispatch('confirm')}>{confirmText}</button>
          <button class="btn btn-xs btn-ghost" on:click={() => dispatch('cancel')}>{cancelText}</button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Subtle fade-in animation */
  .animate-fade-in-up {
    animation: fadeInUp 0.18s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
