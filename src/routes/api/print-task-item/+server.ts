
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { execFile } from 'child_process';

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  // Use name/description, fallback to title/description
  const task = {
    title: data.name || data.title || 'Task',
    description: data.description || ''
  };

  return new Promise((resolve) => {
    execFile(
      'node',
      ['print-task-item.cjs', JSON.stringify(task)],
      { cwd: process.cwd() },
      (error, stdout, stderr) => {
        if (error) {
          resolve(json({ success: false, error: stderr || error.message }, { status: 500 }));
        } else {
          resolve(json({ success: true, output: stdout }));
        }
      }
    );
  });
};
