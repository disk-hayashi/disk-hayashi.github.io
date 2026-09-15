const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const baseUrl = "https://disk-hayashi.github.io";
const routes = [
  "/",
  "/ja/",
  "/projects/",
  "/ja/projects/",
  "/publications/",
  "/ja/publications/",
  "/patents/",
  "/ja/patents/",
  "/career/",
  "/ja/career/",
];

const sectionsByRoute = {
  "/": ["highlights"],
  "/ja/": ["highlights"],
  "/projects/": ["top-products", "research-impact"],
  "/ja/projects/": ["top-products", "research-impact"],
  "/publications/": ["publications"],
  "/ja/publications/": ["publications"],
  "/patents/": ["patents"],
  "/ja/patents/": ["patents"],
  "/career/": ["awards", "career", "certifications", "societies"],
  "/ja/career/": ["awards", "career", "certifications", "societies"],
};

function routeFile(route) {
  return route === "/"
    ? path.join(root, "index.html")
    : path.join(root, route.slice(1), "index.html");
}

function readRoute(route) {
  return fs.readFileSync(routeFile(route), "utf8");
}

function localTarget(value) {
  if (/^(?:[a-z]+:)?\/\//i.test(value) || /^(?:mailto|tel|data|javascript):/i.test(value)) return null;
  const [withoutFragment, fragment = ""] = value.split("#", 2);
  const pathname = withoutFragment.split("?", 1)[0];
  return { pathname, fragment };
}

test("build emits all ten public routes with their page-specific sections", () => {
  for (const route of routes) {
    const html = readRoute(route);
    for (const section of sectionsByRoute[route]) {
      assert.match(html, new RegExp(`<section[^>]+id=["']${section}["']`), `${route} is missing #${section}`);
    }

    const sectionsOnOtherPages = new Set(
      Object.entries(sectionsByRoute)
        .filter(([otherRoute]) => otherRoute !== route)
        .flatMap(([, sections]) => sections),
    );
    for (const section of sectionsOnOtherPages.difference(new Set(sectionsByRoute[route]))) {
      assert.doesNotMatch(html, new RegExp(`<section[^>]+id=["']${section}["']`), `${route} unexpectedly contains #${section}`);
    }
  }
});

test("sitemap lists each public route exactly once", () => {
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(locations.sort(), routes.map((route) => `${baseUrl}${route}`).sort());
});

test("every internal href and src resolves to generated content", () => {
  for (const route of routes) {
    const html = readRoute(route);
    for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
      const target = localTarget(match[1]);
      if (!target) continue;

      const resolvedUrl = new URL(target.pathname || route, `${baseUrl}${route}`);
      const relativePath = decodeURIComponent(resolvedUrl.pathname).replace(/^\//, "");
      const targetFile = resolvedUrl.pathname.endsWith("/")
        ? path.join(root, relativePath, "index.html")
        : path.join(root, relativePath);
      assert.ok(fs.existsSync(targetFile), `${route}: ${match[1]} points to missing ${targetFile}`);

      if (target.fragment) {
        const targetHtml = fs.readFileSync(targetFile, "utf8");
        const escaped = target.fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        assert.match(targetHtml, new RegExp(`\\bid=["']${escaped}["']`), `${route}: ${match[1]} points to a missing fragment`);
      }
    }
  }
});

test("repeated builds are deterministic", () => {
  execFileSync(process.execPath, ["build.js"]);
  const first = fs.readFileSync("index.html", "utf8");
  execFileSync(process.execPath, ["build.js"]);
  assert.equal(fs.readFileSync("index.html", "utf8"), first);
  assert.match(first, /site\.css\?v=[a-f0-9]{12}/);
});
