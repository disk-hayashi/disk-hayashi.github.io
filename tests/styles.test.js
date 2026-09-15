const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("generated pages use one external stylesheet", () => {
  const html = fs.readFileSync("ja/index.html", "utf8");
  assert.match(html, /<link rel="stylesheet" href="\/assets\/css\/site\.css\?v=/);
  assert.doesNotMatch(html, /<style>/);
});

test("highlight breakpoints preserve 4+3, 2, and 1 layouts", () => {
  const css = fs.readFileSync("assets/css/site.css", "utf8");
  assert.match(css, /grid-template-columns:\s*repeat\(8,/);
  assert.match(css, /nth-child\(5\)[^{]*\{[^}]*grid-column:\s*2\s*\/\s*span 2/s);
  assert.match(css, /max-width:\s*980px[\s\S]*repeat\(2,/);
  assert.match(css, /max-width:\s*720px[\s\S]*grid-template-columns:\s*1fr/);
});
