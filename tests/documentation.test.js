const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("README documents current sources and commands", () => {
  const readme = fs.readFileSync("README.md", "utf8");

  for (const text of [
    "data/publications.data.js",
    "data/patents.data.js",
    "partials/body.shell.html",
    "npm test",
    "npm run build",
    "GitHub Actions",
  ]) {
    assert.match(
      readme,
      new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    );
  }

  assert.doesNotMatch(readme, /single source \(`site\.config\.js`\)/i);
  assert.match(readme, /生成ファイルを直接編集しても、次回のビルドで上書きされます/);
});

test("build sources do not depend on the obsolete template", () => {
  const buildSources = [
    "build.js",
    ...fs
      .readdirSync("lib", { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
      .map((entry) => `lib/${entry.name}`),
  ];

  for (const sourcePath of buildSources) {
    const source = fs.readFileSync(sourcePath, "utf8");
    assert.doesNotMatch(source, /template\.html/, sourcePath);
  }
});
