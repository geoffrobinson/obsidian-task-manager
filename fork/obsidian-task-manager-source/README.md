# Task Manager (Source Link) — personal fork

Personal build of [Obsidian Task Manager](https://github.com/antoneheyward/obsidian-task-manager) **v1.3.4** that stores and opens the originating note for checklist→task conversions.

> **License:** Upstream is all-rights-reserved. This fork is for **personal use** only. Do not redistribute without permission from the copyright holder.

## What it adds

When you convert a checklist item to a task (inline button, reading view, calendar drop, or Kanban drop), the new task file gets:

```yaml
source_note: path/to/Original Note.md
source_line: 12   # best-effort; wikilink search is preferred when opening
```

Task chips (calendar / unscheduled) and Kanban cards show a **Source:** link. Clicking it:

1. Does **not** open the edit modal (click is stopped from bubbling)
2. Opens the source note
3. Jumps to the line that contains `[[This Task]]` (works when one note spawned multiple tasks)

Clicking the rest of the chip still opens the edit modal.

## Install (manual)

1. Disable the official **Task Manager** plugin (or keep it disabled) to avoid ID conflicts — this fork uses id `obsidian-task-manager-source`.
2. Copy this folder into your vault:

   `Vault/.obsidian/plugins/obsidian-task-manager-source/`

   Files needed: `main.js`, `manifest.json`, `styles.css`
3. Enable **Task Manager (Source Link)** in Community plugins.

## Install (BRAT)

1. Publish this folder to a GitHub repo (or release) that includes `main.js`, `manifest.json`, and `styles.css` as release assets.
2. In BRAT → Add Beta plugin → paste that repo URL.
3. Enable the plugin.

## Notes

- Tasks created **before** installing this fork will not have `source_note` until you add it manually or re-convert.
- Opening prefers finding `[[task-basename]]` in the source file over the stored line number, so edits to the source note still land on the right wikilink.
