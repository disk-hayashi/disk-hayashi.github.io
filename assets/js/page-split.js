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
    overview: ["overview"],
    projects: ["featured work", "research themes"],
    publications: ["publications"],
    patents: ["intellectual property"],
    career: ["recognition", "background", "credentials", "professional community"],
  };

  const navItems = {
    ja: [
      ["概要", "/ja/", "overview"],
      ["プロジェクト", "/ja/projects/", "projects"],
      ["論文発表", "/ja/publications/", "publications"],
      ["特許", "/ja/patents/", "patents"],
      ["経歴", "/ja/career/", "career"],
    ],
    en: [
      ["Overview", "/", "overview"],
      ["Projects", "/projects/", "projects"],
      ["Publications", "/publications/", "publications"],
      ["Patents", "/patents/", "patents"],
      ["Career", "/career/", "career"],
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
    const eyebrow = section.querySelector(".eyebrow, .section-kicker");
    if (eyebrow) return normalize(eyebrow.textContent);
  
    const heading = section.querySelector(":scope > h1, :scope > h2, :scope > h3");
    if (heading) return normalize(heading.textContent);
  
    return "";
  }

  function isHeroSection(section) {
    const keyText = sectionKeyText(section);
    const text = normalize(section.textContent);
  
    return (
      keyText.includes("researcher profile") ||
      text.includes("primary affiliation") ||
      text.includes("academic program") ||
      text.includes("focus areas")
    );
  }
  
  function shouldShow(section) {
    const keyText = sectionKeyText(section);
  
    if (section.querySelector("h1")) return true;
  
    if (pageType === "overview") {
      return (
        keyText.includes("overview") ||
        keyText.includes("ハイライト")
      );
    }
  
    if (pageType === "projects") {
      return (
        keyText.includes("featured") ||
        keyText.includes("research")
      );
    }
  
    if (pageType === "publications") {
      return keyText.includes("publication") || keyText.includes("論文");
    }
  
    if (pageType === "patents") {
      return keyText.includes("patent") || keyText.includes("特許");
    }
  
    if (pageType === "career") {
      return (
        keyText.includes("career") ||
        keyText.includes("background") ||
        keyText.includes("資格")
      );
    }
  
    return false;
  }
  function updateNav() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    nav.innerHTML = "";

    navItems[lang].forEach(([label, href, key]) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      if (key === pageType) a.classList.add("active");
      nav.appendChild(a);
    });

    const langBox = document.createElement("span");
    langBox.className = "lang-tabs";

    const ja = document.createElement("a");
    ja.href = langUrls.ja[pageType] || "/ja/";
    ja.textContent = "JA";
    ja.className = "lang-tab";
    if (lang === "ja") ja.classList.add("active");

    const en = document.createElement("a");
    en.href = langUrls.en[pageType] || "/";
    en.textContent = "EN";
    en.className = "lang-tab";
    if (lang === "en") en.classList.add("active");

    langBox.appendChild(ja);
    langBox.appendChild(en);
    nav.appendChild(langBox);
  }

  function injectStyle() {
    if (document.getElementById("page-split-style")) return;

    const style = document.createElement("style");
    style.id = "page-split-style";
    style.textContent = `
      nav a.active {
        color: #2563eb !important;
        font-weight: 900 !important;
      }

      .lang-tabs {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-left: 14px;
        padding: 3px;
        border: 1px solid #cdddf2;
        border-radius: 999px;
        background: #ffffff;
        box-shadow: 0 4px 12px rgba(15, 42, 77, 0.08);
      }

      .lang-tabs .lang-tab {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 34px;
        height: 30px;
        padding: 0 10px;
        border-radius: 999px;
        color: #0f2a4d;
        text-decoration: none;
        font-weight: 900;
      }

      .lang-tabs .lang-tab.active {
        background: #2563eb;
        color: #fff !important;
      }

      .research-impact-card,
      .research-card,
      .research-theme-card {
        border: 1px solid #cdddf2;
        border-radius: 22px;
        padding: 24px;
        background: #fff;
      }

      .research-impact-card figure,
      .research-figure {
        margin-top: 20px;
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    splitSections();
    updateNav();
    injectStyle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
