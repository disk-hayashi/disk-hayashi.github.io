const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("pages do not depend on client-side rendering", () => {
  for (const file of ["index.html", "ja/index.html", "ja/publications/index.html", "ja/patents/index.html"]) {
    const html = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(html, /page-split\.js|window\.__SITE_DATA__|data-scroll-target/);
  }
});

test("site script is limited to patent filtering", () => {
  const source = fs.readFileSync("assets/js/site.js", "utf8");
  assert.match(source, /setupPatentFilters/);
  assert.doesNotMatch(source, /renderAll|renderPublications|updateStats|updateNav|splitSections/);
});

test("only patent pages load the client script", () => {
  assert.doesNotMatch(fs.readFileSync("ja/index.html", "utf8"), /assets\/js\/site\.js/);
  assert.match(fs.readFileSync("ja/patents/index.html", "utf8"), /assets\/js\/site\.js/);
});
