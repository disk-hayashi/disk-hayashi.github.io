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

  const groups = {
    overview: ["researcher profile", "overview", "ハイライト", "highlights"],
    projects: ["featured work", "製品化", "commercialization", "research themes", "研究業績", "research impact"],
    patents: ["intellectual property", "特許", "patents"],
    publications: ["publications", "論文発表", "journal papers", "international conference papers", "domestic conferences"],
    career: ["background", "職歴", "学歴", "career", "education", "recognition", "受賞", "credentials", "資格", "professional community", "所属学会", "societies"],
  };

  const nav = {
    en: [
      ["Overview", "/"],
      ["Projects", "/projects/"],
      ["Patents", "/patents/"],
      ["Publications", "/publications/"],
      ["Career", "/career/"],
    ],
    ja: [
      ["概要", "/ja/"],
      ["プロジェクト", "/ja/projects/"],
      ["特許", "/ja/patents/"],
      ["論文発表", "/ja/publications/"],
      ["経歴", "/ja/career/"],
    ],
  };

  const langMap = {
    en: {
      overview: "/ja/",
      projects: "/ja/projects/",
      patents: "/ja/patents/",
      publications: "/ja/publications/",
      career: "/ja/career/",
    },
    ja: {
      overview: "/",
      projects: "/projects/",
      patents: "/patents/",
      publications: "/publications/",
      career: "/career/",
    },
  };

  function normalize(text) {
    return String(text || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function sectionHeadingText(section) {
    const heading = section.querySelector("h1,h2,h3,.eyebrow,.section-title");
    return normalize(heading ? heading.textContent : section.textContent);
  }

  function splitSections() {
    const sections = Array.from(document.querySelectorAll("section"));
    const targets = groups[pageType] || groups.overview;

    sections.forEach((section) => {
      const text = sectionHeadingText(section);
      const visible = targets.some((key) => text.includes(normalize(key)));
      section.style.display = visible ? "" : "none";
    });
  }

  function buildNav() {
    const navEl = document.querySelector("nav");
    if (!navEl) return;

    navEl.innerHTML = "";

    nav[lang].forEach(([label, href]) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;

      if (
        (pageType === "overview" && (href === "/" || href === "/ja/")) ||
        href.includes(pageType)
      ) {
        a.classList.add("active");
      }

      navEl.appendChild(a);
    });

    const langSwitch = document.createElement("a");
    langSwitch.href = langMap[lang][pageType];
    langSwitch.textContent = lang === "ja" ? "EN" : "JA";
    langSwitch.className = "lang-switch";
    navEl.appendChild(langSwitch);
  }

  function fixLanguageLinks() {
    const jaLink = document.getElementById("lang-ja-link");
    const enLink = document.getElementById("lang-en-link");

    if (jaLink) jaLink.href = langMap.en[pageType];
    if (enLink) enLink.href = langMap.ja[pageType];
  }

  function init() {
    buildNav();
    fixLanguageLinks();
    splitSections();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
