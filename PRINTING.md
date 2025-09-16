PRINTING — quick resume guide
=============================

This file documents the current printing implementation, how to test it without hardware, and how to resume development.

Current state
-------------
- `print-task-item.cjs` — Node.js CommonJS helper that builds ESC/POS lines and can print to a USB printer using `escpos`.
  - Supports flags: `--dry-run` (no hardware) and `--qr=<url>` to include a QR in the output.
- `src/routes/api/print-task-item/+server.ts` — SvelteKit POST handler that spawns `node print-task-item.cjs` with the entities JSON. In development it includes `--dry-run` by default.
- `scripts/print-test-harness.cjs` — A harness that runs `print-task-item.cjs` in dry-run mode with sample entities.
- `src/lib/types/printing.ts` — Shared TypeScript types for print entities (not yet fully integrated across components).

Quick test steps (no hardware)
------------------------------
1. Run the harness (CommonJS):

   cmd.exe

   node scripts\print-test-harness.cjs

   You should see the `Atlas` header and the built lines printed in the console for each sample entity.

2. Run the smoke-check (runs harness and tries API POST):

   cmd.exe

   node scripts\smoke-print-check.cjs

   Notes:
   - The smoke script will attempt to POST to `http://localhost:5173/api/print-task-item`. If your dev server is running on a different port, edit the script accordingly.
   - The API will run the print script in `--dry-run` by default in non-production.

How to enable hardware printing (careful)
----------------------------------------
1. Install native dependencies required by your platform for `escpos` (e.g., libusb). See `escpos-usb` docs for platform instructions.
2. Ensure your device is accessible to Node and that you know the correct device path if needed. `print-task-item.cjs` currently uses the default USB constructor; you can set `devicePath` in the file to a specific path.
3. Run the server with NODE_ENV=production (or call the API with `dryRun=false`) to avoid passing `--dry-run`.
4. Test on a single entity with caution; run the script locally first (no server) using:

   node print-task-item.cjs '{"id":"demo","name":"Demo"}'

Troubleshooting
---------------
- If Node complains about `require` in a `.js` file, your `package.json` likely has `"type":"module"`. Use `.cjs` for CommonJS scripts (we added `.cjs` harnesses for this reason).
- If `escpos-usb` fails to find the device, confirm libusb/native drivers are installed and check platform permissions.
- For QR-related issues, use `--qr="https://example.com"` in the command and test in `--dry-run` first.

Next steps to resume work
------------------------
1. Integrate `src/lib/types/printing.ts` across the server and frontend handlers.
2. Add unit tests for the pure functions in `print-task-item.cjs` and a fast API test that posts with `dryRun=true`.
3. Add a UI for selecting the target printer and store the selection in app settings.

Files to inspect when returning
------------------------------
- `print-task-item.cjs`
- `src/routes/api/print-task-item/+server.ts`
- `scripts/print-test-harness.cjs`
- `scripts/print-test-harness.js` (legacy ESM harness — can be removed)
- `src/lib/types/printing.ts`
- This README (`PRINTING.md`)
