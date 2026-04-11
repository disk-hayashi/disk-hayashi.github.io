(function () {
  const siteData = window.__SITE_DATA__ || {};
  const langMode = window.__LANG_MODE__ || "en";

  const societies = siteData.societies || [];
  const publications = siteData.publications || { journals: [], international: [], domestic: [] };
  const certifications = siteData.certifications || { ja: [], en: [] };
  const awards = siteData.awards || [];
  const patents = siteData.patents || [];
  const topProductCards = siteData.topProductCards || [];
  const researchImpactProjects = siteData.researchImpactProjects || [];

  function currentLang() {
    return document.documentElement.getAttribute("lang-mode") || langMode;
  }

  function escapeHtml(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function makeTag(type, ja, en) {
    return `<span class="tag tag-${escapeHtml(type)}">${escapeHtml(currentLang() === "ja" ? ja : en)}</span>`;
  }

  function highlightMyName(text = "") {
    return escapeHtml(text).replace(/Daisuke Hayashi/g, "<strong>Daisuke Hayashi</strong>");
  }

  function patentNumberToEnglish(value = "") {
    return String(value);
  }

  function renderSocieties() {
    const root = document.getElementById("society-list");
    if (!root) return;
    root.innerHTML = societies.map(item => `
      <article class="society-item">
        <div class="society-title">${escapeHtml(currentLang() === "ja" ? item.jaTitle : item.enTitle)}</div>
        <div class="society-meta">${escapeHtml(currentLang() === "ja" ? item.periodJa : item.periodEn)}</div>
      </article>
    `).join("");
  }

  function renderTopProductCards() {
    const root = document.getElementById("top-product-cards");
    if (!root) return;
    root.innerHTML = topProductCards.map(item => {
      const title = currentLang() === "ja" ? item.jaTitle : item.enTitle;
      const period = currentLang() === "ja" ? item.periodJa : item.periodEn;
      const desc = currentLang() === "ja" ? item.jaDescription : item.enDescription;
      const tags = (item.labels || []).map(label => makeTag(label.type, label.ja, label.en)).join("");

      return `
        <article class="impact-card">
          <div class="impact-card-header">
            <h3 class="impact-card-title">${escapeHtml(title)}</h3>
            <div class="impact-card-period">${escapeHtml(period || "")}</div>
          </div>
          ${tags ? `<div class="impact-tags">${tags}</div>` : ""}
          <p class="impact-card-desc">${escapeHtml(desc || "")}</p>
        </article>
      `;
    }).join("");
  }

  function renderSimpleList(rootId, items) {
    const root = document.getElementById(rootId);
    if (!root) return;

    root.innerHTML = items.map(item => {
      const title = currentLang() === "ja" ? item.jaTitle : item.enTitle;
      const meta = currentLang() === "ja" ? item.jaMeta : item.enMeta;
      const url = currentLang() === "ja" ? item.jaUrl : item.enUrl;
      const titleHtml = url
        ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a>`
        : escapeHtml(title);

      return `
        <article class="pub-item">
          <div class="pub-title">${titleHtml}</div>
          <div class="pub-authors">${highlightMyName(item.authors || "")}</div>
          <div class="pub-meta">${escapeHtml(meta || "")}</div>
        </article>
      `;
    }).join("");
  }

  function renderDomesticList() {
    renderSimpleList("domestic-list", publications.domestic || []);
  }

  function renderCertifications() {
    const root = document.getElementById("cert-list");
    if (!root) return;
    const items = currentLang() === "ja" ? certifications.ja : certifications.en;

    root.innerHTML = items.map(item => {
      const titleHtml = item.url
        ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a>`
        : escapeHtml(item.title);

      return `
        <article class="cert-card">
          <div class="cert-title">${titleHtml}</div>
          <div class="cert-meta">${escapeHtml(item.meta)}</div>
        </article>
      `;
    }).join("");
  }

  function renderAwards() {
    const root = document.getElementById("award-list");
    if (!root) return;
    root.innerHTML = awards.map(item => `
      <article class="award-item compact">
        <div class="award-title">${escapeHtml(currentLang() === "ja" ? item.jaTitle : item.enTitle)}</div>
        <div class="award-meta">${escapeHtml(currentLang() === "ja" ? item.jaMeta : item.enMeta)}</div>
      </article>
    `).join("");
  }

  function patentCard(p) {
    const title = currentLang() === "ja" ? p.jaTitle : p.enTitle;
    const authors = currentLang() === "ja" ? p.authorsJa : p.authorsEn;
    const country = currentLang() === "ja" ? p.country : p.countryEn;

    const titleHtml = p.url
      ? `<a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a>`
      : escapeHtml(title);

    return `
      <article class="patent-card">
        <div class="patent-title">${titleHtml}</div>
        <div class="patent-authors">${highlightMyName(authors || "")}</div>
        <div class="patent-meta-grid">
          <div class="patent-meta-item"><strong>No.:</strong> ${escapeHtml(patentNumberToEnglish(p.filingNumber || "-"))}</div>
          <div class="patent-meta-item"><strong>Country:</strong> ${escapeHtml(country || "-")}</div>
        </div>
      </article>
    `;
  }

  function renderPatents() {
    const root = document.getElementById("all-patent-list");
    if (!root) return;

    const searchEl = document.getElementById("patent-search");
    const countryEl = document.getElementById("country-filter");
    const typeEl = document.getElementById("type-filter");

    const searchText = (searchEl?.value || "").toLowerCase().trim();
    const countryValue = countryEl?.value || "";
    const typeValue = typeEl?.value || "";

    const filtered = patents.filter((p) => {
      const textBlob = [
        p.jaTitle, p.enTitle, p.authorsJa, p.authorsEn,
        p.filingNumber, p.publicationNumber, p.registrationNumber,
        p.country, p.countryEn
      ].join(" ").toLowerCase();

      const matchesSearch = !searchText || textBlob.includes(searchText);
      const matchesCountry = !countryValue || p.country === countryValue;
      const matchesType =
        !typeValue ||
        (typeValue === "primary" && p.isPrimary) ||
        (typeValue === "registered" && p.isRegistered) ||
        (typeValue === "product" && p.isProductUsed);

      return matchesSearch && matchesCountry && matchesType;
    });

    root.innerHTML = filtered
      .sort((a, b) => String(b.filingDateISO).localeCompare(String(a.filingDateISO)))
      .map(patentCard)
      .join("");

    if (!filtered.length) {
      root.innerHTML = `<article class="patent-card"><div class="muted">No patents found.</div></article>`;
    }
  }

  function renderResearchImpact() {
    const root = document.getElementById("research-impact-list");
    if (!root) return;

    root.innerHTML = researchImpactProjects.map(item => {
      const title = currentLang() === "ja" ? item.jaTitle : item.enTitle;
      const period = currentLang() === "ja" ? item.periodJa : item.periodEn;
      const desc = currentLang() === "ja" ? item.jaDescription : item.enDescription;
      const tags = (item.labels || []).map(label => makeTag(label.type, label.ja, label.en)).join("");

      return `
        <article class="impact-card">
          <div class="impact-card-header">
            <h3 class="impact-card-title">${escapeHtml(title)}</h3>
            <div class="impact-card-period">${escapeHtml(period)}</div>
          </div>
          ${tags ? `<div class="impact-tags">${tags}</div>` : ""}
          <p class="impact-card-desc">${escapeHtml(desc)}</p>
        </article>
      `;
    }).join("");
  }

  function updateStats() {
    const ja = currentLang() === "ja";
    const productCount = topProductCards.length;
    const awardCount = awards.length;
    const journalCount = publications.journals.length;
    const internationalCount = publications.international.length;
    const patentCount = patents.length;
    const primaryCount = patents.filter(p => p.isPrimary).length;
    const registeredCount = patents.filter(p => p.isRegistered).length;
    const productPatentCount = patents.filter(p => p.isProductUsed).length;

    const a = document.getElementById("stat-productized-label");
    const b = document.getElementById("stat-awards-label");
    const c = document.getElementById("stat-patents-label");
    const d = document.getElementById("stat-registered-product-label");
    const e = document.getElementById("stat-journal-label");
    const f = document.getElementById("stat-international-label");

    if (a) a.innerHTML = ja ? `製品化実績 ${productCount}件` : `Commercialized Cases ${productCount}`;
    if (b) b.innerHTML = ja ? `受賞・表彰 ${awardCount}件` : `Awards ${awardCount}`;
    if (c) c.innerHTML = ja ? `特許出願 ${patentCount}件<br>(主発明 ${primaryCount}件)` : `Patent Applications ${patentCount}<br>(Primary Inventions ${primaryCount})`;
    if (d) d.innerHTML = ja ? `登録特許 ${registeredCount}件<br>製品採用特許 ${productPatentCount}件` : `Registered Patents ${registeredCount}<br>Patents Used in Products ${productPatentCount}`;
    if (e) e.innerHTML = ja ? `ジャーナル論文 ${journalCount}件` : `Journal Papers ${journalCount}`;
    if (f) f.innerHTML = ja ? `国際会議論文 ${internationalCount}件` : `International Conference Papers ${internationalCount}`;
  }

  function setupLanguageLinks() {
    const jaLink = document.getElementById("lang-ja-link");
    const enLink = document.getElementById("lang-en-link");

    if (jaLink) {
      jaLink.setAttribute("href", "/ja/");
      jaLink.classList.toggle("active", currentLang() === "ja");
    }
    if (enLink) {
      enLink.setAttribute("href", "/");
      enLink.classList.toggle("active", currentLang() === "en");
    }
  }

  function renderAll() {
    renderTopProductCards();
    renderSocieties();
    renderSimpleList("journal-list", publications.journals || []);
    renderSimpleList("international-list", publications.international || []);
    renderDomesticList();
    renderCertifications();
    renderAwards();
    renderPatents();
    renderResearchImpact();
    updateStats();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("patent-search")?.addEventListener("input", renderPatents);
    document.getElementById("country-filter")?.addEventListener("change", renderPatents);
    document.getElementById("type-filter")?.addEventListener("change", renderPatents);

    setupLanguageLinks();
    renderAll();
  });
})();