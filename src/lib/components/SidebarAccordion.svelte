<script lang="ts">
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
      <div class="p-4 bg-base-100 border-t border-base-300 animate-fade-in-up">
        <input class="input input-bordered input-sm w-full" placeholder="Search..." />
        <div class="mt-2 text-xs text-base-content/70">No results.</div>
      </div>
    {/if}
  </div>
  <div>
    <button class="w-full text-left px-4 py-2 font-bold text-base-content bg-base-100 hover:bg-base-200 transition flex items-center" aria-expanded={sidebarSection==='settings'} onclick={() => setSidebarSection(sidebarSection==='settings' ? '' : 'settings')}>
      <span class="mr-2 text-xs font-mono">{sidebarSection==='settings' ? 'v' : '>'}</span>
      <span>Settings</span>
    </button>
    {#if sidebarSection==='settings'}
      <div class="p-4 bg-base-100 border-t border-base-300 animate-fade-in-up">
        <div class="text-xs text-base-content/70">Settings panel.</div>
      </div>
    {/if}
  </div>
</div>
