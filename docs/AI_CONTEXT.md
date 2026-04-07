# AI / LLM context (project intent)

This file exists to keep “why we did it this way” context available when using AI tools (Cursor, Claude, etc.).

## Primary goals

- **Fast iteration**: a single-file app (`index.html`) that can be edited and shipped quickly to GitHub Pages.
- **Practical decision support**: show *profit*, *margin*, and *craft-vs-buy* choices for TBC crafting.
- **Low-friction updates**: adding recipes should be mostly “append data, refresh UI”, not a full redesign.
- **Single-user focus**: optimize for the maintainer's setup (Edge browser, desktop layout), not broad cross-device compatibility.

## Non-goals (for now)

- A heavy build system, bundler, or framework migration unless it clearly reduces maintenance burden.
- Perfect type safety / compile-time guarantees (nice-to-have, not required for a simple Pages tool).

## Important invariants to preserve

- **Shared price sync** must remain reliable:
  - any item that appears across tabs should update everywhere via `ALL_NAME_TO_INPUTS` and `syncSharedPrice()`.
- **Global import** should update all matching inputs across all tabs (same item name → all input IDs).
- **LocalStorage persistence** should continue to work across reloads.
- **BOP items** should not be treated as gold costs; use “profit per BOP” style metrics.
- **Version policy** should stay consistent with `docs/VERSIONING.md` (stable, reversible release points).

## Common failure modes (watch for these)

- **New tab doesn’t share-sync**: usually because the tab’s `xxxNameToInput` wasn’t registered in `buildAllNameToInputs()`.
- **Item name mismatch** breaks syncing/import/staleness: `Primal shadow` vs `Primal Shadow` are different keys.
- **Table rebuild while typing**: avoid rebuilding a tbody if an input inside it is active (some tabs already guard against this).

## Preferred change style

- Prefer small, testable edits over sweeping rewrites.
- When changing behavior, update:
  - `README.md` (user-facing summary),
  - `DECISIONS.md` (design rationale + conventions),
  - `docs/ADDING_TABS_AND_RECIPES.md` if it affects extension steps.
- Treat docs as release-gated: no "stable" release without documentation updates for behavior/rationale changes.

