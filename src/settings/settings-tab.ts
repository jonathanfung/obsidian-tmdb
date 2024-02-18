import { App, PluginSettingTab, Setting } from "obsidian";

import TmdbPlugin from "../main";

export class SampleSettingTab extends PluginSettingTab {
  plugin: TmdbPlugin;

  constructor(app: App, plugin: TmdbPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("API Key")
      .setDesc("TMDB API Key")
      .addText((text) =>
        text
          .setPlaceholder("Enter TMDB API key")
          .setValue(this.plugin.settings.tmdbApiKey)
          .onChange(async (value) => {
            this.plugin.settings.tmdbApiKey = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Movie poster location")
      .setDesc("Where should the plugin store the images for movie posters")
      .addText((text) => text.setPlaceholder("/attachments/movie_posters"));
  }
}
