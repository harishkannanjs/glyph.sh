# Terminal Blog UI Brief — "Terminal Monastic"

## 1. Vision & Role
A production-ready personal technical blog for a security researcher / full-stack developer (reverse engineering, bug bounty research, low-level systems, robotics side projects).
Aesthetic: Monastic UNIX terminal, obsidian dark canvas, emerald green phosphor accents, crisp 1px borders, zero box-shadows, 100% JetBrains Mono.

---

## 2. Global Rules & Non-Negotiables
1. **Typography:** `JetBrains Mono` exclusively across all headers, body, UI chrome, metadata, code, and badges. No fallback sans-serif.
2. **Theme Default:** Dark mode is default on initial load. Light mode is secondary. Theme state persisted via `localStorage`.
3. **Radii:** 0px border-radius standard (`rounded-none`). The only exceptions are tiny micro-pills / tags (`2px` radius) and keyboard chips `<kbd>`.
4. **Elevation:** No `box-shadow` anywhere. Hierarchy is achieved solely through tonal surface steps (`bg-base`, `bg-surface`, `bg-surface-raised`, `code-bg`) and 1px hairline borders (`border`, `border-strong`).
5. **Accessibility:** Both light and dark palettes meet WCAG AA contrast standards. Respects `prefers-reduced-motion`.

---

## 3. Design Tokens

