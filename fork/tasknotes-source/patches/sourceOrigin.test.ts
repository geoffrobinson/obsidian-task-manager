import type { TFile } from "obsidian";
import type TaskNotesPlugin from "../../../src/main";
import type { TaskInfo } from "../../../src/types";
import {
	getSourceDisplayName,
	getTaskSourceOrigin,
	hydrateTaskSourceOrigin,
	openTaskSourceOrigin,
} from "../../../src/utils/sourceOrigin";

function createTask(overrides: Partial<TaskInfo> = {}): TaskInfo {
	return {
		title: "Converted task",
		status: "open",
		priority: "normal",
		path: "Tasks/Converted task.md",
		archived: false,
		...overrides,
	};
}

describe("sourceOrigin", () => {
	it("reads source origin from TaskInfo fields", () => {
		const origin = getTaskSourceOrigin(
			createTask({
				sourceNote: "Notes/Origin.md",
				sourceLine: 12,
			})
		);

		expect(origin).toEqual({ source: "Notes/Origin.md", line: 12 });
	});

	it("reads source origin from customProperties frontmatter keys", () => {
		const origin = getTaskSourceOrigin(
			createTask({
				customProperties: {
					source: "Daily/2026-09-20.md",
					source_line: "4",
				},
			})
		);

		expect(origin).toEqual({ source: "Daily/2026-09-20.md", line: 4 });
	});

	it("hydrates TaskInfo from frontmatter props", () => {
		const hydrated = hydrateTaskSourceOrigin(createTask(), {
			source: "Inbox/Note.md",
			source_line: 7,
		});

		expect(hydrated.sourceNote).toBe("Inbox/Note.md");
		expect(hydrated.sourceLine).toBe(7);
		expect(hydrated.customProperties?.source).toBe("Inbox/Note.md");
		expect(hydrated.customProperties?.source_line).toBe(7);
	});

	it("formats display names from paths and wikilinks", () => {
		expect(getSourceDisplayName("Notes/Deep/Origin Note.md")).toBe("Origin Note");
		expect(getSourceDisplayName("[[Daily/Today|Today]]")).toBe("Today");
	});

	it("opens the source note at the live wikilink line", async () => {
		const sourceFile = { path: "Notes/Origin.md", extension: "md" } as TFile;
		const openFile = jest.fn().mockResolvedValue(undefined);
		const getLeaf = jest.fn(() => ({ openFile }));
		const plugin = {
			app: {
				vault: {
					getAbstractFileByPath: jest.fn((path: string) =>
						path === "Notes/Origin.md" ? sourceFile : null
					),
					read: jest.fn().mockResolvedValue(
						["Intro", "- [ ] something", "- [[Converted task]] keep working"].join("\n")
					),
				},
				metadataCache: {
					getFirstLinkpathDest: jest.fn(() => null),
				},
				workspace: {
					getLeaf,
				},
			},
		} as unknown as TaskNotesPlugin;

		const opened = await openTaskSourceOrigin(
			plugin,
			createTask({
				sourceNote: "Notes/Origin.md",
				sourceLine: 0,
			})
		);

		expect(opened).toBe(true);
		expect(getLeaf).toHaveBeenCalledWith(false);
		expect(openFile).toHaveBeenCalledWith(sourceFile, { eState: { line: 2 } });
	});
});
