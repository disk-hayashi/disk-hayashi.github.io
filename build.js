const fs = require("fs");
const path = require("path");

const config = require("./site.config.js");

function safeRequire(file, fallback = {}) {
  try {
    return require(file);
  } catch (e) {
    return fallback;
  }
}

const siteData = {
  ...safeRequire("./data/site.data.js", {}),
  topProductCards: safeRequire("./data/products.data.js", []),
  patents: safeRequire("./data/patents.data.js", []),
  publications: safeRequire("./data/publications.data.js", {
    journals: [],
    international: [],
    domestic: [],
  }),
  researchImpactProjects: safeRequire("./data/research-impact.data.js", []),
  awards: safeRequire("./data/awards.data.js", []),
  certifications: safeRequire("./data/certifications.data.js", { ja: [], en: [] }),
  societies: safeRequire("./data/societies.data.js", []),
};

const BASE_URL = config.baseUrl || "https://disk-hayashi.github.io";

const pages = {
  overview: {
    path: { en: "/", ja: "/ja/" },
    title: {
      en: "Daisuke Hayashi | AI Researcher",
      ja: "林 大介 | AI研究者",
    },
    description: {
      en: "Profile overview of Daisuke Hayashi.",
      ja: "林 大介のプロフィール概要。",
    },
  },
  projects: {
    path: { en: "/projects/", ja: "/ja/projects/" },
    title: {
      en: "Projects | Daisuke Hayashi",
      ja: "プロジェクト | 林 大介",
    },
    description: {
      en: "Commercialization and research impact projects.",
      ja: "製品化・研究業績。",
    },
  },
  publications: {
    path: { en: "/publications/", ja: "/ja/publications/" },
    title: {
      en: "Publications | Daisuke Hayashi",
      ja: "論文発表 | 林 大介",
    },
    description: {
      en: "Publications and conference presentations.",
      ja: "論文および学会発表。",
    },
  },
  patents: {
    path: { en: "/patents/", ja: "/ja/patents/" },
    title: {
      en: "Patents | Daisuke Hayashi",
      ja: "特許 | 林 大介",
    },
    description: {
      en: "Patent portfolio of Daisuke Hayashi.",
      ja: "林 大介の特許一覧。",
    },
  },
  career: {
    path: { en: "/career/", ja: "/ja/career/" },
    title: {
      en: "Career | Daisuke Hayashi",
      ja: "経歴 | 林 大介",
    },
    description: {
      en: "Career, education, awards, certifications, and societies.",
      ja: "職歴・学歴、受賞・表彰、資格、所属学会。",
    },
  },
};

function read(file) {
  return fs.readFileSync(path.join(__dirname, file), "utf8");
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function write(file, content) {
  const full = path.join(__dirname, file);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, content, "utf8");
}

function esc(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeJson(data) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function outputPathFromUrlPath(urlPath) {
  if (urlPath === "/") return "index.html";
  return path.join(urlPath.replace(/^\//, ""), "index.html");
}

function buildHead(pageKey, lang) {
  const page = pages[pageKey];
  const canonical = `${BASE_URL}${page.path[lang]}`;
  const jaUrl = `${BASE_URL}${page.path.ja}`;
  const enUrl = `${BASE_URL}${page.path.en}`;

  return `<!doctype html>
<html lang="${lang}" lang-mode="${lang}" data-lang-mode="${lang}" data-page-type="${pageKey}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title[lang])}</title>
  <meta name="description" content="${esc(page.description[lang])}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="ja" href="${jaUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${enUrl}">

  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(page.title[lang])}">
  <meta property="og:description" content="${esc(page.description[lang])}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${BASE_URL}/profile.jpg">

  <script>
    window.__PAGE_TYPE__ = ${safeJson(pageKey)};
    window.__LANG_MODE__ = ${safeJson(lang)};
    window.__SITE_DATA__ = ${safeJson(siteData)};
  </script>
</head>`;
}

function injectPageSplit(html) {
  if (html.includes("/assets/js/page-split.js")) return html;

  return html.replace(
    "</body>",
    `  <script src="/assets/js/page-split.js"></script>
</body>`
  );
}

function render(pageKey, lang) {
  let html = read("template.html");
  const bodyShell = read("partials/body.shell.html");

  html = html
    .replaceAll("{{HEAD_META}}", buildHead(pageKey, lang))
    .replaceAll("{{BODY_SHELL}}", bodyShell)
    .replaceAll("{{BODY}}", bodyShell)

    .replaceAll("{{HTML_LANG}}", lang)
    .replaceAll("{{LANG_MODE}}", lang)
    .replaceAll("{{PAGE_TYPE}}", pageKey)

    .replaceAll("{{TITLE}}", esc(pages[pageKey].title[lang]))
    .replaceAll("{{DESCRIPTION}}", esc(pages[pageKey].description[lang]))
    .replaceAll("{{CANONICAL_URL}}", `${BASE_URL}${pages[pageKey].path[lang]}`)
    .replaceAll("{{JA_URL}}", `${BASE_URL}${pages[pageKey].path.ja}`)
    .replaceAll("{{EN_URL}}", `${BASE_URL}${pages[pageKey].path.en}`)

    .replaceAll("{{SITE_DATA}}", safeJson(siteData))
    .replaceAll("{{SITE_DATA_JSON}}", safeJson(siteData));

  html = html.replace(
    /<body([^>]*)>/i,
    `<body$1 data-lang-mode="${lang}" data-page-type="${pageKey}">`
  );

  html = injectPageSplit(html);

  return html;
}

function buildSitemap() {
  const urls = Object.values(pages).flatMap((page) => [
    page.path.en,
    page.path.ja,
  ]);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${BASE_URL}${u}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
}

for (const pageKey of Object.keys(pages)) {
  for (const lang of ["en", "ja"]) {
    const outputPath = outputPathFromUrlPath(pages[pageKey].path[lang]);
    write(outputPath, render(pageKey, lang));
    console.log(`Generated: ${outputPath}`);
  }
}

write("sitemap.xml", buildSitemap());
write("robots.txt", buildRobots());

console.log("Build completed.");
