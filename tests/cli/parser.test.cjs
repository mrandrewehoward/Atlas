// @ts-nocheck
const assert = require('assert');
const { parse } = require('../../src/lib/cli/parser.cjs');

function testParse() {
  const p1 = parse('/spaces list');
  assert.ok(p1, 'parse("/spaces list") returned null');
  assert.strictEqual(p1.area, 'spaces');
  assert.strictEqual(p1.action, 'list');

  const p2 = parse('list');
  assert.ok(p2, 'parse("list") returned null');
  assert.strictEqual(p2.area, null);
  assert.strictEqual(p2.action, 'list');

  const p3 = parse('/projects add -n "New Project" -s 2');
  assert.ok(p3, 'parse("/projects add -n \"New Project\" -s 2") returned null');
  assert.strictEqual(p3.area, 'projects');
  assert.strictEqual(p3.flags.n, 'New Project');
  assert.strictEqual(p3.flags.s, '2');

  console.log('parser tests passed');
}

testParse();
