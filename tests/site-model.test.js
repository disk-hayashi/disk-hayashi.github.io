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
  });
});

test("rejects a missing publication collection", () => {
  const { validateSiteData } = require("../lib/site-model.js");
  assert.throws(
    () => validateSiteData({ ...siteData, publications: null }),
    /publications must be an object/
  );
});
