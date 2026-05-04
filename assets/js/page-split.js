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
      "daisuke hayashi",
      "林 大介",
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
      "recognition",
      "受賞・表彰",
      "awards",
      "background",
      "職歴・学歴",
      "career",
      "education",
      "credentials",
      "資格",
      "certifications",
      "professional community",
      "所属学会",
      "societies",
    ],
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
    return String(text || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function sectionText(section) {
    return normalize(section.textContent || "");
  }

  function isHeroSection(section) {
    const text = sectionText(section);
    return (
      text.includes("daisuke hayashi") ||
      text.includes("林 大介") ||
      text.includes("researcher profile")
    );
  }

  function shouldShow(section) {
    if (pageType === "overview" && isHeroSection(section)) {
      return true;
    }

    const targets = pageGroups[pageType] || pageGroups.overview;
    const text = sectionText(section);

    return targets.some((target) => text.includes(normalize(target)));
  }

  function splitSections() {
    document.querySelectorAll("section").forEach((section) => {
      section.style.display = shouldShow(section) ? "" : "none";
    });
  }

  function isActive(href) {
    if (pageType === "overview") {
      return href === "/" || href === "/ja/";
    }
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
    ja.classList.add("lang-pill");
    if (lang === "ja") ja.classList.add("active");
    nav.appendChild(ja);

    const en = document.createElement("a");
    en.href = langUrls.en[pageType] || "/";
    en.textContent = "EN";
    en.classList.add("lang-pill");
    if (lang === "en") en.classList.add("active");
    nav.appendChild(en);
  }

  function restoreLangLinkIds() {
    const jaLink = document.getElementById("lang-ja-link");
    const enLink = document.getElementById("lang-en-link");

    if (jaLink) {
      jaLink.href = langUrls.ja[pageType] || "/ja/";
      jaLink.classList.toggle("active", lang === "ja");
    }

    if (enLink) {
      enLink.href = langUrls.en[pageType] || "/";
      enLink.classList.toggle("active", lang === "en");
    }
  }

  function init() {
    splitSections();
    updateNav();
    restoreLangLinkIds();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
