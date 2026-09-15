const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { createSiteModel } = require("../lib/site-model.js");
const siteData = require("../data/site.data.js");
const { pages, renderPage } = require("../lib/render.js");

test("home uses ProfilePage metadata and dedicated social artwork", () => {
  const html = fs.readFileSync("ja/index.html", "utf8");
  assert.match(html, /"@type":"ProfilePage"/);
  assert.match(html, /og-profile\.png/);
  assert.match(html, /<meta property="og:image:width" content="1200">/);
  assert.match(html, /<meta property="og:image:height" content="630">/);
  assert.match(html, /<meta property="og:image:alt"/);
});

test("subpages use WebPage metadata", () => {
  assert.match(fs.readFileSync("ja/publications/index.html", "utf8"), /"@type":"WebPage"/);
});

test("Open Graph PNG is exactly 1200 by 630 pixels", () => {
  const png = fs.readFileSync("assets/images/og-profile.png");
  assert.equal(png.toString("ascii", 1, 4), "PNG");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test("configured base URL is used consistently in metadata", () => {
  const html = renderPage({ page: pages[0], lang: "en", model: createSiteModel(siteData), buildVersion: "test", config: { baseUrl: "https://example.test" } });
  assert.match(html, /https:\/\/example\.test\/assets\/images\/og-profile\.png/);
  assert.match(html, /https:\/\/example\.test\/#person/);
  assert.doesNotMatch(html, /disk-hayashi\.github\.io/);
});
