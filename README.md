# Terminal Blog — "Terminal Monastic"

> A production-ready, security-research-focused technical blog platform built with **Astro 5**, **Tailwind CSS v4**, **MDX**, and **Pagefind**, styled using the authoritative Stitch **Terminal Monastic** design system.

---

## 1. Aesthetic & Architecture

- **Typography:** 100% self-hosted `JetBrains Mono` across all UI chrome, prose, code, and metadata.
- **Color Discipline:** Obsidian canvas (`#0b141c`), hairline 1px borders (`#242b32` / `#3a444d`), and terminal phosphor emerald accents (`#3ddc84`).
- **Elevation:** Zero `box-shadow` anywhere; depth is communicated purely through tonal surface stepping and 1px borders.
- **Theme:** Dark mode default with persistent light mode toggle (`localStorage`). Both modes independently verified for WCAG AA contrast.
- **Accessibility:** Full keyboard navigation support and strict `prefers-reduced-motion` compliance.

---

## 2. Features Across All 4 Tiers

### Tier 0 — Foundation
- [x] Drop any `.md`/`.mdx` file in `src/content/blog/` → automatically indexed, routed, and listed.
- [x] Unified `<BlogPostLayout>` shell for all post pages.
- [x] Dynamic reading time computed from actual word count.
- [x] Taxonomies: filterable `/tags` directory and dynamic `/tags/[tag]` routes.
- [x] Syntax-highlighted code blocks via Shiki with 1-click copy button and language badges.
- [x] Responsive layout from mobile (<768px) to ultrawide (≥1400px).
- [x] RSS 2.0 / Atom feed available at `/feed.xml` and `/rss.xml`.
- [x] Full SEO meta tags, canonical URLs, and auto-generated `sitemap-index.xml`.
- [x] Authentic UNIX crash terminal 404 page (`SIG_ERR: 404`).
- [x] SVG terminal prompt favicon + default social preview image.
- [x] Pagefind static search index built at compile time.
- [x] Draft support (`draft: true` strictly excluded from production routes, RSS, and search).
- [x] Auto-generated Table of Contents from headings (sticky rail ≥1280px, inline disclosure below).

### Tier 1 — Reading Experience
- [x] Sticky TOC with scroll-synced active heading highlighting.
- [x] Heading deep-link anchors with hover `#`, clipboard copy, and toast feedback.
- [x] Sidenotes / margin notes on wide displays (≥1400px), collapsing to inline notes on narrower screens.
- [x] Code blocks with diff view (`+`/`-` gutter markers) and copy buttons.
- [x] Sticky 2px reading progress bar tracking scroll depth on post pages.
- [x] Command Palette (`Ctrl+K` or `/`) with Pagefind integration, in-memory fallback, and arrow-key navigation.
- [x] Astro native View Transitions with morph animations between post card title and article title.

### Tier 2 — Subject-Specific Tools
- [x] `<Spoiler>` MDX component for CTF flags, exploit payloads, and hidden solutions.
- [x] `<Mermaid>` MDX component for sequence diagrams, exploit chains, and state machines.
- [x] KaTeX math rendering (`remark-math` + `rehype-katex`).
- [x] `<Asciinema>` MDX component for recorded terminal sessions.
- [x] First-class Series grouping with `<SeriesStrip>` progress tracker and part navigation.

### Tier 3 — Trust & Polish
- [x] Auto-generated 1200x630 OG preview images generated per post at build time (via Satori + Resvg).
- [x] `<ChangelogPopover>` showing revision history and syntax-highlighted code diffs.
- [x] Copy-as-Markdown button on all post pages.
- [x] Tag-affinity related posts recommendation matrix.
- [x] Previous & Next post navigation cards.
- [x] Giscus discussion section synchronized to the active dark/light theme.

---

## 3. Local Development

### Prerequisites
- [Bun](https://bun.sh) (v1.2+)

### Install Dependencies
```bash
bun install
```

### Run Local Development Server
```bash
bun run dev
```
Open [http://localhost:4321](http://localhost:4321) in your browser.

### Type Check & Build
```bash
# Type check and frontmatter validation
bun run astro check

# Static build and Pagefind search index generation
bun run build
```

### Preview Production Build
```bash
bun run preview
```

---

## 4. Deployment to GitHub Pages

The repository includes a ready-to-use GitHub Actions workflow in [`.github/workflows/deploy.yml`](file:///X:/Develop/blog/.github/workflows/deploy.yml).

### Step 1: Configure Repository Settings
1. Open your repository on GitHub.
2. Navigate to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.

### Step 2: Configure Your Domain in `astro.config.mjs`
Open [`astro.config.mjs`](file:///X:/Develop/blog/astro.config.mjs) and update the `site` property with your actual GitHub username:
```javascript
export default defineConfig({
  site: 'https://<your-github-username>.github.io',
  output: 'static',
  // ...
});
```

### Step 3: Deploy
Push your commits to the `main` branch:
```bash
git push origin main
```
The GitHub Action will automatically run `bun install`, `astro check`, `astro build`, generate the Pagefind index, and deploy to GitHub Pages.

---

## 5. Post Migration

For details on migrating your existing notes and write-ups into the blog, refer to [`MIGRATION.md`](file:///X:/Develop/blog/MIGRATION.md).
