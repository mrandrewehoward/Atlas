<script>
// Placeholder for spaces data
const spaces = [
  { id: 1, name: 'Home', color: 'primary' },
  { id: 2, name: 'Work', color: 'secondary' },
  { id: 3, name: 'Camping', color: 'accent' }
];

function getAbbreviation(name: string): string {
  return name
    .split(/\s+/)
    .map((word: string) => word.slice(0, 2).toUpperCase())
    .join('');
}
</script>

<section class="flex flex-col h-full">
  <div class="stat bg-base-100 rounded-md shadow-sm mb-2">
    <div class="stat-value text-base-content">Spaces</div>
  </div>
  <ul class="flex flex-col gap-2">
      {#each spaces as space}
        <li class={`card card-compact bg-base-200 border-l-4 border-${space.color} p-2 hover:bg-base-300 transition`} aria-label={space.name}>
          <button class="flex items-center gap-2 w-full text-left bg-transparent border-none p-0" type="button" aria-label={space.name}>
            <span class="w-8 h-8 rounded-full bg-base-300 text-base-content font-bold flex items-center justify-center text-xs" aria-hidden="true">{getAbbreviation(space.name)}</span>
            <span class="font-semibold">{space.name}</span>
          </button>
        </li>
      {/each}
  </ul>
</section>
