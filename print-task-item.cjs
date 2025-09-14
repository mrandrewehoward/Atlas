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
  console.log('[Atlas][PRINT][DEBUG] Incoming task data:', JSON.stringify(task, null, 2));
  const now = new Date();
  const printCount = getPrintCount(task.id || task.title || 'unknown');

  // Determine entity type (item or task)
  const isItem = !!task.task_id || !!task.taskName;
  const isTask = !!task.project_id || !!task.projectName;

  // Print count: prefer entity field, fallback to local count
  const printCountValue = task.printed_count || printCount;

  // Created date: check all schema variants
  const createdValue = task.created_at || task.created || task.createdAt || task.creation_timestamp || 'N/A';

  // Priority: show as string if mapped, else raw value
  let priorityValue = task.priority;
  if (typeof priorityValue === 'number') {
    priorityValue = priorityValue === 1 ? 'High' : priorityValue === 2 ? 'Medium' : priorityValue === 3 ? 'Low' : priorityValue;
  }
  if (!priorityValue) priorityValue = 'N/A';

  // Due date
  const dueValue = task.due_at || task.due || 'N/A';

  // Tags: array or string
  let tagsValue = 'N/A';
  if (Array.isArray(task.tags)) {
    tagsValue = task.tags.length ? task.tags.join(', ') : 'N/A';
  } else if (typeof task.tags === 'string') {
    tagsValue = task.tags || 'N/A';
  }

  // Project and Task names
  const projectName = task.projectName || task.project_name || task.project || 'N/A';
  const taskName = task.taskName || task.task_name || task.task || 'N/A';

  device.open(function() {
    printer
      // App header
      .feed(1)
      .font('a')
      .align('ct')
      .style('b')
      .size(2, 2)
      .text('Atlas')
      .size(0, 0)
      .style('normal')
      .text("Holding someone's world up")
      // Date/time
      .text(formatDate(now))
      .text('')
      // Entity section (big and bold)
      .align('lt')
      .style('b')
      .size(1, 1)
      .text(isItem ? 'Task Item:' : 'Task:')
      .text(task.name ? task.name : (task.title || (isItem ? 'Task Item' : 'Task')))
      .size(0, 0)
      .style('normal')
      .text('')
      // Stats and fields (small)
      .text(`Print Count: ${printCountValue}`)
      .text(`Created On: ${createdValue}`)
      .text(`Priority: ${priorityValue}`)
      .text(`Due: ${dueValue}`)
      .text(`Tags: ${tagsValue}`)
      .text('')
      // Project and Task names
      .size(1, 1)
      .text(`Project: ${projectName}`)
      .text(isItem ? `Task: ${taskName}` : '')
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
      .feed(1)
      .close();
  });
}

console.log('[Atlas][PRINT] Script started');
try {
  const arg = process.argv[2];
  if (!arg) throw new Error('No argument provided to print-task-item.cjs');
  let entities = JSON.parse(arg);
  if (!Array.isArray(entities)) entities = [entities];
  if (!entities.length) throw new Error('No entities to print');

  let idx = 0;
  function printNext() {
    if (idx >= entities.length) {
      console.log('[Atlas][PRINT] All entities printed.');
      return;
    }
    printTaskItem(entities[idx], function() {
      idx++;
      setTimeout(printNext, 500); // Small delay between prints
    });
  }
  printNext();
} catch (err) {
  console.error('[Atlas][PRINT][ERROR]', err);
  process.exit(1);
}

function printTaskItem(entity, cb) {
  // Debug log for each entity
  console.log('[Atlas][PRINT][DEBUG] Printing entity:', JSON.stringify(entity, null, 2));
  if (entity.id && typeof entity.id !== 'string') {
    console.error('[Atlas][PRINT][ERROR] Invalid entity.id:', entity.id, 'Expected a string UUID.');
    if (cb) cb();
    return;
  }
  const now = new Date();
  // Entity type detection
  let type = 'item';
  if (entity.type) {
    type = entity.type;
  } else if (entity.task_id) {
    type = 'item';
  } else if (entity.project_id) {
    type = 'task';
  } else {
    type = 'project';
  }

  // Print header
  const header = type === 'item' ? 'Task Item' : type.charAt(0).toUpperCase() + type.slice(1);
  const title = entity.name || entity.title || '(No Title)';
  const desc = entity.description || '';

  device.open(function() {
    printer
      // Two blank lines above header
      // App header
      .font('a')
      .align('ct')
      .style('b')
      .size(2, 2)
      .text('Atlas')
      .size(0, 0)
      .style('normal')
      .text("Holding someone's world up")
      // Date/time
      .text(formatDate(now))
      .text('')
      // Entity type and title/desc
      .align('lt')
      .style('b')
      .size(1, 1)
      .text(header)
      .text(title)
      .size(0, 0)
      .style('normal')
      .text('')
      .text(desc)
      // Two blank lines below description
      .text('')
      .text('')
      .text('')
      .text('')
      .cut()
      .close();
    if (cb) cb();
  });
}
