const fs = require('fs');

function buildPage(lang, url) {
  const template = fs.readFileSync('template.html', 'utf-8');

  const isJA = lang === 'ja';

  const seo = `
<meta name="description" content="${isJA ? '林大介の研究者プロフィール' : 'Daisuke Hayashi researcher'}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="https://disk-hayashi.github.io/">
<link rel="alternate" hreflang="ja" href="https://disk-hayashi.github.io/ja/">
`;

  const jsonld = `
<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "Person",
 "name": "Daisuke Hayashi",
 "url": "${url}"
}
</script>
`;

  let html = template.replace("{{SEO}}", seo).replace("{{JSONLD}}", jsonld);
  return html;
}

fs.writeFileSync("index.html", buildPage("en", "https://disk-hayashi.github.io/"));
if (!fs.existsSync("ja")) fs.mkdirSync("ja");
fs.writeFileSync("ja/index.html", buildPage("ja", "https://disk-hayashi.github.io/ja/"));
