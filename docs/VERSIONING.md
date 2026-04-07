# Versioning and release policy

This project uses a practical SemVer-style scheme:

- `MAJOR.MINOR.PATCH` (for example `2.3.4`)

## Meaning in this project

- **MAJOR** (`X.0.0`)
  - Large structural change, architecture overhaul, or major workflow change.
  - Can include reorganizing tabs, data flow, or persistence model.

- **MINOR** (`X.Y.0`)
  - Significant user-visible feature additions that do not break the app model.
  - Examples: new tab, major calculator mode, large UX feature.

- **PATCH** (`X.Y.Z`)
  - Smaller updates and maintenance.
  - Examples: new recipes, bug fixes, text/UI polish, minor behavior tuning.

## Era cutoff

- The pre-Cursor history remains in git as-is.
- New-era kickoff uses a pre-release checkpoint: **`2.0.0-prep.1`** (documentation/cleanup baseline before risky refactoring).
- The first stable overhaul release is **`2.0.0`**.
- This is a project-history cutoff only; commits should stay neutral (no "written by X tool" wording required).

## Stable release routine

When preparing a stable push:

1. Test locally (prefer local HTTP server in Edge for parity with Pages behavior).
2. Verify key flows:
   - import prices,
   - shared-price sync across tabs,
   - recalculation/profit tables,
   - export generation.
3. Update docs if behavior/assumptions changed.
4. Create a release commit with the version in message, for example:
   - `release: v2.2.0 - craft amount, export compare, defaults UX`
5. Create an annotated tag with the same version (`v2.2.0`).
6. Push commit and tag.

### Smoke test checklist

Use `docs/SMOKE_TEST_CHECKLIST.md` before stable pushes (patch or minor releases, for example `2.1.x`, `2.2.x`).

### Tagging rule (default)

Use annotated tags as release markers whenever it makes sense:

- Always tag stable releases (`MAJOR`, `MINOR`, and planned stable `PATCH` releases).
- Use the exact SemVer string as the tag name (for example `v2.0.0`).
- Keep pre-release checkpoints tagged too when they are intended rollback points (for example `v2.0.0-prep.1`).

### Docs update rule (follow this)

Documentation is part of the release criteria, not optional cleanup. Any behavior or workflow change should be reflected in docs in the same working cycle before release:

- `README.md` for user-facing behavior/notes,
- `DECISIONS.md` for rationale and conventions,
- relevant files in `docs/` for operational detail.

## Bump guidance examples

- Add one or more recipes only: `2.2.0` -> `2.2.1`
- Add a new feature (no architecture break): `2.2.1` -> `2.3.0`
- Perform major structural overhaul: `2.3.3` -> `3.0.0`

## New-era sequence (history)

1. Release current baseline as `v2.0.0-prep.1`.
2. Do refactor/overhaul work on top of that checkpoint.
3. When stable, release `v2.0.0`.
4. Refactor-completion milestone release: `v2.1.0` (runtime parity with modularized tabs/core/data layout).
5. Feature release: `v2.2.0` (centered recipe controls, detail craft amount + reset, missing-default reminders, manual snapshot export, Auctionator export compare, Leatherworking nested-chain export coverage).

