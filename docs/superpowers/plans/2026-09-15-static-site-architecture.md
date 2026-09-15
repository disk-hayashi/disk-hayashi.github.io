# Profile Site Static Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce complete page-specific bilingual HTML at build time, improve reliability and accessibility, add social metadata artwork, and enforce verification before GitHub Pages deployment.

**Architecture:** `build.js` will own content rendering and emit a complete HTML document for each configured route. Source data stays in `data/*.data.js`; browser JavaScript is limited to patent filtering, while shared visual rules move into one cacheable stylesheet.

**Tech Stack:** Node.js 22, CommonJS, `node:test`, static HTML/CSS/JavaScript, GitHub Actions, SVG-to-PNG rendering with an installed image tool.

**Spec:** `docs/superpowers/specs/2026-09-15-static-site-architecture-design.md`

## Global Constraints

- Preserve all existing public URLs and source data.
- Preserve the current visual design, colors, typography, four-plus-three desktop highlights, two-column tablet highlights, and one-column mobile highlights.
- Do not add a framework, analytics, cookies, forms, or an external service.
- All visible counts and content must exist in generated HTML before JavaScript runs.
- Japanese pages render Japanese UI text; English pages render English UI text.
- A failed test or build must prevent deployment.

---

### Task 1: Build model and statistics

**Files:**
- Create: `lib/site-model.js`
- Create: `tests/site-model.test.js`
- Modify: `build.js`

**Interfaces:**
- Consumes: data collections from `data/site.data.js`.
- Produces: `createSiteModel(siteData)` returning `{ stats, publications, patents, awards, topProductCards, researchImpactProjects, certifications, societies }`.
- Produces: `validateSiteData(siteData)` that throws a descriptive `TypeError` for missing required collections.

- [ ] **Step 1: Write failing model tests**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const siteData = require("../data/site.data.js");
const { createSiteModel, validateSiteData } = require("../lib/site-model.js");

test("derives all highlight statistics from source data", () => {
  const model = createSiteModel(siteData);
  assert.equal(model.stats.researchOutputs, 9);
  assert.equal(model.stats.reviewedPapers, 3);
  assert.equal(model.stats.patentApplications, siteData.patents.length);
});

test("rejects a missing publication collection", () => {
  assert.throws(
    () => validateSiteData({ ...siteData, publications: null }),
    /publications must be an object/
  );
});
```

- [ ] **Step 2: Run the tests and confirm the missing-module failure**

Run: `node --test tests/site-model.test.js`

Expected: FAIL because `../lib/site-model.js` does not exist.

- [ ] **Step 3: Implement the model**

```js
function validateSiteData(data) {
  if (!data.publications || typeof data.publications !== "object") {
    throw new TypeError("publications must be an object");
  }
  for (const key of ["journals", "international", "domestic"]) {
    if (!Array.isArray(data.publications[key])) {
      throw new TypeError(`publications.${key} must be an array`);
    }
  }
  for (const key of ["patents", "awards", "topProductCards", "researchImpactProjects", "societies"]) {
    if (!Array.isArray(data[key])) throw new TypeError(`${key} must be an array`);
  }
}

function createSiteModel(data) {
  validateSiteData(data);
  const outputs = Object.values(data.publications).flat();
  return {
    ...data,
    stats: {
      productized: data.topProductCards.length,
      awards: data.awards.length,
      researchOutputs: outputs.length,
      reviewedPapers: outputs.filter((item) => item.labels?.includes("reviewed")).length,
      patentApplications: data.patents.length,
      registeredPatents: data.patents.filter((item) => item.isRegistered).length,
      adoptedPatents: data.patents.filter((item) => item.isProductUsed).length,
    },
  };
}

module.exports = { createSiteModel, validateSiteData };
```

- [ ] **Step 4: Use `createSiteModel` in `build.js` and run tests**

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 5: Commit the model**

```bash
git add lib/site-model.js tests/site-model.test.js build.js
git commit -m "refactor: derive profile statistics at build time"
```

### Task 2: Server-side component renderers

**Files:**
- Create: `lib/render.js`
- Create: `tests/render.test.js`
- Modify: `build.js`
- Delete after migration: `partials/body.shell.html`

**Interfaces:**
- Consumes: `renderPage({ page, lang, model, config, buildVersion })`.
- Produces: one complete HTML string with page-specific navigation, metadata, and content.
- Internal renderers: `renderNav`, `renderHero`, `renderHighlights`, `renderProjects`, `renderPublications`, `renderPatents`, `renderCareer`, and `renderFooter`.

- [ ] **Step 1: Write failing page-content tests**

```js
test("Japanese home contains real counts and excludes publication lists", () => {
  const html = renderPage(fixture("home", "ja"));
  assert.match(html, />研究発表<\/span>[\s\S]*?>9</);
  assert.match(html, />査読論文<\/span>[\s\S]*?>3</);
  assert.match(html, /id="highlights"/);
  assert.doesNotMatch(html, /id="journal-list"/);
});

