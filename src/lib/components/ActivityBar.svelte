<script lang="ts">
export let spaces: Array<{ id: number; name: string }> = [];
export let getAbbreviation: (name: string) => string;
</script>

<nav class="flex flex-col items-center gap-4 py-4 px-1 bg-base-200 border-r border-base-300 shadow-sm w-14 min-w-14" aria-label="Spaces Bar">
  {#each spaces as space}
    <button class="btn btn-ghost btn-circle w-10 h-10 flex items-center justify-center text-xs font-bold" aria-label={space.name} tabindex="0">
      {getAbbreviation(space.name)}
    </button>
  {/each}
</nav>
