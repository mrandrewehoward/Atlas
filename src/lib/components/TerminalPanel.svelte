<script lang="ts">
// TerminalPanel: Handles all terminal UI and logic as a focused component
export let lines: Array<{ text: string; type: string; blurred: boolean }> = [];
export let input: string = "";
export let inputActive: boolean = false;
export let open: boolean = true;
export let onInput: (e: KeyboardEvent) => void;
export let onInputChange: (v: string) => void;
export let onFocus: () => void;
export let onBlur: () => void;
export let onToggle: () => void;
</script>

<div class="relative w-full select-none">
  <div class="w-full border-t border-base-300">
    <button type="button"
      class="flex items-center w-full px-4 h-8 bg-base-200 text-base-content font-mono text-xs border-b border-base-300 cursor-pointer select-none"
      onclick={onToggle}
      aria-label="Toggle terminal"
      onkeydown={e => (e.key === 'Enter' || e.key === ' ') && onToggle()}>
      <span class="flex-1">TERMINAL</span>
      <span class="ml-4 flex items-center gap-1 text-xs opacity-60">
        <kbd class="kbd kbd-xs">Ctrl</kbd>
        <span>+</span>
        <kbd class="kbd kbd-xs">`</kbd>
      </span>
      <span class="text-xs">{open ? '▼' : '▲'}</span>
    </button>
  </div>
  <div class="overflow-hidden transition-all duration-300 bg-base-200 border-t border-base-300"
    style="height: {open ? '220px' : '0'};">
    <div id="atlas-terminal-scroll" class="h-full max-h-56 p-2 text-xs font-mono overflow-y-auto flex flex-col gap-0.5">
      {#each lines as line}
        <div class="whitespace-pre-wrap break-all transition-all px-1 py-0.5 select-text border-l-2"
          class:border-info={line.type === 'info' && !line.blurred}
          class:border-success={line.type === 'success' && !line.blurred}
          class:border-error={line.type === 'error' && !line.blurred}
          class:bg-base-200={line.type !== 'input' && !line.blurred}
          class:text-info={line.type === 'info' && !line.blurred}
          class:text-success={line.type === 'success' && !line.blurred}
          class:text-error={line.type === 'error' && !line.blurred}
          class:text-base-content={line.type === 'input' && !line.blurred}
          class:opacity-40={line.blurred}
          style="border-color:rgba(0,0,0,0.08);"
        >{line.text}</div>
      {/each}
      {#if open}
        <div class="flex items-center mt-2">
          <span class="text-primary font-bold">&gt;</span>
          <input
            id="atlas-terminal-input"
            class="bg-transparent border-none outline-none flex-1 ml-2 text-xs font-mono text-base-content"
            style="min-width: 2ch;"
            type="text"
            value={input}
            oninput={e => onInputChange((e.target as HTMLInputElement)?.value || "")}
            onkeydown={onInput}
            autocomplete="off"
            spellcheck="false"
            onfocus={onFocus}
            onblur={onBlur}
          />
          <span class={inputActive ? 'animate-pulse' : ''}>&#9608;</span>
        </div>
      {/if}
    </div>
  </div>
</div>
