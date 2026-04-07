# Netherweave Cloth Policy

This policy documents why Netherweave Cloth is handled slightly differently from most AH items.

## Why this policy exists

Netherweave Cloth is traded at high volume and often shows temporary low outlier listings (for example, one or two very cheap stacks). Those outliers can distort profitability calculations if treated as a stable market price.

The goal is to avoid being misled by short-lived low listings while still allowing manual scenario testing.

## Current behavior in the app

- Default cloth input starts at **0.15g (15s)**.
- Cloth can still be edited manually at any time.
- Cloth can be locked/unlocked like other inputs.
- Cloth is **exempt from staleness-dot tracking**:
  - no staleness dot is shown for cloth itself,
  - cloth is excluded when computing row-level worst staleness.

## Practical workflow intent

- Use cloth as a manually controlled “real cost” input based on what you actually paid (or realistically expect to pay in bulk), not just the latest temporary listing.
- Continue using staleness dots heavily for other AH-driven items where import freshness is more representative.

## Operator note

- Before making final crafting decisions, manually set Netherweave Cloth to the realistic acquisition price you actually paid (or expect to pay in volume).
- Treat the 15s default as a baseline sanity value, not a hard market truth.

## What this affects

- Visual staleness indicators for rows that include cloth.
- Baseline profitability when cloth remains near the 15s default (or user-set value).

## What this does NOT affect

- Core craft math formulas (the same formulas apply; cloth still enters as a normal numeric ingredient cost).
- Ability to test alternate cloth prices manually.
- Import behavior for non-cloth items.

## If policy changes later

If you choose to remove or change this policy in the future, update:

- `DECISIONS.md` (assumptions and staleness behavior),
- `README.md` (high-level behavior summary),
- this file.

