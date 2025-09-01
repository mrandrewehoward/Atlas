<script lang="ts">
import Icon from '@iconify/svelte';
export let loggedIn: boolean = false;
export let onLogin: () => void;
export let onLogout: () => void;
</script>

<header class="h-14 flex items-center px-6 bg-base-100 border-b border-base-300 shadow-sm z-20 sticky top-0">
  <div class="flex items-center gap-4 flex-1">
    <span class="font-mono text-xl font-bold text-emerald-700">Atlas</span>
    <nav class="hidden md:flex gap-2 ml-6">
      <a href="/" class="btn btn-ghost btn-sm rounded-btn">Dashboard</a>
      <a href="/projects" class="btn btn-ghost btn-sm rounded-btn">Projects</a>
      <a href="/settings" class="btn btn-ghost btn-sm rounded-btn">Settings</a>
    </nav>
  </div>
  <div class="flex items-center gap-2">
    {#if !loggedIn}
  <button class="btn btn-primary btn-sm flex items-center gap-1" on:click={onLogin} aria-label="Login">
    <Icon icon="material-symbols-light:login" width="20" height="20" />
    <span class="hidden sm:inline">Login</span>
  </button>
    {:else}
  <button class="btn btn-ghost btn-sm flex items-center gap-1" on:click={onLogout} aria-label="Logout">
    <Icon icon="material-symbols-light:logout" width="20" height="20" />
    <span class="hidden sm:inline">Logout</span>
  </button>
    {/if}
  </div>
</header>
