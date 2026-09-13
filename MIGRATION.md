# Content Migration Guide

This guide explains how to migrate existing technical write-ups, CTF solutions, and research notes into this Terminal Blog.

---

## 1. File Location & File Types

Place all post files in:
```
src/content/blog/
```

- Standard Markdown: `<slug>.md`
- Markdown with Interactive Components: `<slug>.mdx`

> [!NOTE]
> Any `.md` or `.mdx` dropped in `src/content/blog/` will automatically appear on the index, generate its own route at `/blog/<slug>`, appear on tag pages, be added to the sitemap and `feed.xml`, and be indexed by Pagefind during the build.

---

## 2. Required Frontmatter Schema

Every post must include the following YAML frontmatter at the top of the file:

```yaml
---
title: "Exploiting a Double-Fetch Race Condition in Windows Kernel ALPC"
description: "An in-depth root cause analysis of a TOCTOU race condition in LPC message routines."
pubDate: 2026-02-18
tags: ["reverse-engineering", "windows-internals", "c"]
---
```

### Required Fields
- `title` *(string)*: The full post title.
- `description` *(string)*: One-line summary used for post cards, SEO meta, and social preview cards.
- `pubDate` *(Date or YYYY-MM-DD)*: The publication date.
- `tags` *(array of strings, minimum 1)*: Categories or taxonomy tags (e.g. `["kernel", "x86-64"]`).

---

## 3. Optional Frontmatter Fields

```yaml
---
# All required fields above plus:
updatedDate: 2026-02-22          # Revision date
draft: false                      # Set to true to hide from listing, search, & RSS
heroImage: "/images/cover.png"    # Optional custom cover image
series: "Windows Internals"       # Series name (requires seriesPart & seriesTotal)
seriesPart: 2                     # Part number (1-based index)
seriesTotal: 4                    # Total number of parts in the series
changelog:                        # Powers the revision changelog popover
  - date: 2026-02-22
    summary: "Corrected PTE calculation"
    diff: "- old_code();\n+ new_code();"
---
```

### Series Grouping Rules
If a post is part of a multi-part series:
1. You **must** define all three fields: `series`, `seriesPart`, and `seriesTotal`.
2. If `series` is omitted, `seriesPart` and `seriesTotal` must also be omitted.
3. The build system will fail loudly with a validation error if this invariant is violated.

---

## 4. Using Custom MDX Components

For `.mdx` posts, the following components are globally available:

### 4.1 Spoiler / Concealed Payloads (`<Spoiler>`)
Used for CTF flags, exploit primitives, or solution spoilers:
```mdx
<Spoiler label="Privilege Escalation Token Swap" type="payload">
```c
*(PULONG_PTR)(target_eprocess + TOKEN_OFFSET) = system_token;
```
</Spoiler>
```

### 4.2 Mermaid Architecture Diagrams (`<Mermaid>`)
Used for state machines, memory layouts, and exploit chains:
```mdx
<Mermaid caption="ALPC TOCTOU Message Flow">
{`
sequenceDiagram
    autonumber
    Client->>Kernel: Send Buffer
    Kernel->>Kernel: Validation Pass
    Client->>Client: Flip Length in User Memory
    Kernel->>Server: Double Fetch OOB Copy
`}
</Mermaid>
```

### 4.3 Asciinema Terminal Sessions (`<Asciinema>`)
Drop `.cast` recording files in `public/recordings/` and embed:
```mdx
<Asciinema
  src="/recordings/dr7-hook-session.cast"
  title="Kernel WinDbg Session"
/>
```

### 4.4 Sidenotes / Margin Notes (`<Sidenote>`)
Renders in the outer margin on wide viewports (≥1400px), collapsing to inline footnotes on smaller displays:
```mdx
The race window was narrow.<Sidenote number="1">Measured at approximately 120ns on an i9-13900K.</Sidenote>
```

### 4.5 Math Equations (KaTeX)
Standard KaTeX notation is supported:
- Inline: `$E = mc^2$`
- Display: `$$\hat{\mathbf{x}}_{k|k-1} = \mathbf{F}_k \hat{\mathbf{x}}_{k-1|k-1} + \mathbf{B}_k u_k$$`

### 4.6 Diff Code Blocks
Use the `diff` language identifier in markdown code blocks:
````markdown
```diff
- Status = ProbeAndRead(UserMessage->Length);
+ Status = SafeCopyMessage(&SafeMessage, UserMessage);
```
````
Lines beginning with `+` are highlighted in terminal emerald green (`#3ddc84`), and lines beginning with `-` are highlighted in error red (`#f2555a`).
