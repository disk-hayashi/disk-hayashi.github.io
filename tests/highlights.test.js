const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("highlight cards use the agreed labels and data-driven counters", () => {
  const body = read("partials/body.shell.html");
  const model = read("lib/site-model.js");

  assert.match(body, /data-lang="ja">研究発表<\/span>/);
  assert.match(body, /id="stat-research-output-number"/);
  assert.match(body, /data-lang="ja">査読論文<\/span>/);
  assert.match(body, /id="stat-reviewed-paper-number"/);
  assert.match(body, /data-lang="ja">採用特許<\/span>/);

  assert.match(model, /Object\.values\(data\.publications\)\.flat\(\)/);
  assert.match(model, /labels\?\.includes\("reviewed"\)/);
});

test("current publication data yields 9 research outputs and 3 peer-reviewed papers", () => {
  const publications = require("../data/publications.data.js");
  const researchOutputs = Object.values(publications).flat();

  assert.equal(researchOutputs.length, 9);
  assert.equal(
    researchOutputs.filter((item) => item.labels?.includes("reviewed")).length,
    3
  );
});

test("desktop highlights are 4 + 3 centered, with responsive 2 and 1 columns", () => {
  const css = read("assets/css/site.css");

  assert.match(css, /\.highlight-grid\s*\{[^}]*grid-template-columns:\s*repeat\(8,/s);
  assert.match(css, /\.highlight-grid\s+\.stat-tile\s*\{[^}]*grid-column:\s*span 2/s);
  assert.match(css, /\.highlight-grid\s+\.stat-tile:nth-child\(5\)\s*\{[^}]*grid-column:\s*2\s*\/\s*span 2/s);
  assert.match(css, /@media \(max-width:\s*980px\)[\s\S]*?\.highlight-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,/);
  assert.match(css, /@media \(max-width:\s*720px\)[\s\S]*?\.highlight-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
});

test("Japanese publication navigation and heading are renamed to research presentations", () => {
  for (const file of ["partials/body.shell.html", "site.config.js", "build.js", "lib/render.js"]) {
    const source = read(file);
    assert.doesNotMatch(source, /論文発表/);
  }
});
