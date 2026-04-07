# Legacy / archived files

This folder contains files that are **not part of the current runtime** but were kept for historical context.

## What is actually deployed today?

GitHub Pages serves the single-file app: **`index.html`** at repo root.

## Archived items

### `gear_builder.py`

- Appears to be an old **code-generation helper** that reads and rewrites a `main.html` template.
- The current repo does **not** contain `main.html`, and there is no pipeline wiring that runs this script.
- Kept here in case you want to reconstruct/understand earlier Claude-generated workflows.

### `old_main.html:Zone.Identifier`

- Windows/NTFS metadata artifact (commonly created when files are downloaded from the internet).
- Not used by the app.

If/when you’re confident you don’t need these for archeology, it’s safe to delete this folder.

