import { resolve } from "path";

export type DriaCLIConfig = {
  /** Contract ID. */
  contract: string;
  /** Absolute path to wallet. */
  wallet: string;
  /** Absolute path to data directory */
  data: string;
};

export function getConfig(): DriaCLIConfig {
  // check current directory

  // check home directory

  // TODO: implement

  return {
    contract: "WbcY2a-KfDpk7fsgumUtLC2bu4NQcVzNlXWi13fPMlU",
    wallet: resolve("./wallet.json"),
    data: resolve("./.dria"),
  };
}
