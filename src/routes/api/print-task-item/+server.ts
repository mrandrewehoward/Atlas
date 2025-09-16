
import type { RequestHandler } from '@sveltejs/kit';
import type { PrintEntity } from '$lib/types/printing';
import { json } from '@sveltejs/kit';
import { execFile } from 'child_process';

export const POST: RequestHandler = async ({ request, url }) => {
  const data = await request.json();
  // Accept an array of entities (from data.entities), fallback to single object
  let entities: PrintEntity[] = [];
  if (Array.isArray(data.entities)) {
    entities = data.entities;
  } else if (data.entities) {
    entities = [data.entities];
  } else if (data.name || data.title) {
    entities = [{ title: data.name || data.title || 'Task', description: data.description || '' }];
  }

  // Determine flags: dry-run unless in production
  const isProd = process.env.NODE_ENV === 'production';
  const dryRun = !isProd || !!data.dryRun;

  // QR can be provided in body as data.qr or as query param ?qr=...
  const qrFromBody = typeof data.qr === 'string' && data.qr.trim() ? data.qr.trim() : null;
  const qrFromQuery = url.searchParams.get('qr');
  const qr = qrFromBody || qrFromQuery || null;

  return new Promise((resolve) => {
    const args = ['print-task-item.cjs', JSON.stringify(entities)];
    if (dryRun) args.push('--dry-run');
    if (qr) args.push(`--qr=${qr}`);

    // Set a reasonable timeout (10s) to avoid hanging requests
    const child = execFile('node', args, { cwd: process.cwd(), timeout: 10000 }, (error, stdout, stderr) => {
      console.log('[Atlas][API][PRINT] stdout:', stdout);
      console.log('[Atlas][API][PRINT] stderr:', stderr);
      if (error) {
        console.error('[Atlas][API][PRINT][ERROR]', error);
        resolve(json({ success: false, error: stderr || error.message }, { status: 500 }));
      } else {
        resolve(json({ success: true, output: stdout }));
      }
    });

    // Forward child process events to server log for debugging
    child.on('error', (err) => console.error('[Atlas][API][PRINT][CHILD ERROR]', err));
  });
};
