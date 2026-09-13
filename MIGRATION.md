# Content Publishing & Migration Guide

This guide explains how to publish and manage technical write-ups, multi-part series, and research notes in this Terminal Blog.

---

## 1. Directory Structure: `/Blogs`

The blog engine uses a root-level `/Blogs` directory organized into two dedicated folders:

```
Blogs/
├── series/
│   └── <name_of_the_series>/
│       ├── 01-first-part.md (or .mdx)
│       ├── 02-second-part.mdx
│       └── ...
└── standalone/
    ├── standalone-writeup-one.md (or .mdx)
    ├── standalone-writeup-two.mdx
    └── ...
```

---

## 2. Publishing a Series Write-up

To publish a multi-part series:
1. Create a subfolder inside `Blogs/series/` named after your series (e.g. `Blogs/series/windows-internals-exploitation/` or `Blogs/series/linux_rootkits/`).
2. Add your `.md` or `.mdx` files inside that series folder.
3. Prefix filenames with numbers to specify order (e.g. `01-anticheat-dr7-hooks.mdx`, `02-kernel-alpc-race.mdx`).

### Dynamic Resolution for Series:
- **Series Name**: Automatically inferred from the folder name (e.g. `windows-internals-exploitation` &rarr; `"Windows Internals Exploitation"`), unless explicitly specified via frontmatter `series: "..."`.
- **Write-up Title**: Automatically formatted from the filename (e.g. `01-anticheat-dr7-hooks.mdx` &rarr; `"Anticheat DR7 Hooks"`), unless explicitly specified via frontmatter `title: "..."`.
- **Series Part (`seriesPart`)**: Automatically extracted from the filename prefix (`01-`, `1-`, `part-1-`) or the alphabetical order in the folder.
- **Series Total (`seriesTotal`)**: Automatically calculated from the total number of write-ups in that series folder! When you add a new part (e.g. `03-hypervisor-break.mdx`), the total count automatically updates to 3 across the entire series with zero manual editing.

---

## 3. Publishing a Standalone Write-up

To publish an independent article or research note:
1. Place your `.md` or `.mdx` file directly inside `Blogs/standalone/` (e.g. `Blogs/standalone/coppelia-sim-rust.mdx`).

### Dynamic Resolution for Standalone:
- **Write-up Title**: Automatically formatted from the filename (e.g. `coppelia-sim-rust.mdx` &rarr; `"Coppelia Sim Rust"`), unless explicitly specified via frontmatter `title: "..."`.
- **Series Status**: Automatically marked as a standalone article (`series: undefined`).

---

## 4. Optional YAML Frontmatter

Frontmatter is **completely optional** thanks to the dynamic loader, but you can include it to provide exact descriptions, custom tags, publication dates, drafts, or changelogs:

```yaml
---
title: "Exploiting a double-fetch race condition in Windows Kernel ALPC"
description: "An in-depth root cause analysis of a subtle TOCTOU vulnerability in custom LPC message handling routines."
pubDate: 2026-02-18
tags: ["reverse-engineering", "windows-internals", "c"]
draft: false
updatedDate: 2026-02-22
changelog:
  - date: 2026-02-22
    summary: "Corrected the PTE offset calculation"
    diff: "- old_code();\n+ new_code();"
---
```

### Supported Frontmatter Fields:
| Field | Type | Description | Dynamic Default if Omitted |
|---|---|---|---|
| `title` | string | Full post title | Formatted from filename |
| `description` | string | Article description / summary | Generated from title |
| `pubDate` | Date | Publication date | File modification / creation date |
| `tags` | string[] | Array of tags | Series tag or `['research', 'security']` |
| `draft` | boolean | If `true`, strictly excluded from production | `false` |
| `updatedDate` | Date | Revision timestamp | Omitted |
| `changelog` | array | Revision diffs & notes | Omitted |

---

## 5. Interactive MDX Components

You can use all custom research components inside any `.mdx` write-up:

### `<Spoiler>`
```mdx
import Spoiler from '@/components/Spoiler.astro';

<Spoiler label="CTF Flag Payload">
`FLAG{alpc_pwn_r0_c0mpl3t3}`
</Spoiler>
```

### `<Mermaid>`
````mdx
import Mermaid from '@/components/Mermaid.astro';

<Mermaid code={`
flowchart LR
    Sensors["IR Sensor"] --> IPC["Shared Memory IPC"]
    IPC --> KF["Kalman Filter"]
`} />
````

### `<Asciinema>`
```mdx
import Asciinema from '@/components/Asciinema.astro';

<Asciinema src="/casts/kernel-race.cast" rows={24} cols={80} />
```

### `<Sidenote>`
```mdx
import Sidenote from '@/components/Sidenote.astro';

Text discussing ALPC ports.<Sidenote id="1">See `ntoskrnl!AlpcpSendMessage` for validation routines.</Sidenote>
```

---

## 6. Deployment to GitHub Pages (`github.io`)

1. **Commit your changes**:
   ```bash
   git add Blogs/
   git commit -m "feat: add new write-up"
   ```
2. **Push to GitHub**:
   ```bash
   git push origin main
   ```
3. GitHub Actions (`.github/workflows/deploy.yml`) will automatically run tests, build the static assets and search indices, and deploy directly to your `github.io` site.
