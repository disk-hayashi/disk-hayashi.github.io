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

test("obsolete template stays removed", () => {
  assert.equal(fs.existsSync("template.html"), false);
});
