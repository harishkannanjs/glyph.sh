# TASKS.md — Current phase only: Phase 1 (Harden what exists)

> Per `ROADMAP.md`. Nothing from later phases belongs here yet. Each item
> is scoped to be one reviewable PR.

- [x] Add a test runner (Vitest fits an Astro/TS project cleanly) with a
  minimal config — no tests yet, just the harness wired to
  `bun run test`.
- [x] Add one smoke test: the homepage builds and renders at least one
  `PostCard`.
- [x] Add one smoke test: an individual post page
  (`Blogs/standalone/welcome-to-glyph.md`) renders via
  `BlogPostLayout` without throwing.
- [x] Add ESLint + a minimal Astro/TS-appropriate config, wired to
  `bun run lint`.
- [x] Add Prettier (or confirm ESLint's formatting rules are sufficient)
  wired to `bun run format`.
- [x] Add a new GitHub Actions workflow (`.github/workflows/ci.yml`,
  separate from `deploy.yml`) that runs on every pull request: install →
  `astro check` → lint → test. Do not modify `deploy.yml` in this task —
  deploy and verification are separate concerns.
- [ ] Confirm the new CI workflow actually fails on a deliberately broken
  PR (e.g. a syntax error pushed to a throwaway branch), then revert the
  deliberate breakage — this proves the gate works before relying on it
  for every phase after this one.
- [x] Document the four commands (`test`, `lint`, `format`, and the
  existing `astro check`) in `AGENTS.md`'s command table, replacing the
  current "no lint/test command exists" note.
