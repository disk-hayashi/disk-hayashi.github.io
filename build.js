const fs = require("fs");
const path = require("path");

const config = require("./site.config.js");

const BASE_URL = config.baseUrl || "https://disk-hayashi.github.io";

function safeRequire(file, fallback) {
  try {
    return require(file);
  } catch {
    return fallback;
  }
}

const products = safeRequire("./data/products.data.js", []);
const awards = safeRequire("./data/awards.data.js", []);
const patents = safeRequire("./data/patents.data.js", []);
const publications = safeRequire("./data/publications.data.js", {
  journals: [],
  international: [],
  domestic: [],
});

const pages = [
  {
    key: "home",
    path: { en: "/", ja: "/ja/" },
    title: { en: "Daisuke Hayashi | AI Researcher", ja: "林 大介 | AI研究者" },
    desc: {
      en: "Profile of Daisuke Hayashi, specializing in Computer Vision, NLP, and Machine Learning.",
      ja: "Computer Vision・NLP・機械学習を専門とする林大介のプロフィールサイト。",
    },
  },
  {
    key: "projects",
    path: { en: "/projects/", ja: "/ja/projects/" },
    title: { en: "Projects | Daisuke Hayashi", ja: "プロジェクト | 林 大介" },
    desc: { en: "Selected AI projects.", ja: "主なAIプロジェクト。" },
  },
  {
    key: "publications",
    path: { en: "/publications/", ja: "/ja/publications/" },
    title: { en: "Publications | Daisuke Hayashi", ja: "論文発表 | 林 大介" },
    desc: { en: "Academic publications.", ja: "論文・学会発表。" },
  },
  {
    key: "patents",
    path: { en: "/patents/", ja: "/ja/patents/" },
    title: { en: "Patents | Daisuke Hayashi", ja: "特許 | 林 大介" },
    desc: { en: "Patent portfolio.", ja: "特許一覧。" },
  },
  {
    key: "career",
    path: { en: "/career/", ja: "/ja/career/" },
    title: { en: "Career | Daisuke Hayashi", ja: "経歴 | 林 大介" },
    desc: { en: "Career and education.", ja: "職歴・学歴。" },
  },
];