test("Japanese publications contains publication cards but no hero", () => {
  const html = renderPage(fixture("publications", "ja"));
  assert.match(html, /ACFI-DETR/);
  assert.match(html, /研究発表/);
  assert.doesNotMatch(html, /class="hero"/);
});

test("navigation is usable without JavaScript", () => {
  const html = renderPage(fixture("home", "ja"));
  assert.match(html, /<a href="\/ja\/publications\/"[^>]*>研究発表<\/a>/);
  assert.doesNotMatch(html, /data-scroll-target/);
});
```

- [ ] **Step 2: Run the render tests and confirm they fail**

Run: `node --test tests/render.test.js`

Expected: FAIL because `lib/render.js` does not exist.

- [ ] **Step 3: Implement escaping and bilingual field helpers**

```js
function esc(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function localized(item, lang, stem) {
  return item[`${lang}${stem[0].toUpperCase()}${stem.slice(1)}`] || "";
}
```

- [ ] **Step 4: Implement semantic navigation and page renderers**

Build navigation with route-aware links, an `aria-current="page"` attribute, and direct JA/EN counterpart URLs. Render cards from the existing data fields and preserve the current class names so the visual appearance remains stable.

```js
const pageSections = {
  home: [renderHero, renderHighlights],
  projects: [renderProjects],
  publications: [renderPublications],
  patents: [renderPatents],
  career: [renderCareer],
};

function renderMain(context) {
  return pageSections[context.page.key].map((renderSection) => renderSection(context)).join("\n");
}
```

- [ ] **Step 5: Wire `build.js` to `renderPage` and remove shell replacement**

Replace `template.html` and `partials/body.shell.html` substitution with one `renderPage` call per configured localized route. Keep `outputPathFromUrlPath`, sitemap creation, and robots creation.

- [ ] **Step 6: Run focused and complete tests**

Run: `node --test tests/render.test.js && npm test && npm run build`

Expected: all tests PASS and all ten HTML pages are generated.

- [ ] **Step 7: Commit page rendering**

```bash
git add build.js lib/render.js tests/render.test.js partials/body.shell.html template.html
git commit -m "refactor: render page-specific HTML at build time"
```

### Task 3: External stylesheet and responsive preservation

**Files:**
- Create: `assets/css/site.css`
- Modify: `partials/head.meta.html`
- Modify: `lib/render.js`
- Create: `tests/styles.test.js`

**Interfaces:**
- Produces: `/assets/css/site.css` linked by every generated page.

- [ ] **Step 1: Write failing stylesheet tests**

```js
test("generated pages use the external stylesheet", () => {
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
```

- [ ] **Step 2: Run tests and confirm they fail**

Run: `node --test tests/styles.test.js`

Expected: FAIL because the stylesheet does not exist and inline CSS remains.

- [ ] **Step 3: Move and consolidate CSS**

Move the style block from `partials/head.meta.html` into `assets/css/site.css`. Consolidate repeated declarations for `.highlight-grid`, `.stat-tile`, `.section-head`, and duplicated hover rules. Preserve computed values from the final cascading definition.

- [ ] **Step 4: Link the versioned stylesheet and remove inline CSS**

```html
<link rel="stylesheet" href="/assets/css/site.css?v={{BUILD_VERSION}}">
```

- [ ] **Step 5: Run tests and build**

Run: `npm test && npm run build`

Expected: PASS; generated pages contain the link and no style block.

- [ ] **Step 6: Commit styles**

```bash
git add assets/css/site.css partials/head.meta.html lib/render.js tests/styles.test.js
git commit -m "refactor: extract and consolidate site styles"
```

### Task 4: Minimal progressive-enhancement JavaScript

**Files:**
- Modify: `assets/js/site.js`
- Delete: `assets/js/page-split.js`
- Create: `tests/client-script.test.js`
- Modify: `lib/render.js`

**Interfaces:**
- Consumes: server-rendered patent cards carrying `data-query`, `data-status`, and `data-category` attributes.
- Produces: client-side patent filtering only.

- [ ] **Step 1: Write failing dependency tests**

```js
test("pages do not depend on page-split or client rendering", () => {
  const html = fs.readFileSync("ja/index.html", "utf8");
  assert.doesNotMatch(html, /page-split\.js/);
  assert.doesNotMatch(html, /window\.__SITE_DATA__/);
  assert.doesNotMatch(html, /data-scroll-target/);
});

test("site script is limited to patent-filter behavior", () => {
  const source = fs.readFileSync("assets/js/site.js", "utf8");
  assert.match(source, /setupPatentFilters/);
  assert.doesNotMatch(source, /renderAll|renderPublications|updateStats|updateNav|splitSections/);
});
```

- [ ] **Step 2: Run the tests and confirm legacy dependencies fail**

Run: `node --test tests/client-script.test.js`

Expected: FAIL because generated pages still load page-split and serialized site data.

- [ ] **Step 3: Replace `site.js` with patent-filter setup**

```js
(function () {
  function setupPatentFilters() {
    const search = document.getElementById("patent-search");
    const status = document.getElementById("patent-status-filter");
    const category = document.getElementById("patent-category-filter");
    const cards = Array.from(document.querySelectorAll("[data-patent-card]"));
    if (!search || !status || !category || !cards.length) return;

    const apply = () => {
      const query = search.value.trim().toLowerCase();
      for (const card of cards) {
        const matchesQuery = !query || card.dataset.query.includes(query);
        const matchesStatus = !status.value || card.dataset.status.split(" ").includes(status.value);
        const matchesCategory = !category.value || card.dataset.category === category.value;
        card.hidden = !(matchesQuery && matchesStatus && matchesCategory);
      }
    };

    [search, status, category].forEach((control) => control.addEventListener("input", apply));
  }

  document.addEventListener("DOMContentLoaded", setupPatentFilters);
})();
```

- [ ] **Step 4: Remove legacy script/data injection and delete `page-split.js`**

Only patent pages load `site.js`; other pages require no client JavaScript.

- [ ] **Step 5: Run tests and build**

Run: `npm test && npm run build`

Expected: PASS with no reference to `page-split.js` or `window.__SITE_DATA__`.

- [ ] **Step 6: Commit client simplification**

```bash
git add assets/js/site.js assets/js/page-split.js lib/render.js tests/client-script.test.js
git commit -m "refactor: limit client JavaScript to patent filters"
```

### Task 5: SEO metadata and Open Graph artwork

**Files:**
- Create: `scripts/create-og-image.js`
- Create: `assets/images/og-profile.svg`
- Create: `assets/images/og-profile.png`
- Modify: `build.js`
- Modify: `lib/render.js`
- Modify: `partials/head.meta.html`
- Create: `tests/seo.test.js`

**Interfaces:**
- Produces: 1200 × 630 `assets/images/og-profile.png`.
- Produces: `ProfilePage` JSON-LD on home routes and `WebPage` JSON-LD on subpages.

- [ ] **Step 1: Write failing SEO tests**

```js
test("home metadata uses ProfilePage and dedicated social artwork", () => {
  const html = fs.readFileSync("ja/index.html", "utf8");
  assert.match(html, /"@type":"ProfilePage"/);
  assert.match(html, /og-profile\.png/);
  assert.match(html, /<meta property="og:image:width" content="1200">/);
  assert.match(html, /<meta property="og:image:height" content="630">/);
});

test("subpage metadata uses WebPage", () => {
  const html = fs.readFileSync("ja/publications/index.html", "utf8");
  assert.match(html, /"@type":"WebPage"/);
});
```

- [ ] **Step 2: Run tests and confirm metadata failures**

Run: `node --test tests/seo.test.js`

Expected: FAIL because the current schema is `Person` and the social image is the portrait.

- [ ] **Step 3: Generate branded 1200 × 630 artwork**

Create an SVG with a light blue/white background, left-aligned name and role, affiliations and focus-area text, and a circular crop of `profile.jpg` on the right. Convert it to PNG using an available local renderer; verify exact dimensions after conversion.

- [ ] **Step 4: Implement route-specific JSON-LD**

```js
const person = {
  "@type": "Person",
  "@id": `${baseUrl}/#person`,
  name: lang === "ja" ? "林 大介" : "Daisuke Hayashi",
  alternateName: lang === "ja" ? "Daisuke Hayashi" : "林 大介",
};

const jsonLd = page.key === "home"
  ? { "@context": "https://schema.org", "@type": "ProfilePage", url: canonical, mainEntity: person }
  : { "@context": "https://schema.org", "@type": "WebPage", url: canonical, about: person };
```

- [ ] **Step 5: Update Open Graph and Twitter fields**

Reference `${BASE_URL}/assets/images/og-profile.png`, include width, height, MIME type, and a localized image alt field.

- [ ] **Step 6: Run SEO tests, build, and dimension check**

Run: `npm test && npm run build && identify assets/images/og-profile.png`

Expected: tests PASS and output reports `1200x630`.

- [ ] **Step 7: Commit SEO assets**

```bash
git add scripts/create-og-image.js assets/images/og-profile.svg assets/images/og-profile.png build.js lib/render.js partials/head.meta.html tests/seo.test.js
git commit -m "feat: add profile page metadata and social artwork"
```

### Task 6: Generated-site integrity and deployment gate

**Files:**
- Create: `tests/generated-site.test.js`
- Modify: `.github/workflows/pages.yml`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm test` that builds into the working tree and validates all configured outputs and links.

- [ ] **Step 1: Write failing generated-link tests**

The test runs `node build.js`, loads every configured route, extracts root-relative `href` and `src` attributes, strips query strings and fragments, maps route URLs to `index.html`, and asserts that each target exists. It also checks all configured routes appear in `sitemap.xml`.

```js
for (const target of collectInternalTargets(html)) {
  assert.ok(fs.existsSync(resolveTarget(target)), `${output}: missing ${target}`);
}
```

- [ ] **Step 2: Run the generated-site test and confirm the intended initial failure**

Run: `node --test tests/generated-site.test.js`

Expected: FAIL until the target resolver and all new static assets are connected.

- [ ] **Step 3: Complete the test helper and package scripts**

```json
{
  "scripts": {
    "build": "node build.js",
    "test": "node --test tests/*.test.js",
    "check": "npm test && npm run build"
  }
}
```

- [ ] **Step 4: Gate deployment on tests**

Insert before the build step:

```yaml
- name: Test
  run: npm test

- name: Build
  run: npm run build
```

- [ ] **Step 5: Run the same sequence used by CI**

Run: `npm test && npm run build`

Expected: PASS with ten generated localized HTML files and no unresolved internal targets.

- [ ] **Step 6: Commit deployment checks**

```bash
git add tests/generated-site.test.js .github/workflows/pages.yml package.json
git commit -m "ci: verify static site before deployment"
```

### Task 7: Documentation and final cleanup

**Files:**
- Modify: `README.md`
- Create: `.gitignore`
- Create: `tests/documentation.test.js`
- Delete: `template.html` if no longer used
- Modify: `tests/highlights.test.js`

**Interfaces:**
- Documents the canonical data files, build outputs, commands, deployment sequence, and generated-file policy.

- [ ] **Step 1: Add a failing documentation consistency test**

```js
test("README documents current sources and commands", () => {
  const readme = fs.readFileSync("README.md", "utf8");
  for (const text of ["data/publications.data.js", "npm test", "npm run build", "GitHub Actions"]) {
    assert.match(readme, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(readme, /single source \(`site\.config\.js`\)/i);
});
```

- [ ] **Step 2: Run the test and confirm the outdated README failure**

Run: `node --test tests/documentation.test.js`

Expected: FAIL because the README still claims all content is in `site.config.js`.

- [ ] **Step 3: Rewrite README and remove obsolete files**

Document each `data/*.data.js` responsibility, automatic statistics, commands, page routes, GitHub Actions gate, and the rule that generated HTML should not be hand-edited. Add `.DS_Store`, `Thumbs.db`, and local preview artifacts to `.gitignore`. Remove only files proven unused by `rg` and tests.

- [ ] **Step 4: Run documentation and full tests**

Run: `npm test && npm run build && git grep -n "page-split\|window.__SITE_DATA__" -- ':!docs/**' || true`

Expected: all tests PASS and the grep prints no production dependency.

- [ ] **Step 5: Commit documentation**

```bash
git add README.md .gitignore tests/documentation.test.js template.html
git commit -m "docs: document static profile site workflow"
```

### Task 8: Final visual and artifact verification

**Files:**
- Modify only files required by defects found during verification.
- Create deliverable outside the repository: `disk-hayashi.github.io-main_static-v3.zip`.

**Interfaces:**
- Produces: verified ZIP with the repository root as its top-level directory and without `.git`.

- [ ] **Step 1: Run fresh automated verification**

Run: `npm test && npm run build`

Expected: zero failing tests and a successful build.

- [ ] **Step 2: Verify current source state**

Run: `git status --short && git diff --check && git log --oneline -8`

Expected: clean status, no whitespace errors, and one logical commit per completed task.

- [ ] **Step 3: Inspect generated pages at desktop, tablet, and mobile widths**

Start a local HTTP server and use an available browser renderer at 1440 × 1000, 800 × 1000, and 390 × 844. Confirm the hero, four-plus-three highlights, navigation, language links, publication page, patent filters, and career page have no overflow or overlap. If a browser binary is unavailable, record that limitation and verify the responsive CSS and generated DOM structurally.

- [ ] **Step 4: Verify the OGP asset and archive**

Run:

```bash
identify assets/images/og-profile.png
zip -qr ../disk-hayashi.github.io-main_static-v3.zip . -x '.git/*'
unzip -t ../disk-hayashi.github.io-main_static-v3.zip
```

Expected: `1200x630` and `No errors detected in compressed data`.

- [ ] **Step 5: Save and hand off the artifact**

Save the ZIP as a new deliverable. Report test count, generated page count, OGP dimensions, any visual-verification limitation, and the exact source files the user needs to update through GitHub's web interface.
