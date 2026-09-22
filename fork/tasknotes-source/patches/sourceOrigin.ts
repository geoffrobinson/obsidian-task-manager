import { TFile } from "obsidian";
import type { TaskInfo } from "../types";
import type TaskNotesPlugin from "../main";

export const SOURCE_NOTE_FRONTMATTER_KEY = "source";
export const SOURCE_LINE_FRONTMATTER_KEY = "source_line";

export interface TaskSourceOrigin {
	/** Vault path preferred; may also be a wikilink/path string from frontmatter */
	source: string;
	/** 0-based line number in the source note when known */
	line?: number;
}

function asOptionalString(value: unknown): string | undefined {
	if (typeof value === "string" && value.trim()) {
		return value.trim();
	}
	return undefined;
}

function asOptionalLine(value: unknown): number | undefined {
	if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
		return Math.floor(value);
	}
	if (typeof value === "string" && value.trim() !== "") {
		const parsed = Number(value);
		if (Number.isFinite(parsed) && parsed >= 0) {
			return Math.floor(parsed);
		}
	}
	return undefined;
}

function isMarkdownFile(file: unknown): file is TFile {
	if (file instanceof TFile) {
		return true;
	}
	// Duck-type for tests / cross-realm instances where instanceof TFile fails
	if (!file || typeof file !== "object") {
		return false;
	}
	const candidate = file as { path?: unknown; extension?: unknown; children?: unknown };
	if (typeof candidate.path !== "string") {
		return false;
	}
	// TFolder has a children array; markdown files do not.
	if (Array.isArray(candidate.children)) {
		return false;
	}
	if (typeof candidate.extension === "string") {
		return true;
	}
	return candidate.path.toLowerCase().endsWith(".md");
}

/**
 * Read source origin from TaskInfo fields and/or customProperties / raw frontmatter bag.
 */
export function getTaskSourceOrigin(task: TaskInfo): TaskSourceOrigin | null {
	const custom = task.customProperties || {};
	const source =
		asOptionalString(task.sourceNote) ||
		asOptionalString(custom[SOURCE_NOTE_FRONTMATTER_KEY]) ||
		asOptionalString(custom.source_note);

	if (!source) {
		return null;
	}

	const line =
		asOptionalLine(task.sourceLine) ||
		asOptionalLine(custom[SOURCE_LINE_FRONTMATTER_KEY]) ||
		asOptionalLine(custom.sourceLine);

	return { source, line };
}

/**
 * Attach source origin onto a TaskInfo from a frontmatter/properties record.
 */
export function hydrateTaskSourceOrigin<T extends Partial<TaskInfo>>(
	task: T,
	props?: Record<string, unknown> | null
): T {
	if (!props) {
		return task;
	}

	const source =
		asOptionalString(props[SOURCE_NOTE_FRONTMATTER_KEY]) ||
		asOptionalString(props.source_note);
	const line =
		asOptionalLine(props[SOURCE_LINE_FRONTMATTER_KEY]) ||
		asOptionalLine(props.sourceLine);

	if (!source && line === undefined) {
		return task;
	}

	const customProperties = {
		...(task.customProperties || {}),
	};
	if (source) {
		customProperties[SOURCE_NOTE_FRONTMATTER_KEY] = source;
	}
	if (line !== undefined) {
		customProperties[SOURCE_LINE_FRONTMATTER_KEY] = line;
	}

	return {
		...task,
		sourceNote: source ?? task.sourceNote,
		sourceLine: line ?? task.sourceLine,
		customProperties:
			Object.keys(customProperties).length > 0 ? customProperties : task.customProperties,
	};
}

function stripWikilink(value: string): string {
	const match = value.match(/^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]$/);
	if (!match) {
		return value.replace(/\.md$/i, "").trim();
	}
	// Prefer alias for display when present; resolve still uses the path part via callers.
	const pathPart = match[1].replace(/\.md$/i, "").trim();
	return pathPart;
}

function resolveSourceFile(
	plugin: TaskNotesPlugin,
	source: string,
	fromPath: string
): TFile | null {
	const direct = plugin.app.vault.getAbstractFileByPath(source);
	if (isMarkdownFile(direct)) {
		return direct;
	}

	const cleaned = stripWikilink(source);
	const withExt = cleaned.endsWith(".md") ? cleaned : `${cleaned}.md`;
	const byPath = plugin.app.vault.getAbstractFileByPath(withExt);
	if (isMarkdownFile(byPath)) {
		return byPath;
	}

	const dest =
		plugin.app.metadataCache.getFirstLinkpathDest(cleaned, fromPath) ||
		plugin.app.metadataCache.getFirstLinkpathDest(source, fromPath);
	return isMarkdownFile(dest) ? dest : null;
}

async function findTaskWikilinkLine(
	plugin: TaskNotesPlugin,
	sourceFile: TFile,
	taskPath: string
): Promise<number | null> {
	const taskBase = taskPath.replace(/\.md$/i, "").split("/").pop();
	if (!taskBase) {
		return null;
	}

	const text = await plugin.app.vault.read(sourceFile);
	const lines = text.split("\n");
	const escaped = taskBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const re = new RegExp(`\\[\\[(?:[^\\]]*/)?${escaped}(?:\\|[^\\]]*)?\\]\\]`);

	for (let i = 0; i < lines.length; i++) {
		if (re.test(lines[i])) {
			return i;
		}
	}
	return null;
}

/**
 * Open the originating note for a converted task, preferring the live wikilink line.
 */
export async function openTaskSourceOrigin(
	plugin: TaskNotesPlugin,
	task: TaskInfo,
	options: { newLeaf?: boolean } = {}
): Promise<boolean> {
	const origin = getTaskSourceOrigin(task);
	if (!origin) {
		return false;
	}

	const file = resolveSourceFile(plugin, origin.source, task.path);
	if (!file) {
		return false;
	}

	let line = origin.line;
	const found = await findTaskWikilinkLine(plugin, file, task.path);
	if (found !== null) {
		line = found;
	}

	const leaf = options.newLeaf
		? plugin.app.workspace.getLeaf("tab")
		: plugin.app.workspace.getLeaf(false);

	await leaf.openFile(file, {
		eState: typeof line === "number" ? { line } : undefined,
	});
	return true;
}

export function getSourceDisplayName(source: string): string {
	const match = source.match(/^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]$/);
	if (match?.[2]?.trim()) {
		return match[2].trim();
	}
	const cleaned = stripWikilink(source);
	return cleaned.split("/").pop() || cleaned;
}
