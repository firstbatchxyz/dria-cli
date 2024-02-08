#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import commands from "./commands/";
import { checkDocker, checkNetwork, logger } from "./common";

import { getConfig, setConfig } from "./configurations";
import { resolve } from "path";
import { existsSync } from "fs";
const config = getConfig();

const contractIdArg = {
  id: "contract" as const,
  opts: {
    alias: "c",
    describe: "Contract ID",
    type: "string",
    default: config.contract,
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
    coerce: (path: string) => resolve(path),
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
    "pull  [contract]",
    "Pull a Dria knowledge to your local machine.",
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
    "Serve a local Dria knowledge.",
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
    "Clear local knowledge data.",
    (yargs) =>
      yargs.positional(contractIdArg.id, contractIdArg.opts).check(async (args) => {
        return await checkArgs(args, { contract: true });
      }),
    async (args) => {
      await commands.clear(args.contract!);
    },
  )

  .command(
    "config",
    "Print Dria config.",
    (yargs) => yargs,
    () => {
      const cfg = getConfig();
      logger.info("Wallet:   ", cfg.wallet ?? "not set.");
      logger.info("Contract: ", cfg.contract ?? "not set.");
    },
  )

  .command(
    "set",
    "Update Dria config.",
    (yargs) =>
      yargs
        .option(walletArg.id, walletArg.opts)
        .option(contractIdArg.id, contractIdArg.opts)
        .check((argv) => {
          if (argv.contract === undefined && argv.wallet === undefined) {
            throw new Error("At least one argument expected.");
          }
          return true;
        }),
    (args) => {
      setConfig(args);
    },
  )

  .command(
    "list",
    "List interacted contracts.",
    (yargs) => yargs,
    () => {
      commands.list();
    },
  )

  .command(
    "stop",
    "Stop serving Dria.",
    (yargs) => yargs,
    async () => {
      await commands.stop();
    },
  )

  .demandCommand(1)
  .parse();
