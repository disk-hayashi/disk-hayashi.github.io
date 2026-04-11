const fs = require("fs");
const path = require("path");
const config = require("./site.config.js");

const template = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");

function buildJsonLd(page) {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Daisuke Hayashi",
      "url": config.site.enUrl,
      "sameAs": [
        "https://www.linkedin.com/in/daisuke-hayashi/"
      ],
      "jobTitle": "Researcher",
      "affiliation": [
        {
          "@type": "Organization",
          "name": "Hitachi, Ltd."
        },
        {
          "@type": "Organization",
          "name": "Kyoto University"
        }
      ],
      "knowsAbout": [
        "Computer Vision",
        "Machine Learning",
        "Natural Language Processing",
        "Food AI",
        "Medical AI"
      ],
      "description": page.description
    },
    null,
    2
  );
}

function applyReplacements(input, replacements) {
  let out = input;
  for (const [key, value] of Object.entries(replacements)) {
    out = out.split(key).join(value);
  }
  return out;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function buildPage(pageKey, outputPath) {
  const page = config.pages[pageKey];
  const replacements = {
    "{{HTML_LANG}}": page.htmlLang,
    "{{LANG_MODE}}": page.langMode,
    "{{TITLE}}": page.title,
    "{{DESCRIPTION}}": page.description,
    "{{CANONICAL}}": page.canonical,
    "{{JA_URL}}": config.site.jaUrl,
    "{{EN_URL}}": config.site.enUrl,
    "{{OG_TITLE}}": page.ogTitle,
    "{{OG_DESCRIPTION}}": page.ogDescription,
    "{{JSON_LD}}": buildJsonLd(page),
    "{{SITE_DATA}}": JSON.stringify(config.siteData, null, 2)
  };

  const html = applyReplacements(template, replacements);
  ensureDir(path.dirname(outputPath));
  fs.writeFileSync(outputPath, html, "utf8");
  console.log(`Built: ${outputPath}`);
}

function buildRobotsTxt() {
  const lines = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${config.site.baseUrl}/sitemap.xml`
  ];
  fs.writeFileSync(path.join(__dirname, "robots.txt"), lines.join("\n"), "utf8");
  console.log("Built: robots.txt");
}

function buildSitemapXml() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: config.site.enUrl, alt: config.site.jaUrl },
    { loc: config.site.jaUrl, alt: config.site.enUrl }
  ];

  const body = urls.map(({ loc, alt }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${loc === config.site.enUrl ? "1.0" : "0.9"}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${config.site.enUrl}" />
    <xhtml:link rel="alternate" hreflang="ja" href="${config.site.jaUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${config.site.enUrl}" />
  </url>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

  fs.writeFileSync(path.join(__dirname, "sitemap.xml"), xml, "utf8");
  console.log("Built: sitemap.xml");
}

buildPage("en", path.join(__dirname, "index.html"));
buildPage("ja", path.join(__dirname, "ja", "index.html"));
buildRobotsTxt();
buildSitemapXml();
