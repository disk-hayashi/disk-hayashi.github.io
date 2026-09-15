const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const pages = [
  { key: "home", path: { en: "/", ja: "/ja/" }, title: { en: "Daisuke Hayashi", ja: "林 大介" }, desc: { en: "Official profile of Daisuke Hayashi, an AI researcher bridging R&D, productization, and patent creation in Computer Vision, NLP, and Machine Learning at Kyoto University and Hitachi.", ja: "AI × 実装 × 事業化の3軸で価値創出する林大介のプロフィールサイト。Computer Vision・NLP・機械学習、京都大学、日立での研究開発・社会実装・知財創出を掲載。" } },
  { key: "projects", path: { en: "/projects/", ja: "/ja/projects/" }, title: { en: "Projects | AI Commercialization and Research Impact | Daisuke Hayashi", ja: "プロジェクト | AI製品化・研究業績 | 林 大介" }, desc: { en: "Selected AI projects by Daisuke Hayashi, including commercialization work, product-applied AI, and medical AI research impact.", ja: "林大介のAIプロジェクト一覧。製品化、製品採用AI、医療AI研究業績などを掲載。" } },
  { key: "publications", path: { en: "/publications/", ja: "/ja/publications/" }, title: { en: "Publications | Papers and Conference Presentations | Daisuke Hayashi", ja: "研究発表 | 査読論文・学会発表 | 林 大介" }, desc: { en: "Academic publications and conference presentations by Daisuke Hayashi, including journal papers, international conferences, and domestic conferences.", ja: "林大介の論文・学会発表一覧。ジャーナル論文、国際会議論文、国内会議発表を掲載。" } },
  { key: "patents", path: { en: "/patents/", ja: "/ja/patents/" }, title: { en: "Patents | AI and Image Processing Intellectual Property | Daisuke Hayashi", ja: "特許 | AI・画像処理関連の知的財産 | 林 大介" }, desc: { en: "Patent portfolio by Daisuke Hayashi, including AI, image processing, storage, authentication, and product-applied inventions.", ja: "林大介の特許一覧。AI、画像処理、収納、認証、採用特許などの知的財産を掲載。" } },
  { key: "career", path: { en: "/career/", ja: "/ja/career/" }, title: { en: "Career | Education, Awards, Certifications and Societies | Daisuke Hayashi", ja: "経歴 | 職歴・学歴・受賞・資格・所属学会 | 林 大介" }, desc: { en: "Career, education, awards, certifications, and professional societies of Daisuke Hayashi.", ja: "林大介の職歴・学歴、受賞・表彰、資格、所属学会を掲載。" } },
];

