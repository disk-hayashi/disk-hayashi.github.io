const fs = require('fs');
const path = require('path');
const config = require('./site.config.js');

function escapeHtmlAttr(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonForScript(value) {
  return JSON.stringify(value, null, 2)
    .replace(/<\//g, '<\\/')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');
}

function buildJsonLd(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Daisuke Hayashi',
    alternateName: '林大介',
    url: page.canonical,
    image: `${config.site.baseUrl}/profile.jpg`,
    jobTitle: page.langMode === 'ja'
      ? '研究者'
      : 'Researcher',
    worksFor: {
      '@type': 'Organization',
      name: 'Hitachi, Ltd.'
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Kyoto University'
    }
  };
}

function applyReplacements(template, replacements) {
  return Object.entries(replacements).reduce((html, [key, value]) => {
    return html.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }, template);
}

function buildPage(lang) {
  const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8');
  const page = config.pages[lang];
  const replacements = {
    HTML_LANG: escapeHtmlAttr(page.htmlLang),
    LANG_MODE: escapeHtmlAttr(page.langMode),
    TITLE: escapeHtmlAttr(page.title),
    DESCRIPTION: escapeHtmlAttr(page.description),
    CANONICAL: escapeHtmlAttr(page.canonical),
    JA_URL: escapeHtmlAttr(config.site.jaUrl),
    EN_URL: escapeHtmlAttr(config.site.enUrl),
    OG_TITLE: escapeHtmlAttr(page.ogTitle),
    OG_DESCRIPTION: escapeHtmlAttr(page.ogDescription),
    JSON_LD: jsonForScript(buildJsonLd(page)),
    SITE_DATA: jsonForScript(config.siteData)
  };

  return applyReplacements(template, replacements);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(relativePath, content) {
  const fullPath = path.join(__dirname, relativePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content);
}

writeFile('index.html', buildPage('en'));
writeFile(path.join('ja', 'index.html'), buildPage('ja'));
