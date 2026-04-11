function escapeHtml(str) {
      return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function currentLang() {
      return document.documentElement.getAttribute("data-lang-mode") || document.documentElement.getAttribute("lang-mode") || window.__LANG_MODE__ || "en";
    }

    function makeTag(type, ja, en) {
      const text = currentLang() === "ja" ? ja : en;
      return `<span class="tag ${type}">${escapeHtml(text)}</span>`;
    }

    function isJapanesePatentNumber(value) {
      return /^特願|^特開|^特許/.test(String(value || ""));
    }

    function patentNumberToEnglish(value) {
      if (!value) return "-";
      if (!isJapanesePatentNumber(value)) return value;
      return "P" + String(value).replace(/[^\dA-Za-z]/g, "");
    }

    function highlightMyName(authors) {
      if (!authors) return "";
      let html = escapeHtml(authors);
      const patterns = [
        /Daisuke Hayashi/g,
        /D\. Hayashi/g,
        /林 大介/g,
        /林\u3000大介/g,
        /林大介/g
      ];
      patterns.forEach((pattern) => {
        html = html.replace(pattern, (m) => `<span class="name-strong">${m}</span>`);
      });
      return html;
    }

    const siteData = window.__SITE_DATA__ || {};
    const {
      societies,
      publications,
      certifications,
      awards,
      patents,
      researchImpactProjects,
      topProductCards
    } = siteData;

    function renderTopProductCards() {
      const root = document.getElementById("top-product-cards");
      root.innerHTML = topProductCards.map(card => {
        const links = currentLang() === "ja" ? card.links.ja : card.links.en;
        const tags = [];
        if (card.leader) tags.push(makeTag("primary", "テーマリーダ", "Theme Leader"));
        if (card.productPatent) tags.push(makeTag("product", "製品採用特許", "Patent Used in Product"));

        const featuredBadge = card.featured ? `<div class="product-feature-badge">${currentLang() === "ja" ? "代表成果" : "Featured"}</div>` : "";

        return `
          <article class="product-hero-card">
            ${featuredBadge}
            <div class="product-hero-top">
              <h3 class="product-hero-title">${escapeHtml(currentLang() === "ja" ? card.jaTitle : card.enTitle)}</h3>
              <div class="product-hero-date">${escapeHtml(currentLang() === "ja" ? card.jaDate : card.enDate)}</div>
            </div>
            ${tags.length ? `<div class="patent-tags">${tags.join("")}</div>` : ""}
            <div class="product-hero-desc">${escapeHtml(currentLang() === "ja" ? card.jaDesc : card.enDesc)}</div>
            <div class="product-hero-links">
              ${links.map(link => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.title)}</a>`).join("")}
            </div>
          </article>
        `;
      }).join("");
    }

    function renderSocieties() {
      const root = document.getElementById("society-list");
      root.innerHTML = societies.map(item => `
        <article class="society-item">
          <div class="timeline-title">${escapeHtml(currentLang() === "ja" ? item.jaTitle : item.enTitle)}</div>
          <div class="muted">${escapeHtml(currentLang() === "ja" ? item.periodJa : item.periodEn)}</div>
        </article>
      `).join("");
    }

    function renderSimpleList(targetId, items) {
      const root = document.getElementById(targetId);
      root.innerHTML = items.map(item => {
        const title = currentLang() === "ja" ? item.jaTitle : item.enTitle;
        const meta = currentLang() === "ja" ? item.jaMeta : item.enMeta;
        const url = currentLang() === "ja" ? item.jaUrl : item.enUrl;
        const titleHtml = url
          ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a>`
          : escapeHtml(title);

        const labels = (item.labels || []).map(label => {
          if (label === "award") return makeTag("award", "受賞", "Award");
          if (label === "first") return makeTag("author", "筆頭著者", "First Author");
          if (label === "reviewed") return makeTag("reviewed", "査読有", "Peer-Reviewed");
          return "";
        }).join("");

        return `
          <article class="pub-item">
            <div class="pub-title">${titleHtml}</div>
            <div class="pub-authors">${highlightMyName(item.authors || "")}</div>
            ${labels ? `<div class="pub-tags">${labels}</div>` : ""}
            <div class="pub-meta">${escapeHtml(meta || "")}</div>
          </article>
        `;
      }).join("");
    }

    function renderDomesticList() {
      const root = document.getElementById("domestic-list");
      root.innerHTML = publications.domestic.map(item => {
        const title = currentLang() === "ja" ? item.jaTitle : item.enTitle;
        const meta = currentLang() === "ja" ? item.jaMeta : item.enMeta;
        const url = currentLang() === "ja" ? item.jaUrl : item.enUrl;
        const titleHtml = url
          ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a>`
          : escapeHtml(title);

        const labels = (item.labels || []).map(label => {
          if (label === "award") return makeTag("award", "受賞", "Award");
          if (label === "first") return makeTag("author", "筆頭著者", "First Author");
          return "";
        }).join("");

        return `
          <article class="pub-item">
            <div class="pub-title">${titleHtml}</div>
            <div class="pub-authors">${highlightMyName(item.authors || "")}</div>
            ${labels ? `<div class="pub-tags">${labels}</div>` : ""}
            <div class="pub-meta">${escapeHtml(meta || "")}</div>
          </article>
        `;
      }).join("");
    }

    function renderCertifications() {
      const root = document.getElementById("cert-list");
      const items = currentLang() === "ja" ? certifications.ja : certifications.en;
      root.innerHTML = items.map(item => {
        const titleHtml = item.url
          ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a>`
          : escapeHtml(item.title);
        const verifiedTag = item.url ? `<div class="cert-tags">${makeTag("verified", "認証リンクあり", "Verified")}</div>` : "";
        return `
          <article class="cert-card">
            <div class="cert-title">${titleHtml}</div>
            <div class="cert-meta">${escapeHtml(item.meta)}</div>
            ${verifiedTag}
          </article>
        `;
      }).join("");
    }

    function renderAwards() {
      const root = document.getElementById("award-list");
      root.innerHTML = awards.map(item => `
        <article class="award-item compact">
          <div class="award-title">${escapeHtml(currentLang() === "ja" ? item.jaTitle : item.enTitle)}</div>
          <div class="award-meta">${escapeHtml(currentLang() === "ja" ? item.jaMeta : item.enMeta)}</div>
        </article>
      `).join("");
    }

    function patentCard(p) {
      const tags = [];
      if (p.isPrimary) tags.push(makeTag("primary", "主発明", "Primary"));
      if (p.isRegistered) tags.push(makeTag("registered", "登録特許", "Registered Patent"));
      if (p.isProductUsed) tags.push(makeTag("product", "製品採用特許", "Patent Used in Product"));

      const title = currentLang() === "ja" ? p.jaTitle : p.enTitle;
      const authors = currentLang() === "ja" ? p.authorsJa : p.authorsEn;
      const filingDate = currentLang() === "ja" ? p.filingDate : p.filingDateEn;
      const pubDate = currentLang() === "ja" ? p.publicationDate : p.publicationDateEn;
      const regDate = currentLang() === "ja" ? p.registrationDate : p.registrationDateEn;
      const country = currentLang() === "ja" ? p.country : p.countryEn;

      const filingNo = currentLang() === "ja" ? p.filingNumber : patentNumberToEnglish(p.filingNumber);
      const pubNo = currentLang() === "ja" ? (p.publicationNumber || "-") : patentNumberToEnglish(p.publicationNumber || "-");
      const regNo = currentLang() === "ja"
        ? (p.registrationNumber || "-")
        : (p.registrationNumber ? patentNumberToEnglish(p.registrationNumber) : "-");

      const titleHtml = p.url
        ? `<a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a>`
        : escapeHtml(title);

      const filedLabel = currentLang() === "ja" ? "出願番号" : "Filing";
      const pubLabel = currentLang() === "ja" ? "公開番号" : "Publication";
      const regLabel = currentLang() === "ja" ? "登録番号" : "Registration";
      const countryLabel = currentLang() === "ja" ? "出願国" : "Country";
      const filedDateLabel = currentLang() === "ja" ? "出願日" : "Filing Date";
      const pubDateLabel = currentLang() === "ja" ? "公開日" : "Publication Date";
      const regDateLabel = currentLang() === "ja" ? "登録日" : "Registration Date";

      return `
        <article class="patent-card">
          <div class="patent-title">${titleHtml}</div>
          <div class="patent-authors">${highlightMyName(authors)}</div>
          ${tags.length ? `<div class="patent-tags">${tags.join("")}</div>` : ""}
          <div class="patent-meta-grid">
            <div class="patent-meta-item"><strong>${filedLabel}:</strong>${escapeHtml(filingNo || "-")}</div>
            <div class="patent-meta-item"><strong>${filedDateLabel}:</strong>${escapeHtml(filingDate || "-")}</div>
            <div class="patent-meta-item"><strong>${pubLabel}:</strong>${escapeHtml(pubNo || "-")}</div>
            <div class="patent-meta-item"><strong>${pubDateLabel}:</strong>${escapeHtml(pubDate || "-")}</div>
            <div class="patent-meta-item"><strong>${regLabel}:</strong>${escapeHtml(regNo || "-")}</div>
            <div class="patent-meta-item"><strong>${regDateLabel}:</strong>${escapeHtml(regDate || "-")}</div>
            <div class="patent-meta-item full"><strong>${countryLabel}:</strong>${escapeHtml(country)}</div>
          </div>
        </article>
      `;
    }

    function renderPatents() {
      const searchText = (document.getElementById("patent-search").value || "").toLowerCase().trim();
      const countryValue = document.getElementById("country-filter").value;
      const typeValue = document.getElementById("type-filter").value;

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

      const root = document.getElementById("all-patent-list");
      root.innerHTML = filtered
        .sort((a, b) => String(b.filingDateISO).localeCompare(String(a.filingDateISO)))
        .map(patentCard)
        .join("");

      if (!filtered.length) {
        root.innerHTML = `
          <article class="patent-card">
            <div class="muted">${currentLang() === "ja" ? "該当する特許がありません。" : "No patents found."}</div>
          </article>
        `;
      }
    }

    function renderResearchImpact() {
      const root = document.getElementById("research-impact-list");
      root.innerHTML = researchImpactProjects.map(item => {
        const title = currentLang() === "ja" ? item.jaTitle : item.enTitle;
        const period = currentLang() === "ja" ? item.periodJa : item.periodEn;
        const desc = currentLang() === "ja" ? item.jaDescription : item.enDescription;
        const tags = (item.labels || []).map(label =>
          makeTag(label.type, label.ja, label.en)
        ).join("");

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
      const productCount = topProductCards.length;
      const awardCount = awards.length;
      const journalCount = document.querySelectorAll("#journal-list .pub-item").length;
      const internationalCount = document.querySelectorAll("#international-list .pub-item").length;
      const domesticCount = document.querySelectorAll("#domestic-list .pub-item").length;
      const patentCount = patents.length;
      const registeredCount = patents.filter(p => p.isRegistered).length;
      const productPatentCount = patents.filter(p => p.isProductUsed).length;
      const paperCount = journalCount + internationalCount;
      const ja = currentLang() === "ja";

      const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value);
      };

      setText("stat-productized-number", ja ? `${productCount}件` : productCount);
      setText("stat-awards-number", ja ? `${awardCount}件` : awardCount);
      setText("stat-patents-number", ja ? `${patentCount}件` : patentCount);
      setText("stat-registered-number", ja ? `${registeredCount}件` : registeredCount);
      setText("stat-product-patent-number", ja ? `${productPatentCount}件` : productPatentCount);
      setText("stat-paper-number", ja ? `${paperCount}件` : paperCount);

      document.getElementById("journal-count-note").textContent = ja ? `(${journalCount}件)` : `(${journalCount})`;
      document.getElementById("international-count-note").textContent = ja ? `(${internationalCount}件)` : `(${internationalCount})`;
      document.getElementById("domestic-count-note").textContent = ja ? `(${domesticCount}件)` : `(${domesticCount})`;
    }

    function renderAll() {
      renderTopProductCards();
      renderSocieties();
      renderSimpleList("journal-list", publications.journals);
      renderSimpleList("international-list", publications.international);
      renderDomesticList();
      renderCertifications();
      renderAwards();
      renderPatents();
      renderResearchImpact();
      updateStats();
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

    const patentSearch = document.getElementById("patent-search");
    const countryFilter = document.getElementById("country-filter");
    const typeFilter = document.getElementById("type-filter");

    if (patentSearch) patentSearch.addEventListener("input", renderPatents);
    if (countryFilter) countryFilter.addEventListener("change", renderPatents);
    if (typeFilter) typeFilter.addEventListener("change", renderPatents);

    setupLanguageLinks();
    renderAll();
