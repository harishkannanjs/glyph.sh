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
  "author": "Your Name",
  "handle": "@yourusername",
  "role": "Software Engineer",
  "twitterHandle": "@yourusername",
  "title": "Your Name // Terminal Blog",
  "description": "Personal engineering notes, technical articles, and system projects.",
  "siteUrl": "https://yourusername.github.io",
  "githubUrl": "https://github.com/yourusername",
  "twitterUrl": "https://x.com/yourusername",
  "email": "you@example.com",
  "postsPerPage": 10,
  "giscus": {
    "enabled": true,
    "repo": "yourusername/blog",
    "repoId": "R_kgD...",
    "category": "General",
    "categoryId": "DIC_kwD..."
  }
}
```

### Localhost Dev Mode (Profile & Comments Editing)
To keep the website lightweight and eliminate complex external databases:
- **In Local Development (`bun run dev`):** The `$ edit-profile` toolbar automatically appears on `http://localhost:4321/profile` (or press `e`). You can update your author name, role, bio, social links, logo, and Giscus comment settings directly. Saving exports your updated configuration straight to [`profile.json`](file:///X:/Develop/blog/profile.json).
- **In Production (`github.io`):** The editing toolbar is **completely hidden**. Public visitors only see your clean, read-only author portfolio without any edit buttons or administrative interfaces.
- **Git Push:** Whenever you edit [`profile.json`](file:///X:/Develop/blog/profile.json), run `git push` to publish your updates live to GitHub Pages.

---

## 5. Setting Up Giscus (Discussions & Comments Powered by GitHub)

Comments and peer review discussions are powered by **[Giscus](https://giscus.app)** — a modern, zero-server commenting system built on GitHub Discussions. Comments and reactions are stored directly and securely in your GitHub repository's **Discussions** tab, allowing visitors to comment using their GitHub accounts with full markdown, syntax highlighting, and emoji reactions.

### Prerequisites
1. **Public Repository:** The repository hosting your discussions must be **Public** on GitHub (Giscus cannot access private repositories).
2. **Discussions Enabled:** GitHub Discussions must be turned on in your repository settings.
3. **Giscus GitHub App Authorized:** The Giscus app must be installed and granted access to your repository.

---

### Step-by-Step Setup Guide

#### Step 1: Enable GitHub Discussions
1. Open your repository on GitHub.
2. Click **Settings** (top navigation).
3. Under the **General** tab, scroll down to the **Features** section.
4. Check the box for **Discussions**.

#### Step 2: Install and Authorize the Giscus GitHub App
1. Go to the [Giscus GitHub App](https://github.com/apps/giscus).
2. Click **Install** (or **Configure** if already installed).
3. Under **Repository access**, select **Only select repositories** and pick your blog repository (e.g. `yourusername/blog`), or choose **All repositories**.
4. Click **Install & Authorize**.

#### Step 3: Obtain `repoId` and `categoryId` from Giscus
1. Navigate to **[giscus.app](https://giscus.app)**.
2. Under **Configuration** $\rightarrow$ **Repository**:
   - Enter your repository in `owner/repo` format (e.g. `yourusername/blog`).
   - Giscus will run automated checks confirming your repo is public, has Discussions enabled, and the app is installed.
3. Under **Page ↔ Discussions Mapping**:
   - Select **Discussion title contains page `pathname`** (this matches our blog's `data-mapping="pathname"` integration).
4. Under **Discussion Category**:
   - Select your preferred category from the dropdown (usually **General** or **Announcements**).
5. Scroll down to the **Enable giscus** section showing the generated `<script>` tag.
6. Copy the following two attributes:
   - `data-repo-id` (e.g., `R_kgDON...`)
   - `data-category-id` (e.g., `DIC_kwDON...`)

---

### Step 4: Configure the Blog

You can configure Giscus using either of the following two methods:

#### Method A: Via the `/profile` UI (Localhost Dev Mode)
1. Start the dev server: `bun run dev`.
2. Open [http://localhost:4321/profile](http://localhost:4321/profile) in your browser.
3. Click **$ edit-profile** (or press the `e` shortcut key).
4. Scroll to the **giscus.comments (GitHub Discussions)** section:
   - **giscus.repo:** `yourusername/blog`
   - **giscus.repoId:** `R_kgDON...`
   - **giscus.category:** `General` (matches your chosen category name)
   - **giscus.categoryId:** `DIC_kwDON...`
5. Click **Save to profile.json**.

#### Method B: Directly in `profile.json`
Open [`profile.json`](file:///X:/Develop/blog/profile.json) in your project root and update the `giscus` object:

```json
{
  "giscus": {
    "enabled": true,
    "repo": "yourusername/blog",
    "repoId": "R_kgDON...",
    "category": "General",
    "categoryId": "DIC_kwDON..."
  }
}
```

---

### Step 5: Verify & Deploy
1. Open any blog post on `http://localhost:4321/blog/...`.
2. Scroll to the bottom to the **Discussions & Peer Review** section.
3. The Giscus comment interface will load automatically with Catppuccin Mocha theme (synchronized with light/dark theme toggles).
4. Commit and push your changes to GitHub:
   ```bash
   git add profile.json README.md
   git commit -m "feat: configure giscus discussions"
   git push origin main
   ```

### Troubleshooting
- **"Discussion not found" or "Comments not loading":** Verify that the repository is **public**, the [Giscus App](https://github.com/apps/giscus) has repository access permissions, and your `repoId` and `categoryId` values strictly match the ones generated on [giscus.app](https://giscus.app).
- **Fallback Card Appears:** If `enabled` is `false` or any required IDs (`repo`, `repoId`, `categoryId`) are blank, the blog displays a clean fallback card with a direct link to your GitHub Discussions tab so visitors can still engage without errors.


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
