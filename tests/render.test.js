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
  assert.match(html, /id="publication-summary"[\s\S]*?>研究発表<[\s\S]*?>9<[\s\S]*?>件<[\s\S]*?>ジャーナル論文<[\s\S]*?>1<[\s\S]*?>件<[\s\S]*?>国際会議論文<[\s\S]*?>2<[\s\S]*?>件</);
  assert.doesNotMatch(html, /publication-summary[\s\S]{0,500}>受賞</);
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
  for (const id of ["patent-search", "type-filter"]) {
    assert.match(html, new RegExp(`<label[^>]+for="${id}"`));
  }
  assert.doesNotMatch(html, /id="country-filter"/);
  assert.match(html, /id="patent-filter-status"[^>]+aria-live="polite"/);
});

test("publication cards expose named publication-platform links separately from titles", () => {
  const ja = context("publications", "ja");
  const en = context("publications", "en");
  assert.match(ja, /class="pub-links"[\s\S]*?>IEICE</);
  assert.match(ja, /class="pub-links"[\s\S]*?>IEEE Xplore</);
  assert.match(ja, /class="pub-links"[\s\S]*?>SpringerLink</);
  assert.match(ja, /class="pub-links"[\s\S]*?>J-STAGE</);
  assert.match(en, /class="pub-links"/);
  assert.doesNotMatch(ja, /class="pub-title"><a /);
});

test("Japanese publication cards can use Japanese author names while English keeps English names", () => {
  const ja = context("publications", "ja");
  const en = context("publications", "en");
  assert.match(ja, /name-strong">林 大介<\/span>, 日置 尋久/);
  assert.match(ja, /name-strong">林 大介<\/span>, 赤倉 貴子/);
  assert.match(en, /name-strong">Daisuke Hayashi<\/span>, Hirohisa Hioki/);
  assert.match(en, /name-strong">Daisuke Hayashi<\/span>, Takako Akakura/);
});
