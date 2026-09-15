function validateSiteData(data) {
  if (!data.publications || typeof data.publications !== "object") {
    throw new TypeError("publications must be an object");
  }

  for (const key of ["journals", "international", "domestic"]) {
    if (!Array.isArray(data.publications[key])) {
      throw new TypeError(`publications.${key} must be an array`);
    }
  }

  for (const key of ["patents", "awards", "topProductCards", "researchImpactProjects", "societies"]) {
    if (!Array.isArray(data[key])) {
      throw new TypeError(`${key} must be an array`);
    }
  }
}

function createSiteModel(data) {
  validateSiteData(data);
  const outputs = Object.values(data.publications).flat();

  return {
    ...data,
    stats: {
      productized: data.topProductCards.length,
      awards: data.awards.length,
      researchOutputs: outputs.length,
      reviewedPapers: outputs.filter((item) => item.labels?.includes("reviewed")).length,
      patentApplications: data.patents.length,
      registeredPatents: data.patents.filter((item) => item.isRegistered).length,
      adoptedPatents: data.patents.filter((item) => item.isProductUsed).length,
    },
  };
}

module.exports = { createSiteModel, validateSiteData };
