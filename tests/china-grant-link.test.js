const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('China patent family points to the granted B publication on Patsnap', () => {
  const data = fs.readFileSync('data/patents.data.js', 'utf8');
  assert.match(data, /"publicationNumber": "CN117716436B"/);
  assert.match(data, /"url": "https:\/\/eureka\.patsnap\.com\/patent\/CN117716436B"/);
  assert.doesNotMatch(data, /patents\.google\.com\/patent\/CN117716436A/);
});
