# Personal Website (EN/JA Auto Build)

This repository contains a bilingual (English / Japanese) personal website.
All pages are generated from a single source (`site.config.js`).

---

## 🚀 Deployment (Automatic)

This site is automatically built and deployed using GitHub Actions.

### Steps

```bash
git add .
git commit -m "Update profile site"
git push
```

After pushing, GitHub Actions will:

1. Run `build.js`
2. Generate all pages (EN / JA)
3. Deploy to GitHub Pages

---

## 🛠 Local Development (Optional)

If you want to preview locally:

```bash
npm install
node build.js
```

Then open:

```txt
index.html
ja/index.html
```

---

## 📁 Project Structure

```txt
site.config.js   # All content (edit here)
build.js         # Static site generator
assets/          # CSS / images
.github/workflows/pages.yml  # Auto deploy
```

---

## 🌍 Generated Pages

```txt
/               → Home (EN)
/ja/            → Home (JA)
/research/      → Research
/projects/      → Projects
/publications/  → Publications
/cv/            → CV
```

---

## 🔍 SEO Features

* sitemap.xml (auto-generated)
* robots.txt
* canonical URLs
* hreflang (EN/JA)
* Open Graph (OGP)
* Twitter Card
* JSON-LD (Person / WebSite)

---

## ✏️ How to Update Content

Edit:

```js
site.config.js
```

Then push:

```bash
git push
```

That’s it.

---

## ⚡ Notes

* Do NOT edit generated HTML directly
* Always edit `site.config.js`
* GitHub Actions handles everything else

---
