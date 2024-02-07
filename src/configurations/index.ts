import constants from "../constants";
import { existsSync, readFileSync, writeFileSync } from "fs";

export type DriaCLIConfig = {
  /** Defualt Contract ID to fall-back if none is provided. */
  contract?: string;
  /** Defualt absolute path to wallet. */
  wallet?: string;
  /** Log-level is `info` by default, but becomes `debug` when verbose. */
  verbose: boolean;
};

const defaultConfig: DriaCLIConfig = {
  contract: undefined,
  wallet: undefined,
  verbose: false,
};

export function getConfig(): DriaCLIConfig {
  const path = constants.DRIA_PATH + ".driarc.json";
  if (existsSync(path)) {
    const config = JSON.parse(readFileSync(path, "utf-8")) as DriaCLIConfig;
    return config;
  } else {
    writeFileSync(path, JSON.stringify(defaultConfig));
    return defaultConfig;
  }
}
