# GitHub Pages final package

## Files you usually edit
- `site.config.js`: content, texts, counts, links, lists
- `template.html`: layout and styling

## Build
```bash
node build.js
```

This generates:
- `index.html`
- `ja/index.html`
- `robots.txt`
- `sitemap.xml`

## GitHub Pages placement
Put these files in the root of your repository:

- `build.js`
- `site.config.js`
- `template.html`
- `index.html`
- `robots.txt`
- `sitemap.xml`
- `ja/index.html`

## Notes
- English page: `/`
- Japanese page: `/ja/`
- `robots.txt` points to `/sitemap.xml`
- `sitemap.xml` includes both EN and JA URLs
