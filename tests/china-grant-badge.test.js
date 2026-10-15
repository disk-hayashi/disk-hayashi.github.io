const fs = require('fs');
const assert = require('assert');
const ja = fs.readFileSync('ja/patents/index.html', 'utf8');
const en = fs.readFileSync('patents/index.html', 'utf8');
assert.match(ja, /<span class="tag china-granted">中国登録<\/span>/);
assert.match(en, /<span class="tag china-granted">Granted in China<\/span>/);
console.log('china grant badge test passed');
