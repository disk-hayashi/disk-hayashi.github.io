const fs = require('fs');
const path = require('path');
const site = require('./site.config');

const OUT = path.join(__dirname, 'dist');
const langs = ['en', 'ja'];
const langPrefix = { en: '', ja: '/ja' };

function clean() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function urlFor(pageKey, lang) {
  return site.pages[pageKey].path[lang];
}

function absUrl(relativePath) {
  return site.baseUrl + relativePath.replace(/index\.html$/, '');
}

function pageFilePath(relativePath) {
  const normalized = relativePath.endsWith('/') ? relativePath + 'index.html' : relativePath;
  return path.join(OUT, normalized);
}

function layout({ lang, pageKey, content }) {
  const page = site.pages[pageKey];
  const title = page.title[lang];
  const description = page.description[lang];
  const canonical = absUrl(page.path[lang]);
  const alternateEn = absUrl(page.path.en);
  const alternateJa = absUrl(page.path.ja);
  const nav = site.nav[lang]
    .map(([label, href]) => `<a href="${href}"${href === page.path[lang] ? ' aria-current="page"' : ''}>${escapeHtml(label)}</a>`)
    .join('');

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.author.name[lang],
    alternateName: lang === 'en' ? site.author.name.ja : site.author.name.en,
    url: site.baseUrl,
    image: site.baseUrl + site.author.image,
    affiliation: [
      { '@type': 'Organization', name: lang === 'ja' ? '京都大学' : 'Kyoto University' },
      { '@type': 'Organization', name: lang === 'ja' ? '株式会社日立製作所' : 'Hitachi, Ltd.' }
    ],
    jobTitle: site.author.title[lang],
    knowsAbout: site.focusAreas[lang]
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: title,
    url: canonical,
    inLanguage: lang === 'ja' ? 'ja-JP' : 'en-US',
    description
  };

  return `<!doctype html>
<html lang="${lang === 'ja' ? 'ja' : 'en'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en" href="${alternateEn}">
  <link rel="alternate" hreflang="ja" href="${alternateJa}">
  <link rel="alternate" hreflang="x-default" href="${alternateEn}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${site.baseUrl}/assets/ogp.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${site.baseUrl}/assets/ogp.png">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify(personSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="${langPrefix[lang] || '/'}">${escapeHtml(site.author.name[lang])}</a>
    <nav class="nav">${nav}</nav>
    <a class="lang" href="${lang === 'ja' ? page.path.en : page.path.ja}">${lang === 'ja' ? 'EN' : 'JA'}</a>
  </header>
  <main>${content}</main>
  <footer class="footer">
    <p>© ${new Date().getFullYear()} ${escapeHtml(site.author.name[lang])}</p>
  </footer>
</body>
</html>`;
}

function renderHome(lang) {
  const p = site.pages.home;
  const chips = site.focusAreas[lang].map(x => `<span>${escapeHtml(x)}</span>`).join('');
  const cards = p.sections[lang].map(([title, body]) => `
    <article class="card">
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(body)}</p>
    </article>`).join('');
  return `
    <section class="hero">
      <p class="eyebrow">RESEARCHER PROFILE</p>
      <h1>${escapeHtml(site.author.name[lang])}</h1>
      <p class="lead">${escapeHtml(p.hero[lang])}</p>
      <p class="affiliation">${escapeHtml(site.author.affiliation[lang])}</p>
      <div class="chips">${chips}</div>
    </section>
    <section class="grid">${cards}</section>`;
}

function renderTextPage(lang, pageKey) {
  const p = site.pages[pageKey];
  if (pageKey === 'research') {
    return `
      <section class="page-title"><h1>${escapeHtml(p.heading[lang])}</h1><p>${escapeHtml(p.description[lang])}</p></section>
      <section class="content-block">${p.body[lang].map(x => `<p>${escapeHtml(x)}</p>`).join('')}</section>`;
  }
  if (pageKey === 'projects') {
    return `
      <section class="page-title"><h1>${escapeHtml(p.heading[lang])}</h1><p>${escapeHtml(p.description[lang])}</p></section>
      <section class="grid">${p.items[lang].map(([t, b]) => `<article class="card"><h2>${escapeHtml(t)}</h2><p>${escapeHtml(b)}</p></article>`).join('')}</section>`;
  }
  if (pageKey === 'publications') {
    return `
      <section class="page-title"><h1>${escapeHtml(p.heading[lang])}</h1><p>${escapeHtml(p.description[lang])}</p></section>
      <section class="content-block"><ul>${p.publications[lang].map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></section>`;
  }
  if (pageKey === 'cv') {
    return `
      <section class="page-title"><h1>${escapeHtml(p.heading[lang])}</h1><p>${escapeHtml(p.description[lang])}</p></section>
      <section class="content-block">${p.entries[lang].map(([t, b]) => `<h2>${escapeHtml(t)}</h2><p>${escapeHtml(b)}</p>`).join('')}</section>`;
  }
}

