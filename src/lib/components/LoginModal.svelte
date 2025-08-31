<script lang="ts">
  export let open: boolean;
  export let changePasswordMode: boolean;
  export let registerMode: boolean = false;
  export let loginEmail: string;
  export let loginPassword: string;
  export let loginError: string;
  export let onEmailChange: (v: string) => void;
  export let onPasswordChange: (v: string) => void;
  export let onSubmit: (e: Event) => void;
  export let onCancel: () => void;
  export let onRegister: () => void;
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-base-300/60">
    <form class="bg-base-200 border border-base-300 rounded-lg shadow-lg p-8 flex flex-col gap-6 w-full max-w-xs animate-fade-in-up" on:submit={onSubmit}>
      <h2 class="text-xl font-bold text-center text-emerald-700">
        {#if changePasswordMode}
          Change Password
        {:else if registerMode}
          Register
        {:else}
          Sign In
        {/if}
      </h2>
      <input class="input input-primary input-bordered" type="email" placeholder="Email" aria-label="Email" bind:value={loginEmail} on:input={e => onEmailChange((e.target as HTMLInputElement).value)} required />
      <input class="input input-primary input-bordered" type="password" placeholder={changePasswordMode ? 'New Password' : registerMode ? 'Create Password' : 'Password'} aria-label="Password" bind:value={loginPassword} on:input={e => onPasswordChange((e.target as HTMLInputElement).value)} required />
      {#if loginError}
        <div class="text-error text-xs text-center">{loginError}</div>
      {/if}
      <button class="btn btn-primary w-full mt-2" type="submit">
        {#if changePasswordMode}
          Change Password
        {:else if registerMode}
          Register
        {:else}
          Sign In
        {/if}
      </button>
      <button class="btn btn-secondary w-full mt-2" type="button" on:click={onCancel}>Cancel</button>
      {#if !registerMode && !changePasswordMode}
        <div class="text-xs text-center mt-2">
          <button type="button" class="link link-primary px-0" on:click={onRegister}>Don't have an account? Register</button>
        </div>
      {/if}
      {#if registerMode}
        <div class="text-xs text-center mt-2">
          <button type="button" class="link link-secondary px-0" on:click={onCancel}>Already have an account? Sign In</button>
        </div>
      {/if}
    </form>
  </div>
{/if}
