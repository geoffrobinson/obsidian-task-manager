# Task Manager — Source Link build (v1.4.0)

Patched from your installed **Task Manager v1.4.0** files.

## What changed

On checklist → task conversion (inline button, reading view, calendar drop, Kanban drop), tasks get:

```yaml
source_note: path/to/Original Note.md
source_line: 12
```

Calendar/unscheduled chips and Kanban cards show a **Source:** link. Clicking it:

- Does **not** open the edit modal (`stopPropagation`)
- Opens the source note at the line containing `[[This Task]]`

## Install (replace your current plugin)

Use the **same** plugin folder so your `data.json` settings are kept.

1. Quit Obsidian (or disable Community plugins briefly).
2. Disable / remove the separate `obsidian-task-manager-source` plugin if you installed the earlier fork.
3. Copy these files over your existing install:

   `Vault/.obsidian/plugins/obsidian-task-manager/`

   - `main.js` (replace)
   - `manifest.json` (replace)
   - `styles.css` (replace)
   - Keep your existing `data.json` (do **not** overwrite it)

4. Re-enable **Task Manager** and reload Obsidian.

## Verify

1. In a normal note: `- [ ] Source click test`
2. Convert it to a task
3. Open the new task file — confirm `source_note` is in frontmatter
4. In Calendar/Kanban, click **only** the blue Source link → source note opens at that line
5. Click the rest of the chip → edit modal still opens

## Notes

- Tasks created before this build won’t have `source_note` until you re-convert or add it manually.
- Plugin id stays `obsidian-task-manager` (drop-in, not a second plugin).
