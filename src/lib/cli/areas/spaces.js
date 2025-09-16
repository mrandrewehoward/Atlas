// @ts-nocheck
const sample = [
  { id: 's-1', name: 'Atlas', order: 1 },
  { id: 's-2', name: 'Beta', order: 2 },
  { id: 's-3', name: 'Gamma', order: 3 }
];

async function list(ctx, subject, flags) {
  return sample.map((s, i) => ({ idx: i+1, id: s.id, name: s.name }));
}

async function help() {
  return 'spaces: list, add, edit, del, sel, stats';
}

async function sel(ctx, subject) {
  if (!subject) throw new Error('no subject');
  const idx = parseInt(subject, 10);
  if (!isNaN(idx)) return sample[idx-1];
  return sample.find(s => s.id === subject || s.name.toLowerCase() === subject.toLowerCase());
}

module.exports = { list, sel, help };
