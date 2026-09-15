const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "assets", "images");
const svgPath = path.join(outputDir, "og-profile.svg");
const pngPath = path.join(outputDir, "og-profile.png");

const portrait = fs.readFileSync(path.join(outputDir, "profile.jpg")).toString("base64");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#eaf2ff"/>
    </linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#93c5fd" stop-opacity=".42"/><stop offset="1" stop-color="#93c5fd" stop-opacity="0"/></radialGradient>
    <clipPath id="portrait"><circle cx="980" cy="300" r="150"/></clipPath>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#1e3a8a" flood-opacity=".16"/></filter>
  </defs>
  <rect width="1200" height="630" rx="42" fill="url(#bg)"/>
  <circle cx="1110" cy="80" r="260" fill="url(#glow)"/>
  <rect x="55" y="55" width="1090" height="520" rx="34" fill="#fff" fill-opacity=".80" stroke="#cbdcf4" stroke-width="2"/>
  <rect x="95" y="105" width="185" height="42" rx="21" fill="#e8f0ff"/>
  <text x="187" y="133" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="18" font-weight="700" fill="#1746a2" letter-spacing="1.2">AI RESEARCHER</text>
  <text x="95" y="225" font-family="DejaVu Sans, sans-serif" font-size="58" font-weight="700" fill="#0f172a">Daisuke Hayashi</text>
  <text x="98" y="270" font-family="DejaVu Sans, sans-serif" font-size="25" font-weight="700" fill="#2563eb">Kyoto University / Hitachi R&amp;D</text>
  <line x1="98" y1="318" x2="690" y2="318" stroke="#d7e4f7" stroke-width="2"/>
  <text x="98" y="375" font-family="DejaVu Sans, sans-serif" font-size="25" font-weight="700" fill="#334155">Computer Vision  ·  NLP  ·  Machine Learning</text>
  <text x="98" y="425" font-family="DejaVu Sans, sans-serif" font-size="22" fill="#64748b">Research · Implementation · Real-World Impact</text>
  <rect x="98" y="475" width="510" height="5" rx="2.5" fill="#2563eb"/>
  <circle cx="980" cy="300" r="166" fill="#dce9ff" filter="url(#shadow)"/>
  <circle cx="980" cy="300" r="154" fill="#fff"/>
  <image href="data:image/jpeg;base64,${portrait}" x="830" y="150" width="300" height="300" preserveAspectRatio="xMidYMid slice" clip-path="url(#portrait)"/>
</svg>\n`;

const portableSvg = svg.replace(`data:image/jpeg;base64,${portrait}`, "profile.jpg");
fs.writeFileSync(svgPath, portableSvg, "utf8");
sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(pngPath)
  .then(() => console.log(`Generated ${path.relative(root, pngPath)}`))
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
