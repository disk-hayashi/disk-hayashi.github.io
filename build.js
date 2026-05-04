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

const pages = [
  {
    key: "home",
    path: { en: "/", ja: "/ja/" },
    title: {
      en: "Daisuke Hayashi | AI Researcher in Computer Vision, NLP and Machine Learning",
      ja: "林 大介 | Computer Vision・NLP・機械学習のAI研究者",
    },
    desc: {
      en: "Official profile of Daisuke Hayashi, an AI researcher specializing in Computer Vision, NLP, Machine Learning, commercialization, patent creation, and R&D.",
      ja: "Computer Vision・NLP・機械学習を専門に、研究開発から製品化・特許創出まで一貫して推進する林大介のプロフィールサイト。",
    },
  },
  {
    key: "projects",
    path: { en: "/projects/", ja: "/ja/projects/" },
    title: {
      en: "Projects | AI Commercialization and Research Impact | Daisuke Hayashi",
      ja: "プロジェクト | AI製品化・研究業績 | 林 大介",
    },
    desc: {
      en: "Selected AI projects by Daisuke Hayashi, including commercialization work, product-applied AI, and medical AI research impact.",
      ja: "林大介のAIプロジェクト一覧。製品化、製品採用AI、医療AI研究業績などを掲載。",
    },
  },
  {
    key: "publications",
    path: { en: "/publications/", ja: "/ja/publications/" },
    title: {
      en: "Publications | Papers and Conference Presentations | Daisuke Hayashi",
      ja: "論文発表 | 論文・学会発表 | 林 大介",
    },
    desc: {
      en: "Academic publications and conference presentations by Daisuke Hayashi, including journal papers, international conferences, and domestic conferences.",
      ja: "林大介の論文・学会発表一覧。ジャーナル論文、国際会議論文、国内会議発表を掲載。",
    },
  },
  {
    key: "patents",
    path: { en: "/patents/", ja: "/ja/patents/" },
    title: {
      en: "Patents | AI and Image Processing Intellectual Property | Daisuke Hayashi",
      ja: "特許 | AI・画像処理関連の知的財産 | 林 大介",
    },
    desc: {
      en: "Patent portfolio by Daisuke Hayashi, including AI, image processing, storage, authentication, and product-applied inventions.",
      ja: "林大介の特許一覧。AI、画像処理、収納、認証、製品採用特許などの知的財産を掲載。",
    },
  },
  {
    key: "career",
    path: { en: "/career/", ja: "/ja/career/" },
    title: {
      en: "Career | Education, Awards, Certifications and Societies | Daisuke Hayashi",
      ja: "経歴 | 職歴・学歴・受賞・資格・所属学会 | 林 大介",
    },
    desc: {
      en: "Career, education, awards, certifications, and professional societies of Daisuke Hayashi.",
      ja: "林大介の職歴・学歴、受賞・表彰、資格、所属学会を掲載。",
    },
  },
];

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

function injectPageSplit(html) {
  if (html.includes("/assets/js/page-split.js")) return html;

  if (html.includes("</body>")) {
    return html.replace(
      "</body>",
      `  <script src="/assets/js/page-split.js"></script>
</body>`
    );
  }

  return `${html}
<script src="/assets/js/page-split.js"></script>`;
}

function buildHead(pageKey, lang) {
  const page = pages[pageKey];
  const canonical = `${BASE_URL}${page.path[lang]}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: lang === "ja" ? "林 大介" : "Daisuke Hayashi",
    alternateName: lang === "ja" ? "Daisuke Hayashi" : "林 大介",
    url: canonical,
    image: `${BASE_URL}/assets/images/profile.jpg`,
    jobTitle: "AI Researcher",
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
  };

  return read("partials/head.meta.html")
    .replaceAll("{{TITLE}}", esc(page.title[lang]))
    .replaceAll("{{DESCRIPTION}}", esc(page.description[lang]))
    .replaceAll("{{CANONICAL}}", canonical)
    .replaceAll("{{CANONICAL_URL}}", canonical)
    .replaceAll("{{JA_URL}}", `${BASE_URL}${page.path.ja}`)
    .replaceAll("{{EN_URL}}", `${BASE_URL}${page.path.en}`)
    .replaceAll("{{OG_TITLE}}", esc(page.title[lang]))
    .replaceAll("{{OG_DESCRIPTION}}", esc(page.description[lang]))
    .replaceAll("{{OG_LOCALE}}", lang === "ja" ? "ja_JP" : "en_US")
    .replaceAll("{{OG_LOCALE_ALTERNATE}}", lang === "ja" ? "en_US" : "ja_JP")
    .replaceAll("{{JSON_LD}}", safeJson(jsonLd))
    .replaceAll("/profile.jpg", "/assets/images/profile.jpg")
    .replaceAll("https://disk-hayashi.github.io/profile.jpg", `${BASE_URL}/assets/images/profile.jpg`);
}

function render(pageKey, lang) {
  let html = read("template.html");
  const bodyShell = read("partials/body.shell.html")
    .replaceAll("/profile.jpg", "/assets/images/profile.jpg");

  html = html
    .replaceAll("{{HEAD_META}}", buildHead(pageKey, lang))
    .replaceAll("{{BODY_SHELL}}", bodyShell)
    .replaceAll("{{BODY}}", bodyShell)
    .replaceAll("{{HTML_LANG}}", lang)
    .replaceAll("{{LANG}}", lang)
    .replaceAll("{{LANG_MODE}}", lang)
    .replaceAll("{{PAGE_TYPE}}", pageKey)
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
  const urls = pages.flatMap((p) => [p.path.en, p.path.ja]);

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
