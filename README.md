# Terminal Blog — Catppuccin Mocha Technical Research Platform

> A production-ready, high-performance technical blog and research repository built with **Astro 5**, **Tailwind CSS v4**, **MDX**, and **Pagefind**, styled strictly under the **Catppuccin Mocha** terminal aesthetic.

---

## 1. Aesthetic & Architecture

- **Color Palette:** Authentic **Catppuccin Mocha** dark mode (`#1e1e2e` Base, `#181825` Mantle, `#11111b` Crust, `#a6e3a1` Green accents, `#cdd6f4` Text) with synchronized **Catppuccin Latte** light mode.
- **Typography:** 100% self-hosted **JetBrains Mono** (`@fontsource/jetbrains-mono`, weights 400, 500, 700) across all UI chrome, headings, body text, and code blocks.
- **Elevation:** Strict zero `box-shadow` (`box-shadow: none !important`); depth is established purely through tonal stepping and 1px hairline borders (`#45475a`).
- **Interactive Terminal UI:** Blinking cursor pulse (`_`), terminal prompt prefixes (`> `, `$ `), and an authentic UNIX CLI command palette (`Ctrl+K` or `/`).
- **Search & Unified Taxonomy:** Instant client-side fuzzy search and embedded tag exploration with zero external page transitions.

---

## 2. Directory Structure & Content Organization

Articles are managed from the root `/Blogs` directory without complex configuration:

```
├── Blogs/
│   ├── series/
│   │   └── <name_of_the_series>/
│   │       ├── 01-first-part.mdx
│   │       ├── 02-second-part.mdx
│   │       └── ...
│   └── standalone/
│       ├── reverse-engineering-notes.md
│       └── ...
├── profile.json               <-- Single source of truth for author info & Giscus
├── astro.config.mjs           <-- Astro & Shiki syntax configuration
├── src/
│   ├── components/            <-- CommandPalette, Header, Footer, GiscusComments, etc.
│   ├── layouts/               <-- BaseLayout, BlogPostLayout
│   ├── lib/                   <-- Dynamic blog loader & Satori OG generator
│   ├── pages/                 <-- Index, about, profile, blog routes, RSS, feeds
│   └── styles/
│       └── global.css         <-- Catppuccin color variables & JetBrains Mono imports
└── .github/
    └── workflows/
        └── deploy.yml         <-- Automated GitHub Pages build & deploy
```

### Series Articles (`Blogs/series/<series_name>/`)
- Place multi-part deep dives inside a subdirectory under `Blogs/series/`.
- File naming like `01-title.md` or `02-title.mdx` automatically extracts:
  - The series slug and clean title.
  - The part number (e.g. Part 1, Part 2).
  - Sibling article count for the series progress strip.

### Standalone Articles (`Blogs/standalone/`)
- Place individual research notes, CTF write-ups, or tutorials directly inside `Blogs/standalone/`.
- Accessible at `/blog/standalone/<slug>` and aliased to `/blog/<slug>`.

### Article Frontmatter (Optional)
Files can include YAML frontmatter, or rely on auto-inferred titles from filenames:

```markdown
---
title: "Kernel ALPC Race Condition & Exploitation"
description: "In-depth analysis of Windows ALPC message ports and kernel race conditions."
pubDate: 2026-03-15
tags: ["kernel", "windows-internals", "reverse-engineering", "c"]
draft: false
---
```

---

## 3. Quick Start (Local Development)

