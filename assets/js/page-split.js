(function () {
  const pageType =
    document.body.dataset.pageType ||
    window.__PAGE_TYPE__ ||
    "overview";

  const lang =
    document.body.dataset.langMode ||
    window.__LANG_MODE__ ||
    "ja";

  // =========================
  // ページごとの表示対象
  // =========================
  const pageGroups = {
    overview: ["researcher profile", "overview", "ハイライト"],
    projects: ["featured work", "製品化", "研究業績"],
    patents: ["intellectual property", "特許"],
    publications: ["publications", "論文発表"],
    career: [
      "career",
      "職歴",
      "学歴",
      "受賞",
      "資格",
      "所属学会"
    ],
  };

  // =========================
  // ナビ（ここで定義する）
  // =========================
  const navItems = {
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

  function normalize(text) {
    return (text || "").toLowerCase().replace(/\s+/g, "");
  }

  function getSectionText(section) {
    const h =
      section.querySelector("h1,h2,h3,.section-title,.eyebrow");
    return normalize(h ? h.innerText : section.innerText);
  }

  function shouldShow(section) {
    const targets = pageGroups[pageType] || pageGroups.overview;
    const text = getSectionText(section);

    return targets.some((t) => text.includes(normalize(t)));
  }

  // =========================
  // セクション分割
  // =========================
  function splitSections() {
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      section.style.display = shouldShow(section) ? "" : "none";
    });
  }

  // =========================
  // ナビ生成（完全上書き）
  // =========================
  function buildNav() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    nav.innerHTML = "";

    navItems[lang].forEach(([label, href]) => {
      const isActive =
        (pageType === "overview" &&
          (href === "/" || href === "/ja/")) ||
        href.includes(pageType);

      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      if (isActive) a.classList.add("active");

      nav.appendChild(a);
    });

    // 言語切替
    const langSwitch = document.createElement("a");
    langSwitch.className = "lang-switch";

    if (lang === "ja") {
      langSwitch.href = {
        overview: "/",
        projects: "/projects/",
        patents: "/patents/",
        publications: "/publications/",
        career: "/career/",
      }[pageType];
      langSwitch.textContent = "EN";
    } else {
      langSwitch.href = {
        overview: "/ja/",
        projects: "/ja/projects/",
        patents: "/ja/patents/",
        publications: "/ja/publications/",
        career: "/ja/career/",
      }[pageType];
      langSwitch.textContent = "JA";
    }

    nav.appendChild(langSwitch);
  }

  // =========================
  // 実行
  // =========================
  function init() {
    splitSections();
    buildNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
