---
title: "Welcome to glyph.sh"
description: "A fast, minimalist, and terminal-inspired personal publishing platform powered by Astro and Catppuccin."
pubDate: 2026-09-14
tags: ["getting-started", "template"]
draft: false
---

Welcome to **glyph.sh** — an authentic terminal-inspired, privacy-conscious publishing platform designed for engineers, security researchers, and systems developers.

## Features at a Glance

- **Catppuccin Aesthetic**: Native Mocha (dark) and Latte (light) color tokens with zero-shadow elevation and clean hairline borders.
- **Ultra-Fast Search**: Instant in-memory and Pagefind client-side search triggered by pressing <kbd>/</kbd> or <kbd>Ctrl+K</kbd>.
- **Zero-Config Content Management**:
  - **Standalone Posts**: Drop `.md` or `.mdx` files into `Blogs/standalone/`.
  - **Multi-Part Series**: Drop posts into `Blogs/series/<series-name>/` (e.g. `01-intro.md`, `02-deep-dive.md`).
- **Interactive Markdown Components**:
  - Code syntax highlighting with Shiki and 1-click copy.
  - Interactive diagram rendering with `<Mermaid />`.
  - Terminal replays with `<Asciinema />`.
  - LaTeX mathematical typography with KaTeX.
- **GitHub Discussions Integration**: Serverless, privacy-preserving comments powered by Giscus.
- **Localhost Developer Dashboard**: Edit your author profile, upload logos, and publish new write-ups directly from `http://localhost:4321/profile`.

## Writing Your First Article

To publish a new write-up:

1. Create a markdown file inside `Blogs/standalone/my-first-post.md`:
   ```markdown
   ---
   title: "My First Article"
   description: "A quick summary of this research write-up."
   pubDate: 2026-09-14
   tags: ["engineering", "systems"]
   ---

   # Hello World

   Write your thoughts here in standard GitHub Flavored Markdown.
   ```
2. Or use the built-in **Publish New Article** uploader available in your local dashboard at `/profile/`.

Happy writing!
