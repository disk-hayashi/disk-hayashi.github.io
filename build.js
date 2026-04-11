const fs = require('fs');
const path = require('path');
const config = require('./site.config.js');

function readText(relativePath) {
  return fs.readFileSync(path.join(__dirname, relativePath), 'utf-8');
}

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
    jobTitle: page.langMode === 'ja' ? '研究者' : 'Researcher',
    description: page.description,
    worksFor: {
      '@type': 'Organization',
      name: 'Hitachi, Ltd.',
      url: 'https://www.hitachi.co.jp/'
    },
    affiliation: [
      {
        '@type': 'Organization',
        name: 'Hitachi, Ltd.',
        url: 'https://www.hitachi.co.jp/'
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'Kyoto University',
        url: 'https://www.kyoto-u.ac.jp/'
      }
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Tokyo University of Agriculture and Technology'
    },
    knowsAbout: [
      'Computer Vision',
      'Natural Language Processing',
      'Machine Learning',
      'Food AI',
      'Medical AI'
    ],
    sameAs: [
      'https://www.linkedin.com/in/daisuke-hayashi/',
      'https://scholar.google.com/citations?hl=ja&user=mHRLTWoAAAAJ',
      'https://researchmap.jp/daisuke_hayashi',
      'https://github.com/disk-hayashi'
    ]
  };
}

function applyReplacements(template, replacements) {
  return Object.entries(replacements).reduce((html, [key, value]) => {
    return html.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }, template);
}

function buildHeadMeta(page) {
  const headTemplate = readText(path.join('partials', 'head.meta.html'));
  return applyReplacements(headTemplate, {
    TITLE: escapeHtmlAttr(page.title),
    DESCRIPTION: escapeHtmlAttr(page.description),
    CANONICAL: escapeHtmlAttr(page.canonical),
    JA_URL: escapeHtmlAttr(config.site.jaUrl),
    EN_URL: escapeHtmlAttr(config.site.enUrl),
    OG_TITLE: escapeHtmlAttr(page.ogTitle),
    OG_DESCRIPTION: escapeHtmlAttr(page.ogDescription),
    OG_LOCALE: escapeHtmlAttr(page.ogLocale),
    OG_LOCALE_ALTERNATE: escapeHtmlAttr(page.ogLocaleAlternate),
    JSON_LD: jsonForScript(buildJsonLd(page))
  });
}

function buildPage(lang) {
  const template = readText('template.html');
  const page = config.pages[lang];
  const replacements = {
    HTML_LANG: escapeHtmlAttr(page.htmlLang),
    LANG_MODE: escapeHtmlAttr(page.langMode),
    HEAD_META: buildHeadMeta(page),
    BODY_SHELL: readText(path.join('partials', 'body.shell.html')),
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
