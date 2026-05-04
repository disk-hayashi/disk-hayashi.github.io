const fs = require("fs");
const path = require("path");
const site = require("./site.config.js");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  const fullPath = path.join(__dirname, filePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content, "utf8");
}

function esc(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function urlFor(page, lang) {
  return page.path[lang];
}

function navHtml(lang, currentKey) {
  return site.pages
    .map((p) => {
      const active = p.key === currentKey ? "active" : "";
      return `<a class="${active}" href="${urlFor(p, lang)}">${esc(p.nav[lang])}</a>`;
    })
    .join("");
}

function langSwitch(page, lang) {
  const other = lang === "ja" ? "en" : "ja";
  return `<a class="lang" href="${page.path[other]}">${other === "ja" ? "日本語" : "English"}</a>`;
}

function pageCards(page, lang) {
  return page.sections[lang]
    .map(
      ([title, text]) => `
      <article class="card">
        <h2>${esc(title)}</h2>
        <p>${esc(text)}</p>
      </article>
    `
    )
    .join("");
}

function focusChips(lang) {
  return site.focusAreas[lang]
    .map((x) => `<span>${esc(x)}</span>`)
    .join("");
}

function renderPage(page, lang) {
  const canonical = site.baseUrl + page.path[lang];
  const alternate = site.baseUrl + page.path[lang === "ja" ? "en" : "ja"];

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title[lang])}</title>
  <meta name="description" content="${esc(page.description[lang])}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="${lang === "ja" ? "en" : "ja"}" href="${alternate}">
  <link rel="alternate" hreflang="${lang}" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${site.baseUrl}/">

  <meta property="og:title" content="${esc(page.title[lang])}">
  <meta property="og:description" content="${esc(page.description[lang])}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="website">

  <style>
    :root {
      --bg: #f7f7f5;
      --text: #171717;
      --muted: #666;
      --line: #ddd;
      --card: #fff;
      --accent: #111;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.7;
    }

    .wrap {
      max-width: 1080px;
      margin: 0 auto;
      padding: 28px 22px 64px;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 56px;
    }

    .brand {
      font-weight: 800;
      letter-spacing: -0.02em;
      text-decoration: none;
      color: var(--text);
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 14px;
      font-size: 14px;
    }

    nav a {
      color: var(--muted);
      text-decoration: none;
      padding: 6px 2px;
      border-bottom: 2px solid transparent;
    }

    nav a.active {
      color: var(--text);
      border-bottom-color: var(--text);
      font-weight: 700;
    }

    .lang {
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 6px 12px;
      color: var(--text);
      text-decoration: none;
      background: #fff;
    }

    .hero {
      margin-bottom: 48px;
    }

    .eyebrow {
      color: var(--muted);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    h1 {
      font-size: clamp(38px, 6vw, 72px);
      line-height: 1.05;
      letter-spacing: -0.05em;
      margin: 0 0 22px;
    }

    .lead {
      font-size: clamp(18px, 2.2vw, 24px);
      color: #333;
      max-width: 820px;
      margin: 0 0 24px;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 24px;
    }

    .chips span {
      border: 1px solid var(--line);
      background: #fff;
      border-radius: 999px;
      padding: 8px 13px;
      font-size: 14px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }

    .card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 22px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.04);
    }

    .card h2 {
      font-size: 20px;
      line-height: 1.35;
      margin: 0 0 10px;
    }

    .card p {
      margin: 0;
      color: var(--muted);
    }

    .cta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 30px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      padding: 11px 18px;
      background: var(--accent);
      color: #fff;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
    }

    .btn.secondary {
      background: #fff;
      color: var(--text);
      border: 1px solid var(--line);
    }

    footer {
      margin-top: 64px;
      padding-top: 24px;
      border-top: 1px solid var(--line);
      color: var(--muted);
      font-size: 14px;
    }

    @media (max-width: 820px) {
      header {
        align-items: flex-start;
        flex-direction: column;
        margin-bottom: 40px;
      }

      .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>

<body>
  <div class="wrap">
    <header>
      <a class="brand" href="${lang === "ja" ? "/ja/" : "/"}">${esc(site.author[lang])}</a>
      <nav>
        ${navHtml(lang, page.key)}
        ${langSwitch(page, lang)}
      </nav>
    </header>

    <main>
      <section class="hero">
        <div class="eyebrow">Researcher Profile</div>
        <h1>${esc(page.heading[lang])}</h1>
        <p class="lead">${esc(page.description[lang])}</p>

        <div class="chips">
          ${focusChips(lang)}
        </div>

        ${
          page.key === "home"
            ? `<div class="cta">
                <a class="btn" href="${lang === "ja" ? "/ja/projects/" : "/projects/"}">${lang === "ja" ? "プロジェクトを見る" : "View Projects"}</a>
                <a class="btn secondary" href="${lang === "ja" ? "/ja/publications/" : "/publications/"}">${lang === "ja" ? "論文発表を見る" : "View Publications"}</a>
              </div>`
            : ""
        }
      </section>

      <section class="grid">
        ${pageCards(page, lang)}
      </section>
    </main>

    <footer>
      © ${new Date().getFullYear()} ${esc(site.author.en)} · ${esc(site.affiliation[lang])}
    </footer>
  </div>
</body>
</html>`;
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${site.baseUrl}/sitemap.xml
`;
}

function buildSitemap() {
  const urls = [];

  for (const page of site.pages) {
    urls.push(site.baseUrl + page.path.en);
    urls.push(site.baseUrl + page.path.ja);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

for (const page of site.pages) {
  writeFile(path.join(page.path.en.replace(/^\//, ""), "index.html"), renderPage(page, "en"));
  writeFile(path.join(page.path.ja.replace(/^\//, ""), "index.html"), renderPage(page, "ja"));
}

writeFile("robots.txt", buildRobots());
writeFile("sitemap.xml", buildSitemap());

console.log("Generated multi-page site successfully.");
