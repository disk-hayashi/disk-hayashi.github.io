const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const config = require("./site.config.js");
const siteData = require("./data/site.data.js");
const { createSiteModel } = require("./lib/site-model.js");
const { pages, renderPage } = require("./lib/render.js");

const BASE_URL = config.baseUrl || "https://disk-hayashi.github.io";
const model = createSiteModel(siteData);
const buildVersion = crypto
  .createHash("sha256")
  .update(fs.readFileSync(path.join(__dirname, "assets/css/site.css")))
  .update(fs.readFileSync(path.join(__dirname, "assets/js/site.js")))
  .digest("hex")
  .slice(0, 12);

function outputPathFromUrlPath(urlPath) {
  return urlPath === "/" ? "index.html" : path.join(urlPath.replace(/^\//, ""), "index.html");
}

function write(file, content) {
  const full = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
}

function buildSitemap() {
  const entries = pages.flatMap((page) => ["en", "ja"].map((lang) => `  <url>
    <loc>${BASE_URL}${page.path[lang]}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page.key === "home" ? "1.0" : "0.8"}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.path.en}" />
    <xhtml:link rel="alternate" hreflang="ja" href="${BASE_URL}${page.path.ja}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${page.path.en}" />
  </url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>\n`;
}

for (const page of pages) {
  for (const lang of ["en", "ja"]) {
    const output = outputPathFromUrlPath(page.path[lang]);
    write(output, renderPage({ page, lang, model, config, buildVersion }));
    console.log(`Generated: ${output}`);
  }
}

write("sitemap.xml", buildSitemap());
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`);
console.log("Build completed.");
