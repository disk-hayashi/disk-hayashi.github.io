const test = require("node:test");
const assert = require("node:assert/strict");

const config = require("../site.config.js");
const siteData = require("../data/site.data.js");
const { createSiteModel } = require("../lib/site-model.js");

function context(key, lang) {
  const { pages, renderPage } = require("../lib/render.js");
  return renderPage({
    page: pages.find((item) => item.key === key),
    lang,
    model: createSiteModel(siteData),
    config,
    buildVersion: "test",
  });
}

test("Japanese home contains real counts and excludes publication lists", () => {
  const html = context("home", "ja");
  assert.match(html, /研究発表[\s\S]{0,500}stat-number[^>]*>9</);
  assert.match(html, /査読論文[\s\S]{0,500}stat-number[^>]*>3</);
  assert.match(html, /id="highlights"/);
  assert.doesNotMatch(html, /\$2/);
  assert.doesNotMatch(html, /id="journal-list"/);
  assert.doesNotMatch(html.slice(html.indexOf("<body")), /data-lang="en"/);
});

test("Japanese publications contains publication cards but no hero", () => {
  const html = context("publications", "ja");
  assert.match(html, /ACFI-DETR/);
  assert.match(html, /研究発表/);
  assert.match(html, /class="pub-item"/);
  assert.doesNotMatch(html, /class="hero"/);
});

test("navigation and highlight cards work without JavaScript", () => {
  const html = context("home", "ja");
  assert.match(html, /<a[^>]+href="\/ja\/publications\/"[^>]*>研究発表<\/a>/);
  assert.match(html, /<a[^>]+href="\/ja\/publications\/#publications"[^>]+class="stat-tile stat-link"/);
  assert.doesNotMatch(html, /data-scroll-target/);
});

test("English output uses English navigation and content", () => {
  const html = context("home", "en");
  assert.match(html, />Research Outputs</);
  assert.match(html, />Projects<\/a>/);
  assert.doesNotMatch(html.slice(html.indexOf("<body")), /data-lang="ja"/);
});

test("patent filter controls have accessible labels and live status", () => {
  const html = context("patents", "ja");
  for (const id of ["patent-search", "country-filter", "type-filter"]) {
    assert.match(html, new RegExp(`<label[^>]+for="${id}"`));
  }
  assert.match(html, /id="patent-filter-status"[^>]+aria-live="polite"/);
});
