// print-task-item.cjs
// Node.js helper script for ESC/POS printing (CommonJS)
// Usage: node print-task-item.cjs '<JSON>' [--dry-run] [--qr="https://example.com"]

const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const fs = require('fs');

const devicePath = null; // default USB device; customize if needed

function getPrintCount(id) {
  const file = 'print-counts.json';
  let counts = {};
  if (fs.existsSync(file)) {
    try { counts = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { /* ignore */ }
  }
  counts[id] = (counts[id] || 0) + 1;
  try { fs.writeFileSync(file, JSON.stringify(counts, null, 2)); } catch (e) { /* ignore */ }
  return counts[id];
}

function formatDate(dt) {
  return dt.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function safeParseArg(arg) {
  try {
    const parsed = JSON.parse(arg);
    return parsed;
  } catch (err) {
    throw new Error('Invalid JSON argument: ' + err.message);
  }
}

function normalizeEntities(input) {
  let entities = input;
  if (!Array.isArray(entities)) entities = [entities];
  entities = entities.filter(Boolean);
  if (!entities.length) throw new Error('No entities to print');
  return entities;
}

function validateEntity(entity) {
  if (!entity || typeof entity !== 'object') return 'Entity is not an object';
  if (entity.id && typeof entity.id !== 'string' && typeof entity.id !== 'number') return 'Invalid id type';
  // allow missing id for ad-hoc prints
  return null;
}

function buildPrintLines(entity) {
  const now = new Date();
  const id = entity.id || entity.title || entity.name || '(unknown)';
  const printCount = getPrintCount(String(id));
  const created = entity.created_at || entity.created || entity.createdAt || 'N/A';
  let priority = entity.priority;
  if (typeof priority === 'number') priority = priority === 1 ? 'High' : priority === 2 ? 'Medium' : priority === 3 ? 'Low' : String(priority);
  priority = priority || 'N/A';
  const due = entity.due_at || entity.due || 'N/A';
  let tags = 'N/A';
  if (Array.isArray(entity.tags)) tags = entity.tags.length ? entity.tags.join(', ') : 'N/A';
  else if (typeof entity.tags === 'string') tags = entity.tags || 'N/A';
  const projectName = entity.projectName || entity.project_name || entity.project || 'N/A';
  const taskName = entity.taskName || entity.task_name || entity.task || 'N/A';
  const title = entity.name || entity.title || '(No Title)';
  const desc = entity.description || '';

  const lines = [];
  lines.push('Atlas');
  lines.push("Holding someone's world up");
  lines.push(formatDate(now));
  lines.push('');
  // determine type label
  let typeLabel = 'Project';
  if (entity.task_id || entity.taskName || entity.type === 'item') typeLabel = 'Task Item';
  else if (entity.project_id || entity.projectName || entity.type === 'task') typeLabel = 'Task';
  lines.push(typeLabel + ':');
  lines.push(title);
  lines.push('');
  lines.push(`Print Count: ${entity.printed_count || printCount}`);
  lines.push(`Created On: ${created}`);
  lines.push(`Priority: ${priority}`);
  lines.push(`Due: ${due}`);
  lines.push(`Tags: ${tags}`);
  lines.push('');
  lines.push(`Project: ${projectName}`);
  if (typeLabel === 'Task Item') lines.push(`Task: ${taskName}`);
  lines.push('');
  if (desc) lines.push(desc);
  lines.push('');
  return lines;
}

function doHardwarePrint(device, entity, qrUrl) {
  return new Promise((resolve, reject) => {
    try {
      const printer = new escpos.Printer(device);
      const lines = buildPrintLines(entity);
      // Chain simple text output
      lines.forEach(line => printer.text(line));
      if (qrUrl) {
        // print QR if supported/desired; use small size
        try {
          printer.align('ct');
          printer.qrimage(qrUrl, { size: 3 }, function() {
            printer.cut().feed(1).close();
            resolve();
          });
          return; // qrimage handles close callback
        } catch (err) {
          // fallback: ignore QR failures
          console.warn('[Atlas][PRINT] QR generation failed:', err && err.message);
        }
      }
      // No QR
      printer.cut().feed(1).close();
      // give a short delay to ensure commands are flushed
      setTimeout(resolve, 200);
    } catch (err) {
      reject(err);
    }
  });
}

async function printEntities(entities, options = { dryRun: false, qrUrl: null }) {
  const { dryRun, qrUrl } = options;
  for (const ent of entities) {
    const vErr = validateEntity(ent);
    if (vErr) {
      console.error('[Atlas][PRINT][ERROR] Validation failed for entity:', vErr, ent);
      continue; // skip invalid
    }
    console.log('[Atlas][PRINT] Preparing to print:', ent.id || ent.title || ent.name || '(no-id)');
    if (dryRun) {
      console.log('[Atlas][PRINT][DRY-RUN] Would print lines:\n' + buildPrintLines(ent).join('\n'));
      continue;
    }
    // Open device per-entity to avoid device locking issues; keep it simple and reliable
    const device = devicePath ? new escpos.USB(devicePath) : new escpos.USB();
    await new Promise((res, rej) => {
      device.open(async function(err) {
        if (err) {
          console.error('[Atlas][PRINT][ERROR] Device open failed:', err && err.message);
          return rej(err);
        }
        try {
          await doHardwarePrint(device, ent, qrUrl);
          res();
        } catch (err) {
          rej(err);
        }
      });
    }).catch(err => {
      console.error('[Atlas][PRINT][ERROR] Failed printing entity:', err && err.message);
    });
    // small delay between prints
    await new Promise(r => setTimeout(r, 300));
  }
}

// --------- Main CLI handling ---------
console.log('[Atlas][PRINT] Script started');
try {
  const rawArg = process.argv[2];
  if (!rawArg) throw new Error('No argument provided to print-task-item.cjs');
  const parsed = safeParseArg(rawArg);
  const entities = normalizeEntities(parsed);
  // parse flags
  const dryRun = process.argv.includes('--dry-run');
  // support --qr="url"
  const qrFlag = process.argv.find(a => a.startsWith('--qr='));
  const qrUrl = qrFlag ? qrFlag.split('=')[1] : null;

  printEntities(entities, { dryRun, qrUrl }).then(() => {
    console.log('[Atlas][PRINT] Completed printing batch.');
    process.exit(0);
  }).catch(err => {
    console.error('[Atlas][PRINT][ERROR] Batch printing failed:', err && err.message);
    process.exit(1);
  });

} catch (err) {
  console.error('[Atlas][PRINT][ERROR]', err && err.message);
  process.exit(1);
}
