<script lang="ts">
  export let spaces: Array<{ id: number; name: string }> = [];
  export let selectedSpaceId: number | null = null;
  export let onSelect: (id: number) => void;
</script>

<nav class="flex flex-col gap-2 p-4 bg-base-100 border-r border-base-300 w-48 min-w-48" aria-label="Space Selector">
  <h3 class="text-xs font-bold uppercase text-base-content/60 mb-2">Spaces</h3>
  {#each spaces as space}
    <button
      class="btn btn-block btn-sm justify-start text-left mb-1 {selectedSpaceId === space.id ? 'btn-primary' : 'btn-ghost'}"
      aria-current={selectedSpaceId === space.id ? 'page' : undefined}
      on:click={() => onSelect(space.id)}
    >
      {space.name}
    </button>
  {/each}
</nav>
