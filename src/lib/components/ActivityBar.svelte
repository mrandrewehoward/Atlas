
<script lang="ts">
export let spaces: Array<{ id: number; name: string; icon?: string }> = [];
// Get two-letter abbreviation from name
function getAbbreviation(name: string) {
  return name
    .split(' ')
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
}
</script>

<nav class="flex flex-col items-center gap-4 py-4 px-1 bg-base-200 border-r border-base-300 shadow-sm w-14 min-w-14" aria-label="Spaces Bar">
  {#each spaces as space}
    <button class="btn btn-ghost btn-circle w-10 h-10 flex items-center justify-center p-0" aria-label={space.name} tabindex="0">
      <span class="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-xs font-bold select-none">
        {getAbbreviation(space.name)}
      </span>
    </button>
  {/each}
</nav>
