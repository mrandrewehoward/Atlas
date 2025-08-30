<script>
// Placeholder for user/status/totals
const user = { name: 'andrew', status: 'online' };
const totals = { projects: 2, tasks: 2, items: 2 };
</script>

<footer class="footer bg-base-200 border-t border-base-300 text-xs px-4 py-2 flex justify-between items-center w-full fixed bottom-0 left-0 z-50">
  <div class="flex items-center gap-4">
    <span class="font-mono">User: <span class="font-bold text-primary">{user.name}</span></span>
    <span class="badge badge-success badge-xs">{user.status}</span>
  </div>
  <div class="flex items-center gap-4">
    <span>Projects: <span class="font-bold">{totals.projects}</span></span>
    <span>Tasks: <span class="font-bold">{totals.tasks}</span></span>
    <span>Items: <span class="font-bold">{totals.items}</span></span>
    <span class="text-neutral-content">{new Date().toLocaleTimeString()}</span>
  </div>
</footer>
