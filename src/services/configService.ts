import { Config } from "../types/config";

export class ConfigService {
  private static STORAGE_KEY = "extensionConfig";

  static async loadConfig(): Promise<Config> {
    return new Promise((resolve) => {
      chrome.storage.sync.get([this.STORAGE_KEY], (result) => {
        if (result[this.STORAGE_KEY]) {
          const savedConfig = JSON.parse(result[this.STORAGE_KEY]);
          resolve(savedConfig);
        } else {
          resolve({
            mode: null,
            defaultProvider: "",
            providers: {}
          });
        }
      });
    });
  }

  static async saveConfig(config: Config): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set(
        {
          [this.STORAGE_KEY]: JSON.stringify(config)
        },
        () => {
          console.log("Configuration saved");
          resolve();
        }
      );
    });
  }

  static getDefaultConfig(): Config {
    return {
      mode: null,
      defaultProvider: "",
      providers: {}
    };
  }
}
