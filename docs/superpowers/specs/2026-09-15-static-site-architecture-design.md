# Profile Site Static Architecture Design

## Purpose

Improve search-engine visibility, resilience, maintainability, social sharing, accessibility, and deployment safety without materially changing the current visual design, URLs, or published content.

## Scope

This change implements all seven approved improvements:

1. Render statistics and content into HTML at build time.
2. Render only the sections required by each page.
3. Run tests before deployment in GitHub Actions.
4. Move inline CSS to a cacheable stylesheet and consolidate duplicate rules.
5. Add a dedicated 1200 × 630 Open Graph image.
6. Replace JavaScript-only navigation controls with ordinary links.
7. Update README documentation to match the actual project structure.

Existing public URLs, bilingual content, source data, colors, card layout, typography, and responsive visual hierarchy remain compatible.

## Architecture

### Source data

The files in `data/` remain the canonical content source. `site.config.js` remains the canonical page and site configuration source. Counts are derived from these modules and are never stored as separate manually maintained values.

### Build pipeline

`build.js` will:

1. Load and validate configuration and content data.
2. Derive statistics, including research-output and peer-reviewed-paper counts.
3. Render reusable components such as navigation, highlights, publication cards, patent cards, career entries, metadata, and footer.
4. Render only the sections assigned to the requested page.
5. Render only the active language's visible text into each language-specific page.
6. Write the ten existing EN/JA page outputs, sitemap, and robots file.

The output is useful before JavaScript runs. Search engines and no-script clients receive complete numbers, lists, headings, links, and metadata.

### Page composition

The existing routes and their content ownership remain:

- `/` and `/ja/`: profile hero and highlights.
- `/projects/` and `/ja/projects/`: real-world impact and research impact.
- `/publications/` and `/ja/publications/`: research outputs.
- `/patents/` and `/ja/patents/`: patents and filters.
- `/career/` and `/ja/career/`: awards, career, certifications, and societies.

`page-split.js` will be removed because the build will no longer emit unrelated sections into a page.

### Client JavaScript

`assets/js/site.js` will be reduced to behavior that genuinely requires a browser, primarily patent filtering. Page content, navigation, language switching, statistics, and normal links will not require JavaScript.

Every control that navigates will be an `<a href>` with a valid destination. Form controls will have accessible labels. External links opened in new tabs retain `rel="noopener noreferrer"`.

### Styles

All current presentation rules will move from `partials/head.meta.html` to `assets/css/site.css`. Duplicate selectors will be consolidated while preserving the current appearance. The stylesheet will be linked from every page and can be cached independently.

Responsive behavior remains:

- Desktop highlights: four cards on the first row and three centered cards on the second row.
- Tablet highlights: two columns.
- Mobile highlights: one column.

Reduced-motion behavior and visible keyboard focus states will be preserved.

## SEO and social metadata

Each output will retain unique title, description, canonical URL, `hreflang`, sitemap entries, Open Graph fields, Twitter Card fields, and JSON-LD.

The home pages will use `ProfilePage` JSON-LD with a `Person` as `mainEntity`. Subpages will use `WebPage` with the same person identity referenced as the page subject. URLs and organization affiliations remain unchanged.

A dedicated `assets/images/og-profile.png` will be generated at 1200 × 630 pixels using the existing portrait, blue-and-white visual language, name, role, affiliations, and focus areas. Both Open Graph and Twitter metadata will reference this asset.

## Error handling

The build will fail with a clear message when required data collections are missing or have invalid top-level shapes. Optional item fields will retain the current defensive fallbacks. Output directories will continue to be created automatically.

The deploy workflow will stop before publication if tests or the build fail.

## Tests and verification

Automated tests will verify:

- Derived counts equal the current data: nine research outputs and three peer-reviewed papers.
- Counts and content appear directly in generated HTML.
- Each route contains its assigned sections and excludes unrelated sections.
- Japanese and English outputs contain their intended language-level navigation and metadata.
- Internal root-relative links resolve to generated files or static assets.
- Navigation cards use real links rather than JavaScript-only buttons.
- No generated page loads `page-split.js`.
- The external stylesheet and 1200 × 630 Open Graph image exist.
- The sitemap covers every configured localized route.

Verification before delivery will run the complete test suite, a clean build, link checks, generated-output inspections, image-dimension checks, and ZIP integrity validation.

## Deployment and handoff

GitHub Actions will run `npm test` followed by `npm run build`, then upload and deploy the generated site. The completed deliverable will be supplied as a new ZIP so the prior version remains recoverable. A concise list of source files to update through GitHub's web interface will accompany the ZIP.

## Non-goals

- No change to public route names.
- No framework migration.
- No redesign of the site's visual identity.
- No changes to publication, patent, career, award, or project facts.
- No new analytics, cookies, forms, or external services.
