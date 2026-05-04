const fs = require("fs");
const path = require("path");
const config = require("./site.config.js");

const BASE_URL = config.baseUrl || "https://disk-hayashi.github.io";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  const fullPath = path.join(__dirname, filePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content, "utf8");
}

function esc(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function url(pathname) {
  return `${BASE_URL}${pathname}`;
}

function navHtml(lang) {
  return config.nav[lang]
    .map(([label, href]) => `<a href="${href}">${esc(label)}</a>`)
    .join("");
}

function langSwitch(pageKey, lang) {
  const page = config.pages[pageKey];
  const other = lang === "ja" ? "en" : "ja";
  return `<a class="lang" href="${page.path[other]}">${other.toUpperCase()}</a>`;
}

function head(pageKey, lang) {
  const page = config.pages[pageKey];
  const title = page.title[lang];
  const description = page.description[lang];
  const canonical = url(page.path[lang]);
  const jaUrl = url(page.path.ja);
  const enUrl = url(page.path.en);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Daisuke Hayashi",
    alternateName: "林 大介",
    url: BASE_URL,
    image: `${BASE_URL}/profile.jpg`,
    jobTitle: lang === "ja" ? "AI研究者" : "AI Researcher",
    affiliation: [
      { "@type": "CollegeOrUniversity", name: "Kyoto University" },
      { "@type": "Organization", name: "Hitachi, Ltd." }
    ],
    knowsAbout: config.focusAreas.en
  };

  return `<!doctype html>
<html lang="${lang}" data-lang-mode="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="ja" href="${jaUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${enUrl}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${BASE_URL}/profile.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <style>
    body{margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#111;background:#f7f7f5;line-height:1.7}
    .wrap{max-width:1040px;margin:auto;padding:32px 20px 80px}
    header{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:56px}
    .brand{font-weight:800;letter-spacing:.02em}
    nav{display:flex;gap:18px;flex-wrap:wrap}
    a{color:#111;text-decoration:none}
    nav a,.lang{font-size:14px;border-bottom:1px solid #aaa}
    .hero{display:grid;grid-template-columns:1.5fr .8fr;gap:40px;align-items:center;margin-bottom:56px}
    h1{font-size:48px;line-height:1.08;margin:0 0 16px}
    h2{font-size:28px;margin-top:48px;border-top:1px solid #ddd;padding-top:28px}
    .lead{font-size:20px;color:#333}
    .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
    .chip{background:#fff;border:1px solid #ddd;border-radius:999px;padding:7px 12px;font-size:14px}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}
    .card{background:#fff;border:1px solid #e5e5e5;border-radius:18px;padding:22px;box-shadow:0 8px 28px rgba(0,0,0,.04)}
    .meta{color:#666;font-size:14px}
    footer{margin-top:72px;color:#777;font-size:14px}
    @media(max-width:760px){.hero{grid-template-columns:1fr}h1{font-size:36px}header{align-items:flex-start;flex-direction:column}}
  </style>
</head>`;
}

function pageBody(pageKey, lang) {
  const p = config.pages[pageKey];

  if (pageKey === "home") {
    return `
<section class="hero">
  <div>
    <p class="meta">${esc(config.author.title[lang])}</p>
    <h1>${esc(config.author.name[lang])}</h1>
    <p class="lead">${esc(p.hero[lang])}</p>
    <div class="chips">${config.focusAreas[lang].map(x => `<span class="chip">${esc(x)}</span>`).join("")}</div>
  </div>
  <div class="card">
    <strong>${esc(config.author.affiliation[lang])}</strong>
    <p>${esc(p.description[lang])}</p>
  </div>
</section>
<section>
  <h2>${lang === "ja" ? "概要" : "Overview"}</h2>
  <div class="grid">
    ${p.sections[lang].map(([title, text]) => `
      <article class="card">
        <h3>${esc(title)}</h3>
        <p>${esc(text)}</p>
      </article>`).join("")}
  </div>
</section>`;
  }

  if (pageKey === "research") {
    return `
<h1>${esc(p.heading[lang])}</h1>
${p.body[lang].map(text => `<p class="lead">${esc(text)}</p>`).join("")}`;
  }

  if (pageKey === "projects") {
    return `
<h1>${esc(p.heading[lang])}</h1>
<div class="grid">
${p.items[lang].map(([title, text]) => `
  <article class="card">
    <h3>${esc(title)}</h3>
    <p>${esc(text)}</p>
  </article>`).join("")}
</div>`;
  }

  if (pageKey === "publications") {
    return `
<h1>${esc(p.heading[lang])}</h1>
<div class="card">
${p.publications[lang].map(item => `<p>${esc(item)}</p>`).join("")}
</div>`;
  }

  if (pageKey === "cv") {
    return `
<h1>${esc(p.heading[lang])}</h1>
<div class="grid">
${p.entries[lang].map(([title, text]) => `
  <article class="card">
    <h3>${esc(title)}</h3>
    <p>${esc(text)}</p>
  </article>`).join("")}
</div>`;
  }

  return "";
}

function renderPage(pageKey, lang) {
  return `${head(pageKey, lang)}
<body>
  <div class="wrap">
    <header>
      <div class="brand">Daisuke Hayashi / 林 大介</div>
      <nav>${navHtml(lang)} ${langSwitch(pageKey, lang)}</nav>
    </header>
    <main>${pageBody(pageKey, lang)}</main>
    <footer>© ${new Date().getFullYear()} Daisuke Hayashi</footer>
  </div>
</body>
</html>`;
}

function pathFromUrlPath(urlPath) {
  if (urlPath === "/") return "index.html";
  return path.join(urlPath.replace(/^\//, ""), "index.html");
}

const pageKeys = Object.keys(config.pages);

for (const pageKey of pageKeys) {
  for (const lang of ["en", "ja"]) {
    writeFile(pathFromUrlPath(config.pages[pageKey].path[lang]), renderPage(pageKey, lang));
  }
}

const sitemapUrls = pageKeys.flatMap(pageKey =>
  ["en", "ja"].map(lang => {
    const loc = url(config.pages[pageKey].path[lang]);
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
  </url>`;
  })
);

writeFile("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join("\n")}
</urlset>
`);

writeFile("robots.txt", `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`);

console.log("Build completed:");
for (const pageKey of pageKeys) {
  console.log(`- ${config.pages[pageKey].path.en}`);
  console.log(`- ${config.pages[pageKey].path.ja}`);
}
