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
      "Researcher Profile",
      "Overview",
      "ハイライト",
      "Highlights",
    ],
    projects: [
      "Featured Work",
      "製品化",
      "Commercialization",
      "Research Themes",
      "研究業績",
      "Research Impact",
    ],
    patents: [
      "Intellectual Property",
      "特許",
      "Patents",
    ],
    publications: [
      "Publications",
      "論文発表",
      "Journal Papers",
      "International Conference Papers",
      "Domestic Conferences",
      "ジャーナル論文",
      "国際会議論文",
      "国内会議",
    ],
    career: [
      "Background",
      "職歴・学歴",
      "Career & Education",
      "Recognition",
      "受賞・表彰",
      "Awards",
      "Credentials",
      "資格",
      "Certifications",
      "Professional Community",
      "所属学会",
      "Societies",
    ],
  };

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
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function sectionText(section) {
    const heading = section.querySelector("h1, h2, h3, .section-title, .eyebrow");
    return normalize(heading ? heading.textContent : section.textContent);
  }

  function shouldShow(section) {
    const targets = pageGroups[pageType] || pageGroups.overview;
    const text = sectionText(section);

    return targets.some((target) => text.includes(normalize(target)));
  }

  function splitSections() {
    const sections = Array.from(document.querySelectorAll("section"));

    if (!sections.length) return;

    sections.forEach((section) => {
      section.style.display = shouldShow(section) ? "" : "none";
    });
  }

  function updateNav() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    nav.innerHTML = navItems[lang]
      .map(([label, href]) => {
        const active =
          (pageType === "overview" && (href === "/" || href === "/ja/")) ||
          href.includes(pageType);

        return `<a href="${href}" class="${active ? "active" : ""}">${label}</a>`;
      })
      .join("");

    const otherLangPath =
      lang === "ja"
        ? {
            overview: "/",
            projects: "/projects/",
            patents: "/patents/",
            publications: "/publications/",
            career: "/career/",
          }[pageType]
        : {
            overview: "/ja/",
            projects: "/ja/projects/",
            patents: "/ja/patents/",
            publications: "/ja/publications/",
            career: "/ja/career/",
          }[pageType];

    nav.insertAdjacentHTML(
      "beforeend",
      `<a href="${otherLangPath}" class="lang-switch">${lang === "ja" ? "EN" : "JA"}</a>`
    );
  }

  function updateTitleVisibility() {
    const titleMap = {
      overview: { ja: "概要", en: "Overview" },
      projects: { ja: "プロジェクト", en: "Projects" },
      patents: { ja: "特許", en: "Patents" },
      publications: { ja: "論文発表", en: "Publications" },
      career: { ja: "経歴", en: "Career" },
    };

    document.body.setAttribute("data-current-page-label", titleMap[pageType]?.[lang] || "");
  }

  function init() {
    splitSections();
    updateNav();
    updateTitleVisibility();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
