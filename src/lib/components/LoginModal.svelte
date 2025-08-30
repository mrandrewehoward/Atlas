<script lang="ts">
  export let open: boolean;
  export let changePasswordMode: boolean;
  export let loginEmail: string;
  export let loginPassword: string;
  export let loginError: string;
  export let onEmailChange: (v: string) => void;
  export let onPasswordChange: (v: string) => void;
  export let onSubmit: (e: Event) => void;
  export let onCancel: () => void;
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-base-300/60">
    <form class="bg-base-200 border border-base-300 rounded-lg shadow-lg p-8 flex flex-col gap-6 w-full max-w-xs animate-fade-in-up" on:submit={onSubmit}>
      <h2 class="text-xl font-bold text-center text-emerald-700">{changePasswordMode ? 'Change Password' : 'Sign In'}</h2>
  <input class="input input-primary input-bordered" type="email" placeholder="Email" aria-label="Email" bind:value={loginEmail} on:input={e => onEmailChange((e.target as HTMLInputElement).value)} required />
  <input class="input input-primary input-bordered" type="password" placeholder={changePasswordMode ? 'New Password' : 'Password'} aria-label="Password" bind:value={loginPassword} on:input={e => onPasswordChange((e.target as HTMLInputElement).value)} required />
      {#if loginError}
        <div class="text-error text-xs text-center">{loginError}</div>
      {/if}
      <button class="btn btn-primary w-full mt-2" type="submit">{changePasswordMode ? 'Change Password' : 'Sign In'}</button>
      <button class="btn btn-secondary w-full mt-2" type="button" on:click={onCancel}>Cancel</button>
    </form>
  </div>
{/if}
