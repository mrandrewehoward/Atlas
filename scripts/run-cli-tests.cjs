// Simple test runner: require each test file listed here (resolve relative to repo root)
const path = require('path');
const tests = [
  path.resolve(process.cwd(), 'tests/cli/parser.test.cjs')
];

for (const t of tests) {
  try {
    require(t);
  } catch (err) {
    console.error('Test failed:', t, err && err.stack);
    process.exit(1);
  }
}
console.log('All CLI tests passed');