const pageSections = {
  home: ["hero", "highlights"],
  projects: ["top-products", "research-impact"],
  publications: ["publications"],
  patents: ["patents"],
  career: ["awards", "career", "certifications", "societies"],
};

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function esc(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

function tag(type, text) {
  return `<span class="tag ${esc(type)}">${esc(text)}</span>`;
}

function highlightName(authors) {
  let html = esc(authors || "");
  for (const pattern of [/Daisuke Hayashi/g, /D\. Hayashi/g, /林 大介/g, /林　大介/g, /林大介/g]) {
    html = html.replace(pattern, (match) => `<span class="name-strong">${match}</span>`);
  }
  return html;
}

function patentNumberToEnglish(value) {
  if (!value) return "-";
  return /^特願|^特開|^特許/.test(String(value)) ? `P${String(value).replace(/[^\dA-Za-z]/g, "")}` : value;
}

function localizeMarkup(html, lang) {
  const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
  const stack = [];
  let output = "";
  let cursor = 0;
  const tokenPattern = /<\/?([a-zA-Z][\w-]*)(?:\s[^>]*?)?>/g;
  let match;

  while ((match = tokenPattern.exec(html))) {
    const inheritedSkip = stack.some((entry) => entry.skip);
    if (!inheritedSkip) output += html.slice(cursor, match.index);
    const token = match[0];
    const name = match[1].toLowerCase();
    const closing = token.startsWith("</");

    if (closing) {
      const entry = stack.pop();
      if (entry && !entry.skip && !stack.some((item) => item.skip)) output += token;
    } else {
      const language = token.match(/data-lang(?:-block)?="(ja|en)"/)?.[1];
      const skip = inheritedSkip || Boolean(language && language !== lang);
      const cleaned = language ? token.replace(/\s*data-lang(?:-block)?="(?:ja|en)"/, "") : token;
      if (!skip) output += cleaned;
      if (!voidTags.has(name) && !token.endsWith("/>")) stack.push({ name, skip });
    }
    cursor = tokenPattern.lastIndex;
  }
  if (!stack.some((entry) => entry.skip)) output += html.slice(cursor);
  return output;
}

function renderNav(page, lang) {
  const labels = lang === "ja"
    ? { home: "概要", projects: "プロジェクト", publications: "研究発表", patents: "特許", career: "経歴" }
    : { home: "Overview", projects: "Projects", publications: "Publications", patents: "Patents", career: "Career" };
  const links = pages.map((item) => `<a href="${item.path[lang]}"${item.key === page.key ? ' class="active" aria-current="page"' : ""}>${labels[item.key]}</a>`).join("\n");
  const counterpart = pages.find((item) => item.key === page.key);
  return `<nav class="nav" aria-label="${lang === "ja" ? "主要ナビゲーション" : "Primary navigation"}">
${links}
<span class="lang-tabs" aria-label="Language"><a href="${counterpart.path.ja}" class="lang-tab${lang === "ja" ? " active" : ""}" lang="ja">JA</a><a href="${counterpart.path.en}" class="lang-tab${lang === "en" ? " active" : ""}" lang="en">EN</a></span>
</nav>`;
}

function renderPublicationItems(items, lang, includeReviewed = true) {
  return items.map((item) => {
    const title = lang === "ja" ? item.jaTitle : item.enTitle;
    const meta = lang === "ja" ? item.jaMeta : item.enMeta;
    const url = lang === "ja" ? item.jaUrl : item.enUrl;
    const titleHtml = url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)}</a>` : esc(title);
    const labels = (item.labels || []).map((label) => {
      if (label === "award") return tag("award", lang === "ja" ? "受賞" : "Award");
      if (label === "first") return tag("author", lang === "ja" ? "筆頭著者" : "First Author");
      if (label === "reviewed" && includeReviewed) return tag("reviewed", lang === "ja" ? "査読有" : "Peer-Reviewed");
      return "";
    }).join("");
    return `<article class="pub-item"><div class="pub-title">${titleHtml}</div><div class="pub-authors">${highlightName(item.authors)}</div>${labels ? `<div class="pub-tags">${labels}</div>` : ""}<div class="pub-meta">${esc(meta)}</div></article>`;
  }).join("\n");
}

function renderProductItems(items, lang) {
  return items.map((item, index) => {
    const links = item.links?.[lang] || [];
    const tags = [item.leader ? tag("primary", lang === "ja" ? "テーマリーダ" : "Theme Leader") : "", item.productPatent ? tag("product", lang === "ja" ? "採用特許" : "Adopted Patent") : ""].join("");
    return `<article class="product-hero-card product-impact-card ${index === 0 ? "featured" : ""}"><div class="product-impact-head"><div><div class="product-impact-kicker">Real-World Impact</div><h3 class="product-hero-title">${esc(lang === "ja" ? item.jaTitle : item.enTitle)}</h3></div><div class="product-impact-date">${esc(lang === "ja" ? item.jaDate : item.enDate)}</div></div><div class="product-impact-role"><span>${lang === "ja" ? "社会実装" : "Real-World Impact"}</span><span>${lang === "ja" ? "研究成果を実製品・サービスへ接続" : "Bridging research outcomes to real products and services"}</span></div>${tags ? `<div class="patent-tags product-impact-tags">${tags}</div>` : ""}<p class="product-hero-desc product-impact-desc">${esc(lang === "ja" ? item.jaDesc : item.enDesc)}</p><div class="product-impact-links">${links.map((link) => `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.title)}</a>`).join("")}</div></article>`;
  }).join("\n");
}

function renderResearchItems(items, lang) {
  return items.map((item) => {
    const labels = (item.labels || []).map((label) => tag(label.type, lang === "ja" ? label.ja : label.en)).join("");
    const highlights = lang === "ja" ? item.jaHighlights : item.enHighlights;
    const figure = item.figure ? `<figure class="research-figure"><img src="${esc(item.figure.src)}" alt="${esc(lang === "ja" ? item.figure.altJa : item.figure.altEn)}" loading="lazy" decoding="async"><figcaption>${esc(lang === "ja" ? item.figure.captionJa : item.figure.captionEn)}</figcaption></figure>` : "";
    return `<article class="research-impact-card"><div class="research-impact-head"><h3>${esc(lang === "ja" ? item.jaTitle : item.enTitle)}</h3><span>${esc(lang === "ja" ? item.periodJa : item.periodEn)}</span></div>${labels ? `<div class="tags">${labels}</div>` : ""}<p class="research-impact-desc">${esc(lang === "ja" ? item.jaDescription : item.enDescription).replace(/\n/g, "<br>")}</p>${highlights?.length ? `<ul class="research-bullets">${highlights.map((point) => `<li>${esc(point)}</li>`).join("")}</ul>` : ""}${figure}</article>`;
  }).join("\n");
}

function renderPatentCard(item, lang) {
  const ja = lang === "ja";
  const title = ja ? item.jaTitle : item.enTitle;
  const authors = ja ? item.authorsJa : item.authorsEn;
  const labels = [item.isProductUsed ? tag("product", ja ? "採用特許" : "Adopted Patent") : "", item.isRegistered ? tag("registered", ja ? "登録特許" : "Registered Patent") : "", item.isPrimary ? tag("primary", ja ? "主発明" : "Primary") : ""].join("");
  const value = (jp, en) => esc(ja ? (jp || "-") : (en || "-"));
  const number = (raw) => esc(ja ? (raw || "-") : patentNumberToEnglish(raw));
  const textBlob = [item.jaTitle, item.enTitle, item.authorsJa, item.authorsEn, item.filingNumber, item.publicationNumber, item.registrationNumber, item.country, item.countryEn, ...(item.patentFamily || []).flatMap((family) => Object.values(family))].join(" ").toLowerCase();
  const statuses = [item.isPrimary && "primary", item.isRegistered && "registered", item.isProductUsed && "product"].filter(Boolean).join(" ");
  const titleHtml = item.url ? `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(title)}</a>` : esc(title);
  const families = (item.patentFamily || []).map((family) => {
    const familyText = `${ja ? family.country : family.countryEn}: ${ja ? family.jaTitle : family.enTitle} (${ja ? family.filingNumber : patentNumberToEnglish(family.filingNumber)})`;
    return family.url ? `<div><a href="${esc(family.url)}" target="_blank" rel="noopener noreferrer">${esc(familyText)}</a></div>` : `<div>${esc(familyText)}</div>`;
  }).join("");
  const fields = ja
    ? [["出願番号", number(item.filingNumber)], ["出願日", value(item.filingDate, item.filingDateEn)], ["公開番号", number(item.publicationNumber)], ["公開日", value(item.publicationDate, item.publicationDateEn)], ["登録番号", number(item.registrationNumber)], ["登録日", value(item.registrationDate, item.registrationDateEn)]]
    : [["Filing", number(item.filingNumber)], ["Filing Date", value(item.filingDate, item.filingDateEn)], ["Publication", number(item.publicationNumber)], ["Publication Date", value(item.publicationDate, item.publicationDateEn)], ["Registration", number(item.registrationNumber)], ["Registration Date", value(item.registrationDate, item.registrationDateEn)]];
  return `<article class="patent-card" data-patent-card data-query="${esc(textBlob)}" data-country="${esc(item.country)}" data-status="${esc(statuses)}"><div class="patent-title">${titleHtml}</div><div class="patent-authors">${highlightName(authors)}</div>${labels ? `<div class="patent-tags">${labels}</div>` : ""}<div class="patent-meta-grid">${fields.map(([label, content]) => `<div class="patent-meta-item"><strong>${label}:</strong>${content}</div>`).join("")}<div class="patent-meta-item full"><strong>${ja ? "出願国" : "Country"}:</strong>${esc(ja ? item.country : item.countryEn)}</div>${families ? `<div class="patent-meta-item full"><strong>${ja ? "パテントファミリー" : "Patent Family"}:</strong>${families}</div>` : ""}</div></article>`;
}

function renderPatentGroups(items, lang) {
  const groups = [[lang === "ja" ? "登録特許" : "Registered Patents", items.filter((item) => item.isRegistered)], [lang === "ja" ? "その他" : "Other Patents", items.filter((item) => !item.isRegistered)]];
  return groups.map(([title, patents]) => `<div class="patent-section"><h3 class="group-title">${title} <span class="count-note" data-group-count>${lang === "ja" ? `(${patents.length}件)` : `(${patents.length})`}</span></h3><div class="patent-grid">${patents.sort((a, b) => String(b.filingDateISO).localeCompare(String(a.filingDateISO))).map((item) => renderPatentCard(item, lang)).join("\n")}</div><article class="patent-card patent-card-empty" hidden><div class="muted">${lang === "ja" ? "該当する特許がありません。" : "No patents found."}</div></article></div>`).join("\n");
}

function replaceEmptyContainer(html, id, content) {
  return html.replace(new RegExp(`<div id="${id}"([^>]*)><\\/div>`), `<div id="${id}"$1>${content}</div>`);
}

function fillDynamicContent(html, model, lang) {
  const suffix = lang === "ja" ? "件" : "";
  const stats = {
    "stat-productized": model.stats.productized,
    "stat-awards": model.stats.awards,
    "stat-research-output": model.stats.researchOutputs,
    "stat-reviewed-paper": model.stats.reviewedPapers,
    "stat-patents": model.stats.patentApplications,
    "stat-registered": model.stats.registeredPatents,
    "stat-product-patent": model.stats.adoptedPatents,
  };
  for (const [prefix, count] of Object.entries(stats)) {
    html = html.replace(new RegExp(`(<span class="stat-number" id="${prefix}-number">)0(<\\/span>)`), `$1${count}$2`);
    html = html.replace(new RegExp(`<span class="stat-suffix" id="${prefix}-suffix"><\\/span>`), `<span class="stat-suffix" id="${prefix}-suffix">${suffix}</span>`);
  }
  html = replaceEmptyContainer(html, "top-product-cards", renderProductItems(model.topProductCards, lang));
  html = replaceEmptyContainer(html, "research-impact-list", renderResearchItems(model.researchImpactProjects, lang));
  html = replaceEmptyContainer(html, "award-list", model.awards.map((item) => `<article class="award-item compact"><div class="award-title">${esc(lang === "ja" ? item.jaTitle : item.enTitle)}</div><div class="award-meta">${esc(lang === "ja" ? item.jaMeta : item.enMeta)}</div></article>`).join(""));
  html = replaceEmptyContainer(html, "journal-list", renderPublicationItems(model.publications.journals, lang));
  html = replaceEmptyContainer(html, "international-list", renderPublicationItems(model.publications.international, lang));
  html = replaceEmptyContainer(html, "domestic-list", renderPublicationItems(model.publications.domestic, lang, false));
  html = html.replace('<span class="count-note" id="journal-count-note"></span>', `<span class="count-note" id="journal-count-note">${lang === "ja" ? `(${model.publications.journals.length}件)` : `(${model.publications.journals.length})`}</span>`);
  html = html.replace('<span class="count-note" id="international-count-note"></span>', `<span class="count-note" id="international-count-note">${lang === "ja" ? `(${model.publications.international.length}件)` : `(${model.publications.international.length})`}</span>`);
  html = html.replace('<span class="count-note" id="domestic-count-note"></span>', `<span class="count-note" id="domestic-count-note">${lang === "ja" ? `(${model.publications.domestic.length}件)` : `(${model.publications.domestic.length})`}</span>`);
  html = replaceEmptyContainer(html, "all-patent-list", renderPatentGroups(model.patents, lang));
  const certs = model.certifications[lang] || [];
  html = replaceEmptyContainer(html, "cert-list", certs.map((item) => `<article class="cert-card"><div class="cert-title">${item.url ? `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.title)}</a>` : esc(item.title)}</div><div class="cert-meta">${esc(item.meta)}</div>${item.url ? `<div class="cert-tags">${tag("verified", lang === "ja" ? "認証リンクあり" : "Verified")}</div>` : ""}</article>`).join(""));
  html = replaceEmptyContainer(html, "society-list", model.societies.map((item) => `<article class="society-item"><div class="timeline-title">${esc(lang === "ja" ? item.jaTitle : item.enTitle)}</div><div class="muted">${esc(lang === "ja" ? item.periodJa : item.periodEn)}</div></article>`).join(""));
  return html;
}

function selectSections(html, pageKey) {
  const allowed = new Set(pageSections[pageKey]);
  return html.replace(/<section\b[\s\S]*?<\/section>/g, (section) => {
    const id = section.match(/\bid="([^"]+)"/)?.[1] || (section.match(/class="[^"]*\bhero\b/) ? "hero" : "");
    return allowed.has(id) ? section : "";
  });
}

function linkHighlightCards(html, lang) {
  const routes = {
    "top-products": lang === "ja" ? "/ja/projects/#top-products" : "/projects/#top-products",
    career: lang === "ja" ? "/ja/career/#awards" : "/career/#awards",
    publications: lang === "ja" ? "/ja/publications/#publications" : "/publications/#publications",
    patents: lang === "ja" ? "/ja/patents/#patents" : "/patents/#patents",
  };
  return html.replace(/<button class="stat-tile stat-link" type="button" data-scroll-target="([^"]+)">([\s\S]*?)<\/button>/g, (_, target, content) => `<a href="${routes[target]}" class="stat-tile stat-link">${content}</a>`);
}

function renderJsonLd(page, lang, baseUrl) {
  const canonical = `${baseUrl}${page.path[lang]}`;
  const person = { "@type": "Person", "@id": `${baseUrl}/#person`, name: lang === "ja" ? "林 大介" : "Daisuke Hayashi", alternateName: lang === "ja" ? "Daisuke Hayashi" : "林 大介", image: `${baseUrl}/assets/images/profile.jpg`, jobTitle: "AI Researcher", email: "mailto:daisuke.hayashi.fw@hitachi.com", sameAs: ["https://www.linkedin.com/in/daisuke-hayashi/", "https://scholar.google.com/citations?hl=ja&user=mHRLTWoAAAAJ"], affiliation: [{ "@type": "Organization", name: "Hitachi, Ltd." }, { "@type": "CollegeOrUniversity", name: "Kyoto University" }] };
  return page.key === "home" ? { "@context": "https://schema.org", "@type": "ProfilePage", url: canonical, mainEntity: person } : { "@context": "https://schema.org", "@type": "WebPage", url: canonical, about: person };
}

