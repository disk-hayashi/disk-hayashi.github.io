(function () {
  function setupPatentFilters() {
    const search = document.getElementById("patent-search");
    const country = document.getElementById("country-filter");
    const type = document.getElementById("type-filter");
    const cards = Array.from(document.querySelectorAll("[data-patent-card]"));
    const groups = Array.from(document.querySelectorAll(".patent-section"));
    const status = document.getElementById("patent-filter-status");

    if (!search || !country || !type || !cards.length) return;

    const applyFilters = () => {
      const query = search.value.trim().toLowerCase();
      let totalVisible = 0;

      for (const card of cards) {
        const matchesQuery = !query || card.dataset.query.includes(query);
        const matchesCountry = !country.value || card.dataset.country === country.value;
        const matchesType = !type.value || card.dataset.status.split(" ").includes(type.value);
        card.hidden = !(matchesQuery && matchesCountry && matchesType);
        if (!card.hidden) totalVisible += 1;
      }

      for (const group of groups) {
        const visible = Array.from(group.querySelectorAll("[data-patent-card]")).filter((card) => !card.hidden).length;
        const count = group.querySelector("[data-group-count]");
        const empty = group.querySelector(".patent-card-empty");
        if (count) count.textContent = document.documentElement.lang === "ja" ? `(${visible}件)` : `(${visible})`;
        if (empty) empty.hidden = visible !== 0;
      }

      if (status) {
        status.textContent = document.documentElement.lang === "ja"
          ? `${totalVisible}件の特許を表示しています。`
          : `Showing ${totalVisible} patents.`;
      }
    };

    search.addEventListener("input", applyFilters);
    country.addEventListener("change", applyFilters);
    type.addEventListener("change", applyFilters);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupPatentFilters);
  } else {
    setupPatentFilters();
  }
})();
