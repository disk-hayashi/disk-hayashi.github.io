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

  const pageMap = {
    home: "overview",
    overview: "overview",
    projects: "projects",
    publications: "publications",
    patents: "patents",
    career: "career",
  };

  const currentPage = pageMap[pageType] || "overview";

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

  const sectionRules = {
    overview: ["hero", "overview"],
    projects: ["projects", "featured", "research"],
    publications: ["publications"],
    patents: ["patents"],
    career: ["recognition", "background", "credentials", "societies"],
  };

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function getDirectHeading(section) {
    return (
      section.querySelector(":scope > .eyebrow") ||
      section.querySelector(":scope > .section-kicker") ||
      section.querySelector(":scope > h1") ||
      section.querySelector(":scope > h2") ||
      section.querySelector(":scope > h3") ||
      section.querySelector(".eyebrow") ||
      section.querySelector(".section-kicker") ||
      section.querySelector("h1") ||
      section.querySelector("h2") ||
      section.querySelector("h3")
    );
  }

  function classifySection(section) {
    if (section.dataset.section) return section.dataset.section;

    const heading = normalize(getDirectHeading(section)?.textContent || "");
    const text = normalize(section.textContent || "");

    if (
      heading.includes("researcher profile") ||
      text.includes("primary affiliation") ||
      text.includes("academic program") ||
      text.includes("focus areas")
    ) {
      return "hero";
    }

    if (
      heading.includes("overview") ||
      heading.includes("ハイライト") ||
      text.startsWith("overview") ||
      text.startsWith("ハイライト")
    ) {
      return "overview";
    }

    if (
      heading.includes("featured work") ||
      heading.includes("製品化") ||
      heading.includes("commercialization")
    ) {
      return "featured";
    }

    if (
      heading.includes("research themes") ||
      heading.includes("研究業績") ||
      heading.includes("research impact")
    ) {
      return "research";
    }

    if (
      heading.includes("publications") ||
      heading.includes("論文発表")
    ) {
      return "publications";
    }

    if (
      heading.includes("intellectual property") ||
      heading.includes("特許") ||
      heading.includes("patents")
    ) {
      return "patents";
    }

    if (
      heading.includes("recognition") ||
      heading.includes("受賞")
    ) {
      return "recognition";
    }

    if (
      heading.includes("background") ||
      heading.includes("職歴") ||
      heading.includes("学歴") ||
      heading.includes("career")
    ) {
      return "background";
    }

    if (
      heading.includes("credentials") ||
      heading.includes("資格") ||
      heading.includes("certifications")
    ) {
      return "credentials";
    }

    if (
      heading.includes("professional community") ||
      heading.includes("所属学会") ||
      heading.includes("societies")
    ) {
      return "societies";
    }

    return "unknown";
  }

  function shouldShow(section) {
    const type = classifySection(section);
    const allowed = sectionRules[currentPage] || sectionRules.overview;
    return allowed.includes(type);
  }

  function splitSections() {
    const sections = Array.from(document.querySelectorAll("section"));

    sections.forEach((section) => {
      const visible = shouldShow(section);
      section.style.display = visible ? "" : "none";
    });

    const visibleSections = sections.filter(
      (section) => section.style.display !== "none"
    );

    // 安全弁：何も表示されなくなった場合、概要はHero/Overview候補を復旧
    if (!visibleSections.length && currentPage === "overview") {
      sections.slice(0, 2).forEach((section) => {
        section.style.display = "";
      });
    }
  }

  function updateNav() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    nav.innerHTML = "";

    navItems[lang].forEach(([label, href, key]) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      if (key === currentPage) a.classList.add("active");
      nav.appendChild(a);
    });

    const tabs = document.createElement("span");
    tabs.className = "lang-tabs";

    const ja = document.createElement("a");
    ja.href = langUrls.ja[currentPage] || "/ja/";
    ja.textContent = "JA";
    ja.className = "lang-tab";
    if (lang === "ja") ja.classList.add("active");

    const en = document.createElement("a");
    en.href = langUrls.en[currentPage] || "/";
    en.textContent = "EN";
    en.className = "lang-tab";
    if (lang === "en") en.classList.add("active");

    tabs.appendChild(ja);
    tabs.appendChild(en);
    nav.appendChild(tabs);
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
      @media (max-width: 720px) {
        section:first-of-type {
          display: flex !important;
          flex-direction: column !important;
        }
      
        section:first-of-type > *:has(h1),
        section:first-of-type > *:has(.profile-info),
        section:first-of-type > *:has(.primary-affiliation) {
          order: 1 !important;
        }
      
        section:first-of-type > *:has(img),
        section:first-of-type > *:has(.focus-areas) {
          order: 2 !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function hideMobileHeaderSubtitle() {
    if (window.innerWidth > 720) return;
  
    const header = document.querySelector("header");
    if (!header) return;
  
    const targets = Array.from(header.querySelectorAll("*")).filter((el) => {
      const text = (el.textContent || "").trim();
      return (
        text === "COMPUTER VISION / NLP / 機械学習" ||
        text.includes("COMPUTER VISION") ||
        text.includes("機械学習")
      );
    });
  
    targets.forEach((el) => {
      if (!el.closest("nav")) {
        el.style.display = "none";
      }
    });
  }

  function reorderMobileHero() {
    if (window.innerWidth > 720) return;
  
    const hero = Array.from(document.querySelectorAll("section"))
      .find((section) => classifySection(section) === "hero");
  
    if (!hero) return;
  
    const children = Array.from(hero.children);
    const textBlock = children.find((el) =>
      normalize(el.textContent).includes("researcher profile") ||
      el.querySelector("h1")
    );
  
    const imageBlock = children.find((el) =>
      el.querySelector("img") ||
      normalize(el.textContent).includes("focus areas")
    );
  
    if (textBlock && imageBlock && hero.firstElementChild !== textBlock) {
      hero.insertBefore(textBlock, imageBlock);
    }
  }
  
  function init() {
    splitSections();
    updateNav();
    injectStyle();
    hideMobileHeaderSubtitle();
    reorderMobileHero();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
