// scripts/smoke-print-check.cjs
// Runs the dry-run harness and attempts a dry-run POST to the local API.
// Usage: node scripts/smoke-print-check.cjs

const { execFile } = require('child_process');
const path = require('path');

function runHarness() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(process.cwd(), 'print-task-item.cjs');
    const args = [scriptPath, JSON.stringify([{ id: 'smoke-1', name: 'Smoke Test' }]), '--dry-run'];
    execFile('node', args, { cwd: process.cwd(), timeout: 7000 }, (err, stdout, stderr) => {
      if (err) {
        console.error('[smoke] Harness failed:', err && err.message);
        console.error('[smoke] stderr:', stderr);
        return reject(err);
      }
      console.log('[smoke] Harness output:\n', stdout);
      resolve(stdout);
    });
  });
}

async function postToApi() {
  const url = process.env.PRINT_API_URL || 'http://localhost:5173/api/print-task-item';
  const payload = { entities: [{ id: 'smoke-2', name: 'Smoke API Test' }], dryRun: true };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // keep short
    });
    const text = await res.text();
    console.log('[smoke] API response status:', res.status);
    console.log('[smoke] API response body:', text);
  } catch (err) {
    console.error('[smoke] API POST failed — is your dev server running?');
    console.error('[smoke] Error:', err && err.message);
  }
}

(async () => {
  console.log('[smoke] Running print harness (dry-run)...');
  try {
    await runHarness();
  } catch (e) {
    console.warn('[smoke] Harness step failed, continuing to API step.');
  }

  console.log('[smoke] Attempting POST to print API (dry-run)...');
  await postToApi();

  console.log('[smoke] Done.');
})();
