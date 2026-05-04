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
    overview: ["researcher profile", "overview"],
    projects: ["featured work", "research themes"],
    publications: ["publications"],
    patents: ["intellectual property"],
    career: ["recognition", "background", "credentials", "professional community"],
  };

  const navItems = {
    ja: [
      ["概要", "/ja/"],
      ["プロジェクト", "/ja/projects/"],
      ["論文発表", "/ja/publications/"],
      ["特許", "/ja/patents/"],
      ["経歴", "/ja/career/"],
    ],
    en: [
      ["Overview", "/"],
      ["Projects", "/projects/"],
      ["Publications", "/publications/"],
      ["Patents", "/patents/"],
      ["Career", "/career/"],
    ],
  };

  const langUrls = {
    ja: {
      overview: "/ja/",
      projects: "/ja/projects/",
      publications: "/ja/publications/",
      patents: "/ja/patents/",
      career: "/ja/career/",
    },
    en: {
      overview: "/",
      projects: "/projects/",
      publications: "/publications/",
      patents: "/patents/",
      career: "/career/",
    },
  };

  function normalize(text) {
    return String(text || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function sectionKeyText(section) {
    const heading = section.querySelector(".eyebrow, .section-kicker, h1, h2");
    return normalize(heading ? heading.textContent : "");
  }

  function shouldShow(section) {
    const keyText = sectionKeyText(section);
    const targets = pageGroups[pageType] || pageGroups.overview;
    return targets.some((target) => keyText.includes(normalize(target)));
  }

  function splitSections() {
    document.querySelectorAll("section").forEach((section) => {
      section.style.display = shouldShow(section) ? "" : "none";
    });
  }

  function isActive(href) {
    if (pageType === "overview") return href === "/" || href === "/ja/";
    return href.includes(`/${pageType}/`);
  }

  function updateNav() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    nav.innerHTML = "";

    navItems[lang].forEach(([label, href]) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      if (isActive(href)) a.classList.add("active");
      nav.appendChild(a);
    });

    const ja = document.createElement("a");
    ja.href = langUrls.ja[pageType] || "/ja/";
    ja.textContent = "JA";
    ja.className = "lang-pill";
    if (lang === "ja") ja.classList.add("active");
    nav.appendChild(ja);

    const en = document.createElement("a");
    en.href = langUrls.en[pageType] || "/";
    en.textContent = "EN";
    en.className = "lang-pill";
    if (lang === "en") en.classList.add("active");
    nav.appendChild(en);
  }

  function injectLangButtonStyle() {
    if (document.getElementById("lang-pill-style")) return;

    const style = document.createElement("style");
    style.id = "lang-pill-style";
    style.textContent = `
      nav .lang-pill {
        margin-left: 8px;
        padding: 7px 10px;
        border: 1px solid #cdddf2;
        border-radius: 999px;
        background: #fff;
        color: #0f2a4d;
        font-weight: 900;
        box-shadow: 0 4px 12px rgba(15, 42, 77, 0.08);
      }

      nav .lang-pill.active {
        background: #2563eb;
        color: #fff;
        border-color: #2563eb;
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    splitSections();
    updateNav();
    injectLangButtonStyle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
