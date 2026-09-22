# TaskNotes — Source Origin build (v4.13.4-source.1)

Personal build of [TaskNotes](https://github.com/callumalpass/tasknotes) **4.13.4**.

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

Pending card click timers are cancelled when interacting with the Source pill so the edit modal does not race the source open.

## Install

Copy over your existing folder (keeps your `data.json` settings):

`Vault/.obsidian/plugins/tasknotes/`

- `main.js` *(replace)*
- `manifest.json` *(replace)*
- `styles.css` *(replace)*

Do **not** replace `data.json` — keep your vault settings.

## Verify

1. Convert a checklist item → task.
2. Confirm frontmatter has `source` / `source_line`.
3. In Task View: **Alt+Click** the card, or click the **Source:** pill, or run the command.
