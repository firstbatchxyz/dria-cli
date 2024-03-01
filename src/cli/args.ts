import { logger } from "../common";
import { getConfig } from "../configurations";

const config = getConfig();

/** ContractID parameter, as seen on every Dria knowledge. */
const contractId = {
  id: "contract" as const,
  opts: {
    alias: "c",
    describe: "Contract ID",
    type: "string",
    default: config.contract,
  } as const,
} as const;

/** Verbosity, will show extra information when enabled. */
const verbose = {
  id: "verbose" as const,
  opts: {
    alias: "v",
    describe: "Show extra information",
    boolean: true,
    default: false,
    coerce: (verbose: boolean) => {
      logger.setLevel(verbose ? "DEBUG" : "INFO");
      return verbose;
    },
  } as const,
} as const;

/** An Arweave txID, required for the `fetch` command. */
const txId = {
  id: "txid" as const,
  opts: {
    describe: "Transaction ID",
    type: "string",
    demandOption: true,
  } as const,
} as const;

/** A zip path, required for the `extract` command. */
const zipPath = {
  id: "zipPath" as const,
  opts: {
    describe: "Path to zip",
    type: "string",
    demandOption: true,
  } as const,
} as const;

export default {
  txId,
  zipPath,
  contractId,
  verbose,
} as const;
