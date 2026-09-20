# TaskNotes — Source Origin build (v4.13.2-source.2)

Personal build of [TaskNotes](https://github.com/callumalpass/tasknotes) **4.13.2**.

## What changed

On checklist → task conversion, tasks get:

```yaml
source: path/to/Original Note.md
source_line: 12
```

### Opening the source note (no conflict with edit)

Single-click / double-click stay controlled by **Settings → TaskNotes → Task interaction**.

| Action | Opens source note |
| --- | --- |
| **Alt + Click** on a task card | Yes (when `source` is set) |
| **Alt + Middle-click** | Yes, in a new tab |
| **Source:** metadata pill | Yes |
| Right-click → **Open source note** | Yes |
| Command **Open current task source note** | Yes (bind any hotkey in Obsidian) |

This avoids the race where a Source-pill click sometimes also fired the card’s delayed single-click → edit modal.

## Install

Copy over your existing folder (keeps `data.json`):

`Vault/.obsidian/plugins/tasknotes/`

- `main.js`
- `manifest.json`
- `styles.css`

## Verify

1. Convert a checklist item → task.
2. Confirm frontmatter has `source` / `source_line`.
3. In Task View: **Alt+Click** the card, or click the **Source:** pill, or run the command.
