// scripts/print-test-harness.cjs
// Simple harness to run print-task-item.cjs in dry-run mode with sample entities
// Usage: node scripts/print-test-harness.cjs

const { execFile } = require('child_process');
const path = require('path');

const sampleEntities = [
  { id: 'proj-1', name: 'Demo Project', description: 'A sample project', priority: 'high', tags: ['demo', 'test'] },
  { id: 'task-1', project_id: 'proj-1', name: 'Demo Task', description: 'A sample task description' },
  { id: 'item-1', task_id: 'task-1', name: 'Demo Item', description: 'A sample task item' }
];

const scriptPath = path.resolve(process.cwd(), 'print-task-item.cjs');
const args = [scriptPath, JSON.stringify(sampleEntities), '--dry-run'];

execFile('node', args, { cwd: process.cwd(), timeout: 5000 }, (err, stdout, stderr) => {
  if (err) {
    console.error('Harness error:', err);
    process.exit(1);
  }
  console.log('Harness stdout:\n', stdout);
  if (stderr) console.error('Harness stderr:\n', stderr);
});
