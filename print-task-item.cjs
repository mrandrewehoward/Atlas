// print-task-item.cjs
// Node.js helper script for ESC/POS printing (CommonJS)
// Usage: node print-task-item.cjs '{"title":"Task Title","description":"Details"}'



const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const fs = require('fs');

const device = new escpos.USB();
const printer = new escpos.Printer(device);

function getPrintCount(id) {
  const file = 'print-counts.json';
  let counts = {};
  if (fs.existsSync(file)) {
    try {
      counts = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {}
  }
  counts[id] = (counts[id] || 0) + 1;
  fs.writeFileSync(file, JSON.stringify(counts));
  return counts[id];
}

function formatDate(dt) {
  return dt.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function printTaskItem(task) {
  const now = new Date();
  const printCount = getPrintCount(task.id || task.title || 'unknown');
  device.open(function() {
    printer
  // App header
  .font('a')
  .align('ct')
  .style('b')
  .size(2, 2)
  .text('Atlas')
  .size(0, 0)
  .style('normal')
  .text("Holding someone's world up")
  .text('')
      // Date/time
      .text(formatDate(now))
      .text('')
      // Task Item section (big and bold)
      .align('lt')
      .style('b')
      .size(1, 1)
      .text('Task Item:')
      .text(task.name ? task.name : (task.title || 'Task Item'))
      .size(0, 0)
      .style('normal')
      .text('')
      // Stats and fields (small)
      .text(`Print Count: ${printCount}`)
      .text(`Created On: ${task.created_at || 'N/A'}`)
      .text(`Priority: ${task.priority || 'N/A'}`)
      .text(`Due: ${task.due || 'N/A'}`)
      .text(`Tags: ${Array.isArray(task.tags) ? task.tags.join(', ') : (task.tags || 'N/A')}`)
      .text('')
      // Project and Task (big)
      .size(1, 1)
      .text(`Project: ${task.projectName || 'N/A'}`)
      .text(`Task: ${task.taskName || 'N/A'}`)
      .size(0, 0)
      .text('')
      // Description
      .text(task.description || '')
      .text('')
      // QR code and whitespace
      .text('')
      .text('')
      .align('ct')
        .qrimage('https://www.youtube.com/watch?v=dQw4w9WgXcQ', { size: 4 }, function() {
          // No .close() here
        })
    .cut()
    .feed(2)
    .close();
  });
}

console.log('[Atlas][PRINT] Script started');
try {
  const arg = process.argv[2];
  if (!arg) throw new Error('No argument provided to print-task-item.cjs');
  const task = JSON.parse(arg);
  printTaskItem(task);
} catch (err) {
  console.error('[Atlas][PRINT][ERROR]', err);
  process.exit(1);
}
