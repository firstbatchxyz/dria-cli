#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import commands from "./commands/";
import { checkDocker, checkNetwork, logger } from "./common";

import { getConfig } from "./configurations";
import { resolve } from "path";
const config = getConfig();

const contractIdArg = {
  id: "contract",
  opts: {
    describe: "Contract ID",
    type: "string",
    default: config.contract,
  },
} as const;

const walletArg = {
  id: "wallet",
  opts: {
    alias: "w",
    describe: "Path to a wallet.",
    string: true,
    default: config.wallet,
    // map a given path to absolute so that Docker can use it
    coerce: (path: string) => resolve(path),
  },
} as const;

const verboseArg = {
  id: "verbose",
  opts: {
    alias: "v",
    describe: "Verbosity.",
    boolean: true,
    default: config.verbose,
  },
};

yargs(hideBin(process.argv))
  .scriptName("dria")
  .option(verboseArg.id, verboseArg.opts)
  .command(
    "pull  [contract]",
    "Pull a Dria knowledge to your local machine.",
    (yargs) => yargs.option(walletArg.id, walletArg.opts).positional(contractIdArg.id, contractIdArg.opts),
    async (args) => {
      console.log(args);
    },
  )
  .command(
    "serve [contract]",
    "Serve a Dria knowledge.",
    (yargs) => yargs.positional(contractIdArg.id, contractIdArg.opts),
    async (args) => {
      console.log(args);
    },
  )
  .command(
    "clear [contract]",
    "Clear knowledge data locally.",
    (yargs) => yargs.positional(contractIdArg.id, contractIdArg.opts),
    async (args) => {
      console.log(args);
    },
  )
  .command(
    "config",
    "Print Dria config.",
    (yargs) => yargs,
    async (args) => {
      console.log(args);
    },
  )
  .command(
    "stop",
    "Stop serving Dria.",
    (yargs) => yargs,
    async (args) => {
      console.log(args);
    },
  )
  .demandCommand(1)
  .parse();