### Prerequisites
- [Bun](https://bun.sh) (v1.2+) or Node.js (v20+)

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/blog.git
cd blog
bun install
```

### 2. Disable Astro Dev Toolbar (Recommended)
To keep your terminal view clean and distraction-free, disable Astro's floating overlay toolbar:
```bash
bunx astro preferences disable devToolbar
```

### 3. Start Development Server
```bash
bun run dev
```
Open [http://localhost:4321](http://localhost:4321) in your browser.

### 4. Build & Preview Production
```bash
# Type-check and validate all Astro/TypeScript files (0 errors, 0 warnings)
bun run astro check

# Compile static distribution and build Pagefind search indexes
bun run build

# Preview production build locally
bun run preview
```

---

## 4. Author Configuration (`profile.json`)

All identity and author details are stored directly in [`profile.json`](file:///X:/Develop/blog/profile.json) in the root of the repository:

```json
{
  "author": "Harish",
  "handle": "@harishkannanjs",
  "role": "Security Researcher & Systems Developer",
  "twitterHandle": "@harishkannanjs",
  "title": "Harish // Terminal Blog",
  "description": "Security research, vulnerability analysis, and low-level systems development.",
  "siteUrl": "https://harishkannanjs.github.io",
  "uid": "0x03E8",
  "tty": "TTY:0",
  "pgpKey": "0x4E89F19C2D4A88B1EE4089C91427AF10C9347890",
  "githubUrl": "https://github.com/harishkannanjs",
  "twitterUrl": "https://x.com/harishkannanjs",
  "email": "harish@research.local",
  "postsPerPage": 10,
  "giscus": {
    "enabled": true,
    "repo": "harishkannanjs/blog",
    "repoId": "",
    "category": "General",
    "categoryId": ""
  }
}
```

> **Dynamic Editor:** When running `bun run dev`, navigate to `http://localhost:4321/profile` to edit your details in the terminal UI. Clicking **"Save to Repository"** automatically persists changes directly into `profile.json` on disk.

---

## 5. Setting Up Giscus (GitHub Discussions Comments)

Comments and peer reviews are backed by **GitHub Discussions** via Giscus. This ensures comments are stored natively inside your GitHub repository while ensuring public visitors have **zero write access** to your codebase or GitHub Actions.

### Step 1: Enable GitHub Discussions
1. Open your repository on GitHub: `https://github.com/<your-username>/blog`.
2. Go to **Settings** $\rightarrow$ Scroll down to **Features**.
3. Check the box for **Discussions**.

### Step 2: Install the Giscus App
1. Go to [giscus.app](https://giscus.app) or [github.com/apps/giscus](https://github.com/apps/giscus).
2. Click **Install** and grant access to your `blog` repository (it requires permission *only* for Discussions, never code).

### Step 3: Get your Repository & Category IDs
1. On [giscus.app](https://giscus.app), under **Configuration**, enter your repository: `<your-username>/blog`.
2. Under **Discussion Category**, select your preferred category (e.g. `General` or `Announcements`).
3. Scroll down to **Enable giscus** and copy your:
   - `data-repo-id` (starts with `R_kgDO...`)
   - `data-category-id` (starts with `DIC_kwDO...`)

### Step 4: Add IDs to `profile.json`
Open [`profile.json`](file:///X:/Develop/blog/profile.json) and paste your credentials:
```json
"giscus": {
  "enabled": true,
  "repo": "<your-username>/blog",
  "repoId": "R_kgDO...",
  "category": "General",
  "categoryId": "DIC_kwDO..."
}
```
Commit and push. Embedded discussions will automatically activate under every article. If not yet configured, a clean fallback card directs readers to your repository Discussions tab without broken iframe errors.

---

## 6. Deployment to GitHub Pages (`github.io`)

The repository includes an automated GitHub Actions deployment workflow at [`.github/workflows/deploy.yml`](file:///X:/Develop/blog/.github/workflows/deploy.yml).

### Step 1: Enable GitHub Pages via Actions
1. Open your repository on GitHub.
2. Navigate to **Settings** $\rightarrow$ **Pages**.
3. Under **Build and deployment** $\rightarrow$ **Source**, choose **GitHub Actions**.

### Step 2: Set Your Domain in `astro.config.mjs`
Update the `site` property in [`astro.config.mjs`](file:///X:/Develop/blog/astro.config.mjs):
```javascript
export default defineConfig({
  site: 'https://<your-username>.github.io',
  output: 'static',
  // ...
});
```

### Step 3: Push to GitHub
```bash
git add .
git commit -m "chore: setup blog configuration"
git push origin main
```
The GitHub Action will automatically:
1. Check out the repository.
2. Install dependencies via Bun.
3. Validate types and frontmatter with `astro check`.
4. Compile static HTML with `astro build`.
5. Generate the Pagefind static search index.
6. Deploy the `dist/` directory to GitHub Pages.

---

## 7. Features & Interactive Tools

- **Unified Search & Tag Explorer (`Ctrl+K` or `/`):** Fast in-memory and Pagefind search with a bottom tag taxonomy explorer. Filter write-ups by clicking any tag pill or typing `#tag`.
- **Sticky Scroll-Synced TOC:** Automatically follows reading progress with active heading indicators.
- **Code Highlighting (Shiki):** Pre-configured with Catppuccin Mocha (dark) and Catppuccin Latte (light) with 1-click copy buttons and line diff markers (`+`/`-`).
- **Diagrams (`<Mermaid>`):** Dynamic architecture, sequence, and exploit chain diagrams styled in Catppuccin Mocha tokens.
- **Terminal Replays (`<Asciinema>`):** Interactive terminal recording player for shell demonstrations.
- **Mathematics (KaTeX):** Full LaTeX math equations supported via `remark-math` and `rehype-katex`.
- **Dynamic OpenGraph Images:** High-resolution 1200x630 social preview cards generated dynamically per write-up at compile time via Satori.
