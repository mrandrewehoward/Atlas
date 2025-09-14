
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { execFile } from 'child_process';

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  // Accept an array of entities (from data.entities), fallback to single object
  let entities = [];
  if (Array.isArray(data.entities)) {
    entities = data.entities;
  } else if (data.entities) {
    entities = [data.entities];
  } else if (data.name || data.title) {
    entities = [{ title: data.name || data.title || 'Task', description: data.description || '' }];
  }

  return new Promise((resolve) => {
    execFile(
      'node',
      ['print-task-item.cjs', JSON.stringify(entities)],
      { cwd: process.cwd() },
      (error, stdout, stderr) => {
        console.log('[Atlas][API][PRINT] stdout:', stdout);
        console.log('[Atlas][API][PRINT] stderr:', stderr);
        if (error) {
          console.error('[Atlas][API][PRINT][ERROR]', error);
          resolve(json({ success: false, error: stderr || error.message }, { status: 500 }));
        } else {
          resolve(json({ success: true, output: stdout }));
        }
      }
    );
  });
};
