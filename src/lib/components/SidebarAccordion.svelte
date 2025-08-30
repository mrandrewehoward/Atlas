<script lang="ts">
import SearchPanel from './SearchPanel.svelte';
import SettingsPanel from './SettingsPanel.svelte';
export let sidebarSection: string = '';
export let setSidebarSection: (section: string) => void;
</script>

<div class="flex flex-col gap-0 pb-2">
  <div>
    <button class="w-full text-left px-4 py-2 font-bold text-base-content bg-base-100 hover:bg-base-200 transition flex items-center" aria-expanded={sidebarSection==='search'} onclick={() => setSidebarSection(sidebarSection==='search' ? '' : 'search')}>
      <span class="mr-2 text-xs font-mono">{sidebarSection==='search' ? 'v' : '>'}</span>
      <span>Search</span>
    </button>
    {#if sidebarSection==='search'}
      <SearchPanel />
    {/if}
    <button class="w-full text-left px-4 py-2 font-bold text-base-content bg-base-100 hover:bg-base-200 transition flex items-center" aria-expanded={sidebarSection==='settings'} onclick={() => setSidebarSection(sidebarSection==='settings' ? '' : 'settings')}>
      <span class="mr-2 text-xs font-mono">{sidebarSection==='settings' ? 'v' : '>'}</span>
      <span>Settings</span>
    </button>
    {#if sidebarSection==='settings'}
      <SettingsPanel />
    {/if}
  </div>
</div>
