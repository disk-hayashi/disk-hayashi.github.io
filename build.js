const fs = require("fs");
const path = require("path");
const config = require("./site.config.js");

const BASE_URL = config.baseUrl || "https://disk-hayashi.github.io";

const pages = {
  overview: {
    title: { en: "Daisuke Hayashi | AI Researcher", ja: "林 大介 | AI研究者" },
    description: {
      en: "Profile overview of Daisuke Hayashi.",
      ja: "林 大介のプロフィール概要。",
    },
    path: { en: "/", ja: "/ja/" },
  },
  projects: {
    title: { en: "Projects | Daisuke Hayashi", ja: "プロジェクト | 林 大介" },
    description: {
      en: "Commercialization and research impact projects.",
      ja: "製品化および研究業績プロジェクト。",
    },
    path: { en: "/projects/", ja: "/ja/projects/" },
  },
  patents: {
    title: { en: "Patents | Daisuke Hayashi", ja: "特許 | 林 大介" },
    description: {
      en: "Patent portfolio of Daisuke Hayashi.",
      ja: "林 大介の特許一覧。",
    },
    path: { en: "/patents/", ja: "/ja/patents/" },
  },
  publications: {
    title: { en: "Publications | Daisuke Hayashi", ja: "論文発表 | 林 大介" },
    description: {
      en: "Publications and conference presentations.",
      ja: "論文および学会発表。",
    },
    path: { en: "/publications/", ja: "/ja/publications/" },
  },
  career: {
    title: { en: "Career | Daisuke Hayashi", ja: "経歴 | 林 大介" },
    description: {
      en: "Career, education, awards, certifications, and societies.",
      ja: "職歴・学歴、受賞・表彰、資格、所属学会。",
    },
    path: { en: "/career/", ja: "/ja/career/" },
  },
};

function readFile(filePath) {
  return fs.readFileSync(path.join(__dirname, filePath), "utf8");
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  const fullPath = path.join(__dirname, filePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content, "utf8");
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function url(pathname) {
  return `${BASE_URL}${pathname}`;
}

function filePathFromUrlPath(urlPath) {
  if (urlPath === "/") return "index.html";
  return path.join(urlPath.replace(/^\//, ""), "index.html");
}

function buildHead({ pageKey, lang }) {
  const page = pages[pageKey];
  const title = page.title[lang];
  const description = page.description[lang];
  const canonical = url(page.path[lang]);
  const jaUrl = url(page.path.ja);
  const enUrl = url(page.path.en);

  return `
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">

  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="ja" href="${jaUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${enUrl}">

  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${BASE_URL}/profile.jpg">

  <link rel="stylesheet" href="/assets/css/style.css">
  <script>
    window.__PAGE_TYPE__ = "${pageKey}";
    window.__LANG_MODE__ = "${lang}";
  </script>
</head>`;
}

function injectPageScript(html) {
  const script = `<script src="/assets/js/page-split.js"></script>`;

  if (html.includes("/assets/js/page-split.js")) return html;

  if (html.includes("</body>")) {
    return html.replace("</body>", `${script}\n</body>`);
  }

  return `${html}\n${script}`;
}

function renderPage({ pageKey, lang }) {
  const template = readFile("template.html");
  const bodyShell = readFile("partials/body.shell.html");

  const head = buildHead({ pageKey, lang });

  let html = template
    .replace("{{HEAD_META}}", head)
    .replace("{{BODY_SHELL}}", bodyShell);

  html = html
    .replace("<html", `<html lang="${lang}" data-page-type="${pageKey}" data-lang-mode="${lang}"`)
    .replace("<body", `<body data-page-type="${pageKey}" data-lang-mode="${lang}"`);

  html = injectPageScript(html);

  return html;
}

function buildSitemap() {
  const urls = [];

  Object.keys(pages).forEach((pageKey) => {
    urls.push(pages[pageKey].path.en);
    urls.push(pages[pageKey].path.ja);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (pathname) => `  <url>
    <loc>${url(pathname)}</loc>
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

Object.keys(pages).forEach((pageKey) => {
  ["en", "ja"].forEach((lang) => {
    const outputPath = filePathFromUrlPath(pages[pageKey].path[lang]);
    writeFile(outputPath, renderPage({ pageKey, lang }));
    console.log(`Generated: ${outputPath}`);
  });
});

writeFile("sitemap.xml", buildSitemap());
writeFile("robots.txt", buildRobots());

console.log("Build completed.");
