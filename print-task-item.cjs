// print-task-item.cjs
// Node.js helper script for ESC/POS printing (CommonJS)
// Usage: node print-task-item.cjs '{"title":"Task Title","description":"Details"}'


const escpos = require('escpos');
// Assign escpos-usb adapter as per official docs
escpos.USB = require('escpos-usb');

const device = new escpos.USB();
const printer = new escpos.Printer(device);

function printTaskItem(task) {
  device.open(function() {
    printer
      .align('CT')
      .text(task.title || 'Task')
      .text(task.description || '')
      .cut()
      .close();
  });
}

try {
  const arg = process.argv[2];
  if (!arg) throw new Error();
  const task = JSON.parse(arg);
  printTaskItem(task);
} catch {
  process.exit(1);
}
