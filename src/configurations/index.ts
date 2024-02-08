import constants from "../constants";
import { existsSync, readFileSync, writeFileSync } from "fs";

export type DriaCLIConfig = {
  /** Defualt Contract ID to fall-back if none is provided. */
  contract?: string;
  /** Defualt absolute path to wallet. */
  wallet?: string;
  /** List of interacted contracts. */
  history: string[];
};

const defaultConfig: DriaCLIConfig = {
  contract: undefined,
  wallet: undefined,
  history: [],
};

const CONFIG_PATH = constants.DRIA.CONFIG;

export function getConfig(): DriaCLIConfig {
  if (existsSync(CONFIG_PATH)) {
    const config = JSON.parse(readFileSync(CONFIG_PATH, "utf-8")) as DriaCLIConfig;
    return config;
  } else {
    writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig));
    return defaultConfig;
  }
}

export function setConfig(args: Partial<Omit<DriaCLIConfig, "history">>) {
  const cfg = getConfig();

  if (args.contract) cfg.contract = args.contract;
  if (args.wallet) cfg.wallet = args.wallet;

  writeFileSync(CONFIG_PATH, JSON.stringify(cfg));
}
