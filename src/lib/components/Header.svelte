
<script>
  import { loginDrawerOpen } from '$lib/stores/loginDrawer.js';
  function openDrawer() { loginDrawerOpen.set(true); }
</script>

<header class="navbar bg-base-100 border-b border-base-300 fixed top-0 left-0 w-full z-50">
  <div class="navbar-start">
    <a href="/" class="btn btn-ghost text-xl font-mono">Atlas</a>
  </div>
  <div class="navbar-center hidden sm:flex">
    <ul class="menu menu-horizontal px-1">
      <li><a href="/">Dashboard</a></li>
      <li><a href="/settings">Settings</a></li>
    </ul>
  </div>
  <div class="navbar-end">
  <button class="btn btn-primary" aria-label="Login" onclick={openDrawer}>Login</button>
  </div>
</header>
