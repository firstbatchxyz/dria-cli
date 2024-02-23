import { dirname } from "path";
import constants from "../constants";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

export type DriaCLIConfig = {
  /** Default Contract ID to fall-back if none is provided. */
  contract?: string;
};

const defaultConfig: DriaCLIConfig = {
  contract: undefined,
};

const CONFIG_PATH = constants.DRIA.CONFIG;

/**
 * Returns the active Dria configurations.
 *
 * If no existing config is found, writes the default configuration to the config destination and returns it.
 *
 * @returns Dria configuration
 */
export function getConfig(): DriaCLIConfig {
  if (existsSync(CONFIG_PATH)) {
    const config = JSON.parse(readFileSync(CONFIG_PATH, "utf-8")) as DriaCLIConfig;
    return config;
  } else {
    mkdirSync(dirname(CONFIG_PATH), { recursive: true });
    writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig));
    return defaultConfig;
  }
}

/** Updates the Dria configuration. */
export function setConfig(args: DriaCLIConfig) {
  const cfg = getConfig();

  if (args.contract) cfg.contract = args.contract;

  writeFileSync(CONFIG_PATH, JSON.stringify(cfg));
}
