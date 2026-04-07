# TODO / backlog

This is the active backlog for upcoming work.

## Next features (requested)

1. **Docs / UX polish (optional)**
   - Small **About / Help** section linking to import/export and toolbar actions (if desired in-app).

## Nice-to-have

- Add a small `About / Help` section linking to import/export docs.
- Optional export formats (CSV, JSON) if workflow benefits.

## Deferred — start only when explicitly requested

These stay on the backlog for visibility (e.g. when someone asks “what’s left?”) but **must not** be picked up unless you explicitly ask to work on them.

- **TSM addon ledger data — investigation (large scope)**
  - Investigate how TradeSkillMaster stores ledger-related data (formats, layout, whether anything is obfuscated or treated as opaque blobs).
  - Clarify what is realistic for local tooling vs. what is impractical or disallowed (WoW add-on / ToS expectations, no reverse-engineering “crack” framing).
  - Outcome goal: enough understanding to decide if a separate script or workflow could read or summarize ledger-style data for your own checks.
  - **Do not start this** until you give a clear go-ahead; when discussing backlog, this item should still be mentioned so it is not forgotten.

## Recently completed (moved from active backlog)

- Modular extraction completed (`src/core`, `src/tabs/*Logic.js`, `src/data`).
- Runtime parity checks completed via smoke checklist.
- Extension workflow/checklist docs added (`docs/EXTENSION_CHECKLIST.md`).
- Export contract documented (keep `1.0 ALL BAGS` separate even with Bags merged into Tailoring UI).
- **v2.2.0**: Recipe controls moved to center content header across calculator tabs.
- **v2.2.0**: Per-recipe craft amount + Reset in detail views; quantity-aware ingredient/cost/profit.
- **v2.2.0**: Manual prices snapshot helper; missing-default reminders (overview + detail).
- **v2.2.0**: Auctionator export compare (order-insensitive missing/extra/duplicate diff); Compare export next to Ingredients.
- **v2.2.0**: Leatherworking nested craft chains + export recursion for nested AH materials.
