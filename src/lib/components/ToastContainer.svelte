<script lang="ts">
  import { toastStore } from '../stores/toast';
  import type { Toast } from '../stores/toast';
  let toasts: Toast[] = [];
  const unsubscribe = toastStore.subscribe((v) => (toasts = v));
  // Clean up subscription if needed
  import { onDestroy } from 'svelte';
  onDestroy(unsubscribe);
</script>

<div class="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] flex flex-col gap-2 items-center">
  {#each toasts as toast (toast.id)}
    <div class="alert alert-{toast.type} shadow-lg min-w-[220px] max-w-xs flex items-center
      {toast.type === 'success' || toast.type === 'info' ? 'bg-opacity-70 text-opacity-80' : ''}">
      <span class="flex-1">{toast.message}</span>
      <button class="btn btn-xs btn-circle btn-ghost ml-2" on:click={() => toastStore.dismiss(toast.id)} aria-label="Dismiss">✕</button>
    </div>
  {/each}
</div>