### 3.1 Color Palette (Dark Mode - Default)
- `bg-base` / `background`: `#0a0d10` (Foundational canvas, deep obsidian)
- `bg-surface` / `surface`: `#0b141c` (Primary surface for cards, reading column)
- `bg-surface-container`: `#182028` (Elevated containers, inputs, bars)
- `bg-surface-container-low`: `#141c24` (Subtle recessed container)
- `bg-surface-container-high`: `#222b33` (Badges, interactive pills, toggles)
- `bg-surface-container-highest`: `#2d363e` (Active highlights, hover)
- `bg-surface-raised`: `#161b21` (Overlays, command palette, popovers)
- `code-bg`: `#0d1117` (Dedicated recessed tone for code blocks)
- `border` / `outline-variant`: `#242b32` (Primary hairline border, ~#3c4a3f / #242b32)
- `border-strong` / `outline`: `#3a444d` (Focus rings, active borders, ~#869587)
- `text-primary` / `on-surface`: `#d5dbe0` / `#dae3ee` (High-contrast body & headers)
- `text-secondary` / `on-surface-variant`: `#8b949e` / `#bbcbbc` (Metadata, auxiliary labels)
- `text-tertiary` / `outline`: `#5b6570` / `#869587` (Line numbers, disabled items, timestamps)
- `accent` / `primary`: `#3ddc84` / `#60f99e` (Terminal emerald phosphor green)
- `accent-dim` / `primary-container`: `#2a9d63` / `#3ddc84` (Hover states, badges)
- `danger` / `error`: `#f2555a` / `#ffb4ab` (Critical alerts, deletion diffs, CVEs)

### 3.2 Color Palette (Light Mode - Secondary)
- `bg-base` / `background`: `#fafaf8` (Warm technical monograph paper)
- `bg-surface` / `surface`: `#ffffff` (Pure white containers)
- `bg-surface-container`: `#f4f4f0`
- `bg-surface-container-low`: `#f8f8f5`
- `bg-surface-container-high`: `#eaeae4`
- `bg-surface-raised`: `#ffffff`
- `code-bg`: `#f6f8fa`
- `border` / `outline-variant`: `#dcdcd6`
- `border-strong` / `outline`: `#9a9a92`
- `text-primary` / `on-surface`: `#1a1d1f`
- `text-secondary` / `on-surface-variant`: `#57606a`
- `text-tertiary` / `outline`: `#8c959f`
- `accent` / `primary`: `#0f7b45` (Deep forest green for WCAG AAA on light canvas)
- `accent-dim` / `primary-container`: `#1a9356`
- `danger` / `error`: `#cf222e`

### 3.3 Typography Hierarchy
- `display`: JetBrains Mono, 36px / line-height 48px, weight 600, letter-spacing -0.02em
- `headline-lg`: JetBrains Mono, 28px / line-height 40px, weight 600, letter-spacing -0.015em
- `headline-md`: JetBrains Mono, 20px / line-height 30px, weight 500, letter-spacing -0.01em
- `headline-sm`: JetBrains Mono, 16px / line-height 24px, weight 600, letter-spacing 0em
- `body-lg`: JetBrains Mono, 16px / line-height 28px (1.75 ratio), weight 400
- `body-md`: JetBrains Mono, 14px / line-height 24px, weight 400
- `body-sm`: JetBrains Mono, 13px / line-height 20px, weight 400
- `code-block`: JetBrains Mono, 13px / line-height 22px, weight 400
- `code-inline`: JetBrains Mono, 13px / line-height 20px, weight 500
- `label-md`: JetBrains Mono, 12px / line-height 16px, weight 500
- `label-sm`: JetBrains Mono, 11px / line-height 14px, weight 400

### 3.4 Spacing & Dimensions
- Reading measure: max-width 680px (optimal 68-72 characters)
- Main workspace container: max-width 1040px
- Header height: 56px (h-14)
- Margins: 2rem desktop (`px-8`), 1rem mobile (`px-4`)

---

## 4. Components & Pages Specifications

### 5.1 Header & Nav
Fixed top-0, backdrop blur, border-b border-outline-variant.
Logo: `> harish` in JetBrains Mono with emerald prompt.
Nav links: Home, Tags, About. Search button trigger (`/` or `Ctrl+K`).
ThemeToggle: Terminal cursor toggle `_` / switch with persisted localStorage state.

### 5.2 PostCard
Clean row layout: terminal prompt `$ cat <filename>`, reading time, tags, post title with hover emerald transition, excerpt, "read post →" and optional metadata badge (e.g. CVSS / tag).

### 5.3 TagBadge & Matrix
Small pill with 2px radius, `#` or dot indicator, count annotation, active and hover states.

### 5.4 Command Palette
Modal shell triggered by `Ctrl+K` or `/`. Centered floating terminal frame (width 580px), prompt `harish@research:~$`, real-time Pagefind static search indexing, arrow-key navigation, Esc to close.

### 5.5 Code Blocks
Header bar with language label, file name if specified, and 1-click copy button. Syntax highlighted via Shiki matching dark/light themes. Diff lines with `+` (green background tint) and `-` (red background tint). Line numbers and line highlighting support.

### 5.6 Table of Contents
Auto-generated from post headings (H2, H3). Sticky rail on desktop (≥1280px), collapsible disclosure on smaller viewports. Scroll-synced active heading highlighting.

### 5.7 Heading Anchors
Hover-visible `#` icon, click to copy deep link with temporary "Copied" toast / badge.

### 5.8 Sidenotes & Footnotes
Margin notes on viewports ≥1400px, collapsing cleanly to inline numbered footnotes on narrower viewports.

### 5.9 Spoiler / Reveal Block
`<Spoiler>` component for CTF flags, exploit payloads, hidden solutions with click-to-reveal toggle.

### 5.10 Series Strip
`<SeriesStrip>`: Shows "Part X of Y in [Series Name]", progress dots/links for all parts.

### 5.11 Related Posts
Shared tags algorithm at bottom of post.

### 5.12 Prev / Next Navigation
Clean terminal cards pointing to predecessor and successor posts.

### 5.13 Comments (giscus)
GitHub Discussions-backed comments, light/dark theme synchronized.

### 5.14 Reading Progress Bar
Sticky 2px emerald line at top of viewport tracking scroll percentage on post pages.

### 5.15 Changelog Popover
Popover showing publication date, updated date, and diff/revision notes for revisions.

### 5.16 Copy as Markdown Button
Copies the full raw markdown content of the current post to the clipboard with visual confirmation.

---

## 6. Pages
- `6.1 Home (/)`: Terminal intro buffer, list of latest posts, pagination, quick search shortcut banner.
- `6.2 Blog Post (/blog/[...slug])`: Full teardown layout, TOC, Series strip, changelog, comments, prev/next.
- `6.3 Tags Index (/tags)`: Taxonomy directory, tag cloud with post counts.
- `6.4 Tag Filter (/tags/[tag])`: Filtered list for a specific tag with terminal query bar.
- `6.5 About (/about)`: Terminal `whoami`, UID, focus areas, PGP key, social links.
- `6.6 404 (/404)`: UNIX terminal crash box: `cat: requested-page.md: No such file or directory`, resolution paths `[Home]`, `[Search]`.
