# TaskNotes — Source Origin build (v4.13.2-source.1)

Personal build of [TaskNotes](https://github.com/callumalpass/tasknotes) **4.13.2** that stores the originating note on convert and opens it from Task View.

## What changed

On checklist → task conversion (inline convert), tasks get:

```yaml
source: path/to/Original Note.md
source_line: 12
```

Task cards show a **Source:** pill. Clicking it:

- Does **not** open the edit modal (`stopPropagation`)
- Opens the source note at the line containing `[[This Task]]` (falls back to stored `source_line`)

## Install (replace your current TaskNotes)

Use the **same** plugin folder so your `data.json` settings are kept.

1. Quit Obsidian (or disable Community plugins briefly).
2. Copy these files over your existing install:

   `Vault/.obsidian/plugins/tasknotes/`

   - `main.js` (replace)
   - `manifest.json` (replace)
   - `styles.css` (replace)

3. Re-enable TaskNotes / restart Obsidian.

Existing converted tasks without `source` / `source_line` will not show a Source pill until re-converted (or you add those fields manually).

## Verify

1. In a normal note, convert a checklist item to a TaskNotes task.
2. Open the new task note — frontmatter should include `source` and `source_line`.
3. In Task View / Bases Task cards, click **Source: …** — the original note should open at the task wikilink line.

## Source patches

`patches/` contains the TaskNotes source diff and the new `sourceOrigin` helper/tests for reproducibility.