function renderPage({ page, lang, model, buildVersion, config = {} }) {
  const baseUrl = config.baseUrl || "https://disk-hayashi.github.io";
  let body = read("partials/body.shell.html").replaceAll("/profile.jpg", "/assets/images/profile.jpg");
  body = fillDynamicContent(body, model, lang);
  body = selectSections(body, page.key);
  body = body.replace(/<nav class="nav">[\s\S]*?<\/nav>/, renderNav(page, lang));
  body = linkHighlightCards(body, lang);
  body = body.replace('<span id="year"></span>', String(new Date().getUTCFullYear()));
  body = localizeMarkup(body, lang);

  const canonical = `${baseUrl}${page.path[lang]}`;
  const head = read("partials/head.meta.html")
    .replaceAll("{{TITLE}}", esc(page.title[lang]))
    .replaceAll("{{DESCRIPTION}}", esc(page.desc[lang]))
    .replaceAll("{{CANONICAL}}", canonical)
    .replaceAll("{{CANONICAL_URL}}", canonical)
    .replaceAll("{{JA_URL}}", `${baseUrl}${page.path.ja}`)
    .replaceAll("{{EN_URL}}", `${baseUrl}${page.path.en}`)
    .replaceAll("{{BASE_URL}}", baseUrl)
    .replaceAll("{{OG_TITLE}}", esc(page.title[lang]))
    .replaceAll("{{OG_DESCRIPTION}}", esc(page.desc[lang]))
    .replaceAll("{{OG_IMAGE_ALT}}", lang === "ja" ? "林 大介 — AI研究者プロフィール" : "Daisuke Hayashi — AI Researcher Profile")
    .replaceAll("{{OG_LOCALE}}", lang === "ja" ? "ja_JP" : "en_US")
    .replaceAll("{{OG_LOCALE_ALTERNATE}}", lang === "ja" ? "en_US" : "ja_JP")
    .replaceAll("{{JSON_LD}}", safeJson(renderJsonLd(page, lang, baseUrl)))
    .replaceAll("{{BUILD_VERSION}}", buildVersion);
  const patentScript = page.key === "patents" ? `\n<script src="/assets/js/site.js?v=${buildVersion}" defer></script>` : "";
  return `<!doctype html>\n<html lang="${lang}">\n<head>\n${head}\n</head>\n<body data-page-type="${page.key}">\n${body}${patentScript}\n</body>\n</html>\n`;
}

module.exports = { pages, renderPage, esc, localizeMarkup };
