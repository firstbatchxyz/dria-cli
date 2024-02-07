import { resolve } from "path";

export type DriaCLIConfig = {
  /** Contract ID. */
  contract: string;
  /** Absolute wallet path. */
  wallet: string;
};

export function getConfig(): DriaCLIConfig {
  // TODO: implement

  return {
    contract: "WbcY2a-KfDpk7fsgumUtLC2bu4NQcVzNlXWi13fPMlU",
    wallet: resolve("./wallet.json"),
  };
}
