import { dirname } from "path";
import constants from "../constants";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

export type DriaCLIConfig = {
  /** Defualt Contract ID to fall-back if none is provided. */
  contract?: string;
  /** Defualt absolute path to wallet. */
  wallet?: string;
};

const defaultConfig: DriaCLIConfig = {
  contract: undefined,
  wallet: undefined,
};

const CONFIG_PATH = constants.DRIA.CONFIG;

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

export function setConfig(args: DriaCLIConfig) {
  const cfg = getConfig();

  if (args.contract) cfg.contract = args.contract;
  if (args.wallet) cfg.wallet = args.wallet;

  writeFileSync(CONFIG_PATH, JSON.stringify(cfg));
}
