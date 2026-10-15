const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('patent summary uses four columns on desktop', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'site.css'), 'utf8');
  const block = css.match(/\.patent-summary\s*\{[\s\S]*?\}/)?.[0] || '';
  assert.match(block, /grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
});