function esc(v = "") {
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ensureDir(file) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function write(file, content) {
  const full = path.join(__dirname, file);
  ensureDir(full);
  fs.writeFileSync(full, content, "utf8");
}

function outPath(urlPath) {
  if (urlPath === "/") return "index.html";
  return path.join(urlPath.replace(/^\//, ""), "index.html");
}

function countPapers() {
  return (publications.journals?.length || 0) + (publications.international?.length || 0);
}

function head(page, lang) {
  const canonical = `${BASE_URL}${page.path[lang]}`;
  const altJa = `${BASE_URL}${page.path.ja}`;
  const altEn = `${BASE_URL}${page.path.en}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Daisuke Hayashi",
    alternateName: "林 大介",
    url: BASE_URL,
    affiliation: [
      {
        "@type": "Organization",
        name: "Hitachi, Ltd.",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Kyoto University",
      },
    ],
    knowsAbout: ["Computer Vision", "NLP", "Machine Learning", "Remote Sensing", "Patents"],
  };

  return `
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title[lang])}</title>
<meta name="description" content="${esc(page.desc[lang])}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="ja" href="${altJa}">
<link rel="alternate" hreflang="en" href="${altEn}">
<link rel="alternate" hreflang="x-default" href="${altEn}">
<meta property="og:title" content="${esc(page.title[lang])}">
<meta property="og:description" content="${esc(page.desc[lang])}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${BASE_URL}/profile.jpg">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>
:root{
  --bg:#eef5ff;
  --card:#ffffff;
  --text:#071a33;
  --muted:#60718a;
  --line:#dbe7f5;
  --blue:#1d5bd8;
  --blue2:#eef4ff;
}
*{box-sizing:border-box}
body{
  margin:0;
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  background:linear-gradient(135deg,#f7fbff,#eaf3ff);
  color:var(--text);
}
a{color:inherit;text-decoration:none}
.wrap{max-width:1180px;margin:0 auto;padding:28px 20px 44px}
.nav{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:18px;
  gap:12px;
}
.nav-links{display:flex;flex-wrap:wrap;gap:10px}
.nav a{
  font-size:13px;
  font-weight:800;
  padding:9px 13px;
  border:1px solid var(--line);
  background:#fff;
  border-radius:999px;
  box-shadow:0 6px 18px rgba(20,55,100,.06);
}
.lang{display:flex;gap:8px}
.hero,.section{
  background:rgba(255,255,255,.86);
  border:1px solid var(--line);
  border-radius:32px;
  box-shadow:0 20px 60px rgba(20,55,100,.10);
}
.hero{
  padding:40px;
  display:grid;
  grid-template-columns:1fr 300px;
  gap:34px;
  align-items:center;
}
.badge{
  display:inline-flex;
  padding:9px 14px;
  border-radius:999px;
  background:var(--blue2);
  color:var(--blue);
  font-size:12px;
  font-weight:900;
  letter-spacing:.08em;
  text-transform:uppercase;
  margin-bottom:14px;
}
h1{font-size:46px;line-height:1.02;margin:0 0 8px;letter-spacing:-.04em}
.jp-name{font-size:18px;font-weight:800;color:var(--muted);margin-bottom:18px}
.cards2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:20px 0}
.mini-card{
  border:1px solid var(--line);
  border-radius:18px;
  padding:18px;
  background:#fff;
}
.label{
  font-size:11px;
  color:var(--blue);
  font-weight:900;
  letter-spacing:.12em;
  text-transform:uppercase;
  margin-bottom:8px;
}
.value{font-weight:900}
.date{font-size:12px;color:var(--muted);font-weight:800;margin-top:8px}
.lead{font-size:17px;line-height:1.9;font-weight:700;margin:22px 0}
.buttons{display:flex;flex-wrap:wrap;gap:12px}
.btn{
  display:inline-flex;
  align-items:center;
  padding:12px 19px;
  border-radius:999px;
  font-weight:900;
  border:1px solid var(--line);
  background:#fff;
}
.btn.primary{background:var(--blue);color:#fff;border-color:var(--blue)}
.profile-card{
  background:#fff;
  border:1px solid var(--line);
  border-radius:28px;
  padding:24px;
  text-align:center;
}
.photo{
  width:150px;height:150px;
  border-radius:50%;
  object-fit:cover;
  border:8px solid #e7efff;
  margin-bottom:18px;
}
.chips{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:12px}
.chip{
  padding:9px 14px;
  border-radius:999px;
  background:#fff;
  border:1px solid var(--line);
  box-shadow:0 5px 14px rgba(20,55,100,.06);
  font-size:13px;
  font-weight:900;
}
.section{padding:28px;margin-top:26px}
.section-title{margin:0 0 20px}
.section-title h2{font-size:28px;margin:4px 0 0}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.stat{
  background:#fff;
  border:1px solid var(--line);
  border-radius:20px;
  padding:24px;
  min-height:116px;
}
.stat-name{font-weight:900;margin-bottom:12px}
.stat-num{font-size:30px;font-weight:950;color:var(--blue)}
.list{display:grid;gap:14px}
.item{
  background:#fff;
  border:1px solid var(--line);
  border-radius:18px;
  padding:18px;
}
.item h3{margin:0 0 8px;font-size:18px}
.item p{margin:0;color:var(--muted);line-height:1.7;font-weight:600}
.footer{text-align:center;color:var(--muted);font-weight:700;padding:24px}
@media(max-width:850px){
  .hero{grid-template-columns:1fr;padding:26px}
  .cards2,.grid3{grid-template-columns:1fr}
  h1{font-size:36px}
  .nav{align-items:flex-start;flex-direction:column}
}
</style>`;
}

function nav(lang) {
  const labels = {
    ja: ["概要", "プロジェクト", "論文発表", "特許", "経歴"],
    en: ["Overview", "Projects", "Publications", "Patents", "Career"],
  };

  return `
<nav class="nav">
  <div class="nav-links">
    ${pages
      .map((p, i) => `<a href="${p.path[lang]}">${labels[lang][i]}</a>`)
      .join("")}
  </div>
  <div class="lang">
    <a href="/ja/">JA</a>
    <a href="/">EN</a>
  </div>
</nav>`;
}

function home(lang) {
  const isJa = lang === "ja";
  const focus = isJa
    ? ["Computer Vision", "NLP", "機械学習", "製品化", "特許創出", "研究開発"]
    : ["Computer Vision", "NLP", "Machine Learning", "Commercialization", "Patent Creation", "R&D"];

  return `
<section class="hero">
  <div>
    <div class="badge">Researcher Profile</div>
    <h1>Daisuke Hayashi</h1>
    <div class="jp-name">林 大介</div>

    <div class="cards2">
      <div class="mini-card">
        <div class="label">${isJa ? "Primary Affiliation" : "Primary Affiliation"}</div>
        <div class="value">${isJa ? "株式会社日立製作所 中央研究所" : "Central Research Laboratory, Hitachi, Ltd."}</div>
        <div class="date">2020.04–Present</div>
      </div>
      <div class="mini-card">
        <div class="label">${isJa ? "Academic Program" : "Academic Program"}</div>
        <div class="value">${isJa ? "京都大学 博士後期課程（数理・情報科学）" : "Ph.D. Student, Kyoto University"}</div>
        <div class="date">2026.04–Present</div>
      </div>
    </div>

    <p class="lead">
      ${isJa
        ? "Computer Vision・NLP・機械学習を専門に、研究開発から製品化・特許創出まで一貫して推進。"
        : "Specializing in Computer Vision, NLP, and Machine Learning, bridging research, commercialization, and patent creation."}
    </p>

    <div class="buttons">
      <a class="btn primary" href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a>
      <a class="btn" href="https://scholar.google.com/" target="_blank" rel="noopener">Google Scholar</a>
    </div>
  </div>

  <aside class="profile-card">
    <img class="photo" src="/profile.jpg" alt="Daisuke Hayashi" onerror="this.src='/assets/images/profile.jpg'">
    <div class="label">Focus Areas</div>
    <div class="chips">${focus.map((x) => `<span class="chip">${esc(x)}</span>`).join("")}</div>
  </aside>
</section>

<section class="section">
  <div class="section-title">
    <div class="badge">Overview</div>
    <h2>${isJa ? "ハイライト" : "Highlights"}</h2>
  </div>
  <div class="grid3">
    <div class="stat"><div class="stat-name">${isJa ? "製品化" : "Commercialization"}</div><div class="stat-num">${products.length}<span>${isJa ? "件" : ""}</span></div></div>
    <div class="stat"><div class="stat-name">${isJa ? "受賞・表彰" : "Awards"}</div><div class="stat-num">${awards.length}<span>${isJa ? "件" : ""}</span></div></div>
    <div class="stat"><div class="stat-name">${isJa ? "特許出願" : "Patent Applications"}</div><div class="stat-num">${patents.length}<span>${isJa ? "件" : ""}</span></div></div>
    <div class="stat"><div class="stat-name">${isJa ? "登録特許" : "Registered Patents"}</div><div class="stat-num">${patents.filter((p) => p.isRegistered).length}<span>${isJa ? "件" : ""}</span></div></div>
    <div class="stat"><div class="stat-name">${isJa ? "製品採用特許" : "Patents Used in Products"}</div><div class="stat-num">${patents.filter((p) => p.isProductUsed).length}<span>${isJa ? "件" : ""}</span></div></div>
    <div class="stat"><div class="stat-name">${isJa ? "論文" : "Papers"}</div><div class="stat-num">${countPapers()}<span>${isJa ? "件" : ""}</span></div></div>
  </div>
</section>`;
}

function genericPage(key, lang) {
  const isJa = lang === "ja";

  if (key === "projects") {
    return section(
      isJa ? "製品化・研究業績" : "Projects",
      products,
      (x) => isJa ? x.jaTitle || x.title || "Project" : x.enTitle || x.title || "Project",
      (x) => isJa ? x.jaDesc || x.description || "" : x.enDesc || x.description || ""
    );
  }

  if (key === "publications") {
    const all = [
      ...(publications.journals || []),
      ...(publications.international || []),
      ...(publications.domestic || []),
    ];
    return section(
      isJa ? "論文発表" : "Publications",
      all,
      (x) => isJa ? x.jaTitle || x.title || "Publication" : x.enTitle || x.title || "Publication",
      (x) => isJa ? x.jaMeta || x.meta || "" : x.enMeta || x.meta || ""
    );
  }

  if (key === "patents") {
    return section(
      isJa ? "特許" : "Patents",
      patents,
      (x) => isJa ? x.jaTitle || x.title || "Patent" : x.enTitle || x.title || "Patent",
      (x) => [x.filingNumber, x.publicationNumber, x.registrationNumber].filter(Boolean).join(" / ")
    );
  }

  return `
<section class="section">
  <div class="section-title">
    <div class="badge">${isJa ? "Background" : "Background"}</div>
    <h2>${isJa ? "職歴・学歴" : "Career & Education"}</h2>
  </div>
  <div class="list">
    <div class="item"><h3>${isJa ? "京都大学 博士後期課程（数理・情報科学）" : "Ph.D. Student, Kyoto University"}</h3><p>2026.04–Present</p></div>
    <div class="item"><h3>${isJa ? "株式会社日立製作所 中央研究所" : "Central Research Laboratory, Hitachi, Ltd."}</h3><p>2020.04–Present</p></div>
    <div class="item"><h3>${isJa ? "モルガン・スタンレー 情報技術部門" : "Morgan Stanley Information Technology"}</h3><p>2018.08</p></div>
  </div>
</section>`;
}

function section(title, items, titleFn, descFn) {
  return `
<section class="section">
  <div class="section-title">
    <div class="badge">Selected</div>
    <h2>${esc(title)}</h2>
  </div>
  <div class="list">
    ${(items && items.length ? items : [{ title: "Coming soon", description: "Content will be updated." }])
      .map((x) => `
      <div class="item">
        <h3>${esc(titleFn(x))}</h3>
        <p>${esc(descFn(x))}</p>
      </div>`)
      .join("")}
  </div>
</section>`;
}

function body(page, lang) {
  return `
<div class="wrap">
  ${nav(lang)}
  ${page.key === "home" ? home(lang) : genericPage(page.key, lang)}
  <div class="footer">© Daisuke Hayashi</div>
</div>`;
}

function render(page, lang) {
  const template = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");
  return template
    .replaceAll("{{LANG}}", lang)
    .replaceAll("{{HEAD_META}}", head(page, lang))
    .replaceAll("{{BODY}}", body(page, lang));
}

for (const page of pages) {
  for (const lang of ["en", "ja"]) {
    write(outPath(page.path[lang]), render(page, lang));
    console.log(`Generated ${outPath(page.path[lang])}`);
  }
}

const urls = pages.flatMap((p) => [p.path.en, p.path.ja]);

write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${BASE_URL}${u}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`
);

write(
  "robots.txt",
  `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`
);

console.log("Build completed.");