function renderPages() {
  for (const lang of langs) {
    for (const pageKey of Object.keys(site.pages)) {
      const content = pageKey === 'home' ? renderHome(lang) : renderTextPage(lang, pageKey);
      const html = layout({ lang, pageKey, content });
      const filePath = pageFilePath(site.pages[pageKey].path[lang]);
      ensureDir(filePath);
      fs.writeFileSync(filePath, html);
    }
  }
}

function writeStyles() {
  const css = `:root{--text:#111827;--muted:#6b7280;--line:#e5e7eb;--bg:#ffffff;--soft:#f9fafb;--accent:#111827}*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans JP","Helvetica Neue",Arial,sans-serif;color:var(--text);background:var(--bg);line-height:1.75}.site-header{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:24px;padding:18px clamp(20px,5vw,72px);border-bottom:1px solid var(--line);background:rgba(255,255,255,.9);backdrop-filter:blur(16px)}.brand{font-weight:800;color:var(--text);text-decoration:none;white-space:nowrap}.nav{display:flex;gap:18px;flex:1;justify-content:center}.nav a,.lang{color:var(--muted);text-decoration:none;font-size:14px}.nav a[aria-current="page"],.nav a:hover,.lang:hover{color:var(--text)}main{max-width:1120px;margin:0 auto;padding:72px 24px}.hero{padding:56px 0 72px}.eyebrow{font-size:12px;font-weight:800;letter-spacing:.16em;color:var(--muted)}h1{font-size:clamp(42px,7vw,76px);line-height:1.05;margin:10px 0 20px;letter-spacing:-.04em}h2{font-size:20px;margin:0 0 10px}.lead{font-size:clamp(20px,3vw,30px);max-width:860px;line-height:1.55;margin:0 0 18px}.affiliation{color:var(--muted);font-weight:600}.chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}.chips span{border:1px solid var(--line);background:var(--soft);border-radius:999px;padding:8px 13px;font-size:14px;font-weight:700}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.card{border:1px solid var(--line);border-radius:24px;padding:26px;background:linear-gradient(180deg,#fff,#fafafa);box-shadow:0 10px 30px rgba(17,24,39,.05)}.card p{color:var(--muted);margin:0}.page-title{border-bottom:1px solid var(--line);padding-bottom:32px;margin-bottom:36px}.page-title p{font-size:19px;color:var(--muted);max-width:820px}.content-block{max-width:860px}.content-block p,.content-block li{font-size:18px;color:#374151}.content-block h2{margin-top:28px}.footer{border-top:1px solid var(--line);padding:28px 24px;text-align:center;color:var(--muted)}@media(max-width:760px){.site-header{align-items:flex-start;flex-wrap:wrap}.nav{order:3;width:100%;justify-content:flex-start;overflow:auto}.grid{grid-template-columns:1fr}main{padding-top:42px}}`;
  fs.writeFileSync(path.join(OUT, 'styles.css'), css);
}

function writeRobots() {
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.baseUrl}/sitemap.xml\n`);
}

function writeSitemap() {
  const urls = [];
  for (const pageKey of Object.keys(site.pages)) {
    const p = site.pages[pageKey];
    for (const lang of langs) urls.push(p.path[lang]);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(u => `  <url>
    <loc>${absUrl(u)}</loc>
    <lastmod>${new Date().toISOString().slice(0,10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u === '/' || u === '/ja/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), xml);
}

function copyAssets() {
  const src = path.join(__dirname, 'assets');
  const dest = path.join(OUT, 'assets');
  if (fs.existsSync(src)) fs.cpSync(src, dest, { recursive: true });
}

clean();
renderPages();
writeStyles();
writeRobots();
writeSitemap();
copyAssets();
console.log('Build complete: dist/');
