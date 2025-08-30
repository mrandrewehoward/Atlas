<script lang="ts">
  export let query: string = '';
  export let onQueryChange: (q: string) => void = () => {};
</script>

<div class="p-4 bg-base-100 border-t border-base-300 animate-fade-in-up">
  <input
    class="input input-bordered input-sm w-full"
    placeholder="Search..."
    bind:value={query}
  on:input={(e) => onQueryChange((e.target as HTMLInputElement).value)}
    aria-label="Search"
  />
  <div class="mt-2 text-xs text-base-content/70">No results.</div>
</div>
