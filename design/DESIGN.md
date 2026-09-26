# DESIGN.md — Blogly (default theme)

> This file defines **two separate UI languages**, not one:
> - **§1 — TUI mode**, used *only* by the Blogly signature theme (this
>   file). Every button, toggle, panel, and nav element in the entire
>   product — not just Settings — is styled as a terminal-UI widget when
>   this theme is active.
> - **§1B — Standard mode**, used by *every* community theme
>   (`DESIGN-catppuccin.md`, `-gruvbox.md`, `-solarized.md`,
>   `-tokyo-night.md`, `-nord.md`, `-dracula.md`). These themes deliberately
>   do NOT inherit the TUI widgets — they use conventional, familiar modern
>   UI components, just recolored/refonted per theme. This split is
>   intentional: the TUI look is Blogly's own brand signature; switching to
>   a community theme should feel like switching to a normal, comfortable
>   app, not "the same terminal but different colors."
>
> §2 defines the Blogly theme's specific palette/font, paired with §1.

## 1. TUI mode (Blogly theme only)

Modeled on real terminal UI applications (`k9s`, `lazygit`, `btop`,
`gitui`, `tmux`/`vim` statuslines) — but tuned for a general, non-technical
audience, so every TUI-style control still needs a plain-language label
and normal click/tap behavior. "Feels like a terminal" describes the
visual language, not the required literacy to use it.

- **Sharp corners, always.** `border-radius: 0` everywhere except the two
  named exceptions below. No box-shadows — elevation is a background-color
  step plus a 1px border, nothing else.
- **Titled panel borders** — every major panel has its section name
  embedded in its top border:
  ```
  ┌─ Settings ──────────────────────────┐
  │  ...panel content...                 │
  └──────────────────────────────────────┘
  ```
  Built as a bordered `<div>` with the title as a background-colored label
  sitting on the border line (CSS, not literal rendered Unicode box-drawing
  characters as body text — keeps borders accessible and unaffected by
  text selection/zoom).
- **Toggle switches = bracketed Y/N, not a sliding pill.** A compact
  two-state control reading `[ Y ]` (filled in `accent`, dark text) when
  on, `[ N ]` (outlined only, muted text) when off. Whole control is one
  click/tap target — never requires reading the letter to know the state,
  since fill vs. outline already communicates it at a glance; the letter
  is there for people who want to double-check, not the sole indicator of
  state (color alone is never the only signal, keeping it accessible).
  Full keyboard support: `Space`/`Enter` flips it, visible focus ring.
- **Checkboxes/single-select as bracket glyphs**: `[x]` / `[ ]` for
  multi-select, `(•)` / `( )` for single-select, monospace-aligned.
- **Buttons carry their keyboard shortcut inline**, bracketed:
  `[ Save  ^S ]`, `[ Preview  ^P ]` — still normal clickable buttons, the
  shortcut is a label, not a requirement to use them.
- **Inputs styled as a terminal prompt line**: `[ email@example.com_ ]`,
  cursor-style blinking caret at the end when focused/empty.
- **A persistent status bar**, fixed to the bottom, always visible:
  current context on the left (`FILE UPLOAD` / `SETTINGS`), available
  shortcuts on the right — e.g. `^S Save   ^P Preview   ^K Command Palette`.
  Real, working shortcuts, not decoration.
- **Tabs styled like terminal-multiplexer tabs**: `[1 File Upload]
  [2 Settings]`, active tab shown via inverted foreground/background.
- **List/menu selection = inverted colors** (foreground/background swap)
  on hover/focus, matching classic terminal selection behavior. Form
  controls (inputs, buttons) still get a standard 2px accent focus ring —
  inversion is for list-style rows specifically, not a replacement for
  accessible focus indication.
- **Blinking block cursor** (`█`) as the universal loading/busy indicator
  — file conversion, Codespace provisioning, save/push in progress. Never
  a spinner graphic.
- **Prompt-style metadata prefixes**: `$ 3 posts · 2 series`,
  `> Converting document...`.
- **One accent color**, used sparingly: active tab, focus ring, the `[ Y ]`
  fill, links, the blinking cursor.

**Exceptions to sharp corners**: the `[ Y ]`/`[ N ]` toggle and the
theme/font picker's live-preview thumbnail get `border-radius: 3–4px` —
at 0px they read as harder-to-parse click targets at small sizes.

## 1B. Standard mode (every community theme)

Modeled on conventional, familiar modern app settings UI — the reference
point is an ordinary grouped-list settings panel (the kind found in a
typical browser extension or mobile app: grouped card sections, muted
small-caps section labels, a sliding pill toggle, a full-width rounded CTA
button). Nothing terminal-flavored appears here at all — no box-drawing
borders, no status bar, no bracket widgets, no inverted-selection, no
blinking cursor.

