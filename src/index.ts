#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import commands from "./commands/";
import { checkDocker, checkNetwork, logger } from "./common";

import { getConfig, setConfig } from "./configurations";
import { resolve } from "path";
import { existsSync, mkdirSync } from "fs";
import constants from "./constants";
const config = getConfig();

const contractIdArg = {
  id: "contract" as const,
  opts: {
    alias: "c",
    describe: "Contract ID",
    type: "string",
    default: config.contract,
    coerce: (contractId: string) => {
      const path = `${constants.DRIA.DATA}/${contractId}`;
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
      return contractId;
    },
  } as const,
} as const;

const walletArg = {
  id: "wallet" as const,
  opts: {
    alias: "w",
    describe: "Path to an Arweave wallet",
    string: true,
    default: config.wallet,
    // map a given path to absolute so that Docker can use it
    coerce: (path: string) => {
      path = resolve(path);
      if (!existsSync(path)) {
        throw new Error("No wallet found at: " + path);
      }
      return path;
    },
  } as const,
} as const;

const verboseArg = {
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

const txIdArg = {
  id: "txid" as const,
  opts: {
    describe: "Transaction ID",
    type: "string",
    demandOption: true,
  } as const,
} as const;

async function checkArgs(
  args: { wallet?: string; contract?: string },
  checks: { wallet?: boolean; contract?: boolean; docker?: boolean },
) {
  if (checks.wallet) {
    if (args.wallet === undefined) throw new Error("No wallet provided.");
    if (!existsSync(args.wallet)) throw new Error("No wallet exists at: " + args.wallet);
  }

  if (checks.contract) {
    if (args.contract === undefined) throw new Error("Contract not provided.");
  }

  if (checks.docker) {
    await checkDocker();
    await checkNetwork();
  }

  return true;
}

yargs(hideBin(process.argv))
  .scriptName("dria")
  .option(verboseArg.id, verboseArg.opts)

  .command(
    "pull [contract]",
    "Pull a knowledge to your local machine.",
    (yargs) =>
      yargs
        .option(walletArg.id, walletArg.opts)
        .positional(contractIdArg.id, contractIdArg.opts)
        .check(async (args) => {
          return await checkArgs(args, { wallet: true, contract: true, docker: true });
        }),
    async (args) => {
      await commands.pull(args.wallet!, args.contract!);
    },
  )

  .command(
    "serve [contract]",
    "Serve a local knowledge.",
    (yargs) =>
      yargs.positional(contractIdArg.id, contractIdArg.opts).check(async (args) => {
        return await checkArgs(args, { contract: true, docker: true });
      }),
    async (args) => {
      await commands.serve(args.contract!);
    },
  )

  .command(
    "clear [contract]",
    "Clear local knowledge.",
    (yargs) =>
      yargs.positional(contractIdArg.id, contractIdArg.opts).check(async (args) => {
        return await checkArgs(args, { contract: true });
      }),
    async (args) => {
      await commands.clear(args.contract!);
    },
  )

  .command(
    "fetch <txid>",
    "Fetch an existing index at the given URL directly.",
    (yargs) => yargs.positional(txIdArg.id, txIdArg.opts),
    async (args) => {
      await commands.fetch(args.txid!);
    },
  )

  .command(
    "set-contract <contract>",
    "Set default contract.",
    (yargs) => yargs.option(contractIdArg.id, { ...contractIdArg.opts, demandOption: true }),
    (args) => {
      setConfig({
        contract: args.contract,
      });
    },
  )

  .command(
    "set-wallet <wallet>",
    "Set default wallet.",
    (yargs) => yargs.option(walletArg.id, { ...walletArg.opts, demandOption: true }),
    (args) => {
      setConfig({
        wallet: args.wallet,
      });
    },
  )

  .command(
    "config",
    "Show default configurations.",
    (yargs) => yargs,
    () => {
      const cfg = getConfig();
      logger.info("Wallet:   ", cfg.wallet ?? "not set.");
      logger.info("Contract: ", cfg.contract ?? "not set.");
    },
  )

  .command(
    "list",
    "List all local knowledge.",
    (yargs) => yargs,
    () => {
      commands.list();
    },
  )

  .command(
    "stop",
    "Stop serving knowledge.",
    (yargs) => yargs,
    async () => {
      await commands.stop();
    },
  )

  .demandCommand(1)
  .parse();
