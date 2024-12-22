import { syntaxTree } from "@codemirror/language";
import { EditorState, Prec } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { localization } from "localization";
import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from "obsidian";

interface VimModeEscPluginSettings {
	"hotkey": string;
}

const DEFAULT_SETTINGS: VimModeEscPluginSettings = {
	"hotkey": "Esc"
};

export default class VimModeEscPlugin extends Plugin {
	settings: VimModeEscPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerEditorExtension(
			Prec.highest(
				keymap.of([
					{
						key: "Esc",
						run: (): boolean => {
							this.log("Esc key event triggered");

							const view = this.app.workspace.getActiveViewOfType(MarkdownView);
							if (!view) {
								this.log("Failed to execute: Cannot get editor view");
								return false;
							}

							const editor = view.editor;

							editor.replaceSelection("EscEsc");
							this.log("Esc inserted");
						},
						preventDefault: false, // always preventDefault?
					},
				])
			)
		);
	}

	log = (msg: string) => {
		if (this.settings.developerMode) console.log("[restore esc] " + msg);
	};

	createKeymapRunCallback() {
		return (view: EditorView): boolean => {
			return true;
		};
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SettingTab extends PluginSettingTab {
	plugin: VimModeEscPlugin;

	constructor(app: App, plugin: VimModeEscPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('This does nothing')
			.addText(text => text
				.setPlaceholder('Esc')
				.setValue(this.plugin.settings.hotkey)
				.onChange(async (value) => {
					
				}));
	}
}
