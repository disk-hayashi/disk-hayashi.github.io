(function () {
  const pageType =
    document.body.dataset.pageType ||
    document.documentElement.dataset.pageType ||
    window.__PAGE_TYPE__ ||
    "overview";

  const lang =
    document.body.dataset.langMode ||
    document.documentElement.dataset.langMode ||
    window.__LANG_MODE__ ||
    "ja";

  const pageGroups = {
    overview: [
      "researcher profile",
      "overview",
      "ハイライト",
      "highlights",
    ],
    projects: [
      "featured work",
      "製品化",
      "commercialization",
      "research themes",
      "研究業績",
      "research impact",
    ],
    publications: [
      "publications",
      "論文発表",
      "journal papers",
      "ジャーナル論文",
      "international conference papers",
      "国際会議論文",
      "domestic conferences",
      "国内会議",
    ],
    patents: [
      "intellectual property",
      "特許",
      "patents",
    ],
    career: [
      "background",
      "職歴・学歴",
      "career & education",
      "recognition",
      "受賞・表彰",
      "awards",
      "credentials",
      "資格",
      "certifications",
      "professional community",
      "所属学会",
      "societies",
    ],
  };

  const navItems = {
    en: [
      ["Overview", "/"],
      ["Projects", "/projects/"],
      ["Publications", "/publications/"],
      ["Patents", "/patents/"],
      ["Career", "/career/"],
    ],
    ja: [
      ["概要", "/ja/"],
      ["プロジェクト", "/ja/projects/"],
      ["論文発表", "/ja/publications/"],
      ["特許", "/ja/patents/"],
      ["経歴", "/ja/career/"],
    ],
  };

  const langSwitch = {
    ja: {
      overview: "/",
      projects: "/projects/",
      publications: "/publications/",
      patents: "/patents/",
      career: "/career/",
    },
    en: {
      overview: "/ja/",
      projects: "/ja/projects/",
      publications: "/ja/publications/",
      patents: "/ja/patents/",
      career: "/ja/career/",
    },
  };

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function getSectionText(section) {
    const heading = section.querySelector(
      "h1,h2,h3,.eyebrow,.section-title"
    );
    return normalize(heading ? heading.textContent : section.textContent);
  }

  function isTargetSection(section) {
    const text = getSectionText(section);
    const targets = pageGroups[pageType] || pageGroups.overview;

    return targets.some((target) => text.includes(normalize(target)));
  }

  function splitSections() {
    const sections = Array.from(document.querySelectorAll("section"));

    sections.forEach((section) => {
      section.style.display = isTargetSection(section) ? "" : "none";
    });
  }

  function updateNav() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    nav.innerHTML = "";

    navItems[lang].forEach(([label, href]) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;

      if (
        (pageType === "overview" && (href === "/" || href === "/ja/")) ||
        href.includes(pageType)
      ) {
        a.classList.add("active");
      }

      nav.appendChild(a);
    });
  }

  function updateLanguageLinks() {
    const jaLink = document.getElementById("lang-ja-link");
    const enLink = document.getElementById("lang-en-link");

    if (jaLink) {
      jaLink.href = lang === "ja" ? "/ja/" : langSwitch.en[pageType];
      jaLink.classList.toggle("active", lang === "ja");
    }

    if (enLink) {
      enLink.href = lang === "en" ? "/" : langSwitch.ja[pageType];
      enLink.classList.toggle("active", lang === "en");
    }
  }

  function applyBoldRestore() {
    document.documentElement.classList.add("multi-page-ready");

    const styleId = "multi-page-bold-restore";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      body {
        font-weight: 700;
      }

      p,
      .muted,
      .pub-meta,
      .award-meta,
      .cert-meta,
      .timeline-meta,
      .product-hero-desc,
      .patent-authors,
      .research-impact-card p,
      figcaption {
        font-weight: 600;
      }

      h1,
      h2,
      h3,
      .brand,
      .pub-title,
      .patent-title,
      .award-title,
      .cert-title,
      .timeline-title,
      .product-hero-title,
      .stat-number,
      .name-strong {
        font-weight: 900;
      }

      nav a,
      .lang-switch,
      #lang-ja-link,
      #lang-en-link,
      .tag,
      .chip,
      .focus-chip,
      .btn {
        font-weight: 800;
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    updateNav();
    updateLanguageLinks();
    splitSections();
    applyBoldRestore();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