- **Rounded corners throughout** — cards, buttons, inputs, toggles all use
  a normal modern radius (8–12px for cards/buttons, fully rounded/pill
  shape for toggles and primary CTAs).
- **Toggle switches = a standard sliding pill**: rounded track, circular
  knob that slides right (filled, theme's accent color) when on, left
  (muted/outline track) when off, with a smooth slide transition. This is
  the ordinary switch component used almost everywhere outside terminal
  tooling — deliberately the opposite of the Blogly theme's `[ Y ]`/`[ N ]`
  control.
  A disabled toggle (a feature not available in this context) renders
  fully muted/desaturated with no color, matching how a greyed-out option
  reads in any standard settings screen.
- **Grouped list sections**: each settings group (Appearance, Features,
  Post Management, Deploy, Privacy, Advanced) is a bordered/subtly-
  elevated rounded card containing stacked rows, each row separated by a
  thin 1px divider — label on the left, control on the right. A small,
  muted, uppercase-tracking section label sits above each group.
- **Buttons**: solid-fill rounded buttons for primary actions, outline
  rounded buttons for secondary ones. No inline keyboard-shortcut labels
  baked into the button text (shortcuts, if shown at all, appear as a
  separate small hint, not part of the button itself).
- **Inputs**: standard rounded text fields with normal placeholder text,
  no prompt-line styling, no blinking caret treatment beyond the browser's
  own default cursor.
- **Navigation**: a normal tab bar or sidebar — rounded active-tab
  indicator or underline, not multiplexer-style bracket tabs.
- **Loading/busy state**: a conventional spinner or progress bar, never
  the block-cursor treatment.
- **Elevation**: a soft, very subtle shadow is acceptable here (unlike TUI
  mode, which never uses shadows) — modern UI conventionally uses gentle
  elevation to separate a card from its background.

Each community theme applies its own palette and font to this exact
structural language — nothing below §1B changes between them; only colors
and typography do.

## 2. Blogly theme — palette and font (pairs with §1, TUI mode)

**Font**: Monocraft, used everywhere — headings, UI, body, code — per the
earlier decision to keep one consistent font throughout the tool's own
branded surfaces.

### Dark (default)

| Token | Hex | Use |
|---|---|---|
| `read.bg-base` | `#070a14` | Page/app background |
| `read.bg-surface` | `#0d1224` | Panels, cards, code blocks |
| `read.bg-surface-raised` | `#131a33` | Hover state, active panel |
| `read.border` | `#232b4d` | Panel borders, dividers |
| `read.border-strong` | `#34406e` | Emphasized borders |
| `read.text-primary` | `#d7dbf0` | Body text, headings |
| `read.text-secondary` | `#8891bb` | Metadata, captions |
| `read.text-tertiary` | `#565f8c` | Disabled/placeholder |
| `read.accent` | `#4d8dff` | Links, active states, cursor, `[ Y ]` fill |
| `chrome.input-bg` | `#0d1224` | Form fields |
| `chrome.input-border-focus` | `#4d8dff` | Focused input |
| `chrome.hover-bg` | `#131a33` | Row/item hover |
| `chrome.danger` | `#f2555a` | Destructive actions |
| `chrome.success` | `#3ddc84` | Confirmations |

### Light

| Token | Hex | Use |
|---|---|---|
| `read.bg-base` | `#f6f7fb` | Page/app background |
| `read.bg-surface` | `#ffffff` | Panels, cards |
| `read.bg-surface-raised` | `#eceffa` | Hover state |
| `read.border` | `#d7dceb` | Panel borders |
| `read.border-strong` | `#b3bcdb` | Emphasized borders |
| `read.text-primary` | `#10142a` | Body text, headings |
| `read.text-secondary` | `#4b5170` | Metadata, captions |
| `read.text-tertiary` | `#767c9c` | Disabled/placeholder |
| `read.accent` | `#2955d9` | Links, active states (contrast-verified ≈5.8:1 on base) |
| `chrome.danger` | `#c0342f` | Destructive actions |
| `chrome.success` | `#1f9d5c` | Confirmations |

### Signature UI moments
- **Header/nav**: the wordmark renders as `blogly_` with a literal
  blinking-cursor underscore as its final character, in `accent`.
- **File Upload dropzone**: a titled panel (`┌─ Drop a file, or click to
  browse ─┐`) with a dashed `border-strong` while idle, solid `accent`
  border while a file is dragged over it.
- **Live preview frame**: its own titled panel (`┌─ Live Preview ─┐`) with
  a small `● LIVE` indicator in `chrome.success` pulsing gently while the
  preview is up to date.
