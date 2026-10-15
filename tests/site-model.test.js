const test = require("node:test");
const assert = require("node:assert/strict");

const siteData = require("../data/site.data.js");

test("derives all highlight statistics from source data", () => {
  const { createSiteModel } = require("../lib/site-model.js");
  const model = createSiteModel(siteData);

  assert.deepEqual(model.stats, {
    productized: 2,
    awards: 3,
    researchOutputs: 9,
    reviewedPapers: 3,
    patentApplications: 9,
    registeredPatents: 5,
    adoptedPatents: 1,
    patentFamilies: 9,
    domesticRegisteredPatents: 5,
    overseasRegisteredPatents: 1,
    totalRegisteredPatents: 6,
    homepageRegisteredPatents: 5,
  });
});

test("rejects a missing publication collection", () => {
  const { validateSiteData } = require("../lib/site-model.js");
  assert.throws(
    () => validateSiteData({ ...siteData, publications: null }),
    /publications must be an object/
  );
});

test("patent stats distinguish families, domestic grants, overseas grants, and total grants", () => {
  const { createSiteModel } = require("../lib/site-model.js");
  const model = createSiteModel(siteData);
  assert.equal(model.stats.patentFamilies, 9);
  assert.equal(model.stats.domesticRegisteredPatents, 5);
  assert.equal(model.stats.overseasRegisteredPatents, 1);
  assert.equal(model.stats.totalRegisteredPatents, 6);
});

test("homepage registration highlight uses domestic grants so its scope matches patent applications", () => {
  const { createSiteModel } = require("../lib/site-model.js");
  const model = createSiteModel(siteData);
  assert.equal(model.stats.homepageRegisteredPatents, 5);
});
