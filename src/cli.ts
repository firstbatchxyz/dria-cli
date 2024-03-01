import yargs from "yargs";
import commands from "./commands/";
import { checkDocker, checkNetwork, logger } from "./common";
import { getConfig, setConfig } from "./configurations";

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

async function checkArgs(args: { contract?: string }, checks: { contract?: boolean; docker?: boolean }) {
  if (checks.contract) {
    if (args.contract === undefined) throw new Error("Contract not provided.");
  }

  if (checks.docker) {
    await checkDocker();
    await checkNetwork();
  }

  return true;
}

/**
 * Use Dria CLI with arguments.
 * @param args command-line arguments
 * @example
 * import { hideBin } from "yargs/helpers";
 *
 * driaCLI(hideBin(process.argv));
 */
export function driaCLI(args: string[]) {
  yargs(args)
    .scriptName("dria")
    .option(verboseArg.id, verboseArg.opts)

    .command(
      "pull [contract]",
      "Pull a knowledge to your local machine.",
      (yargs) =>
        yargs.positional(contractIdArg.id, contractIdArg.opts).check(async (args) => {
          return await checkArgs(args, { contract: true, docker: true });
        }),
      async (args) => {
        await commands.pull(args.contract!);
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
      "Fetch an existing index on Arweave.",
      (yargs) => yargs.positional(txIdArg.id, txIdArg.opts),
      async (args) => {
        await commands.fetch(args.txid!);
      },
    )

    .command(
      "extract <zip-path>",
      "Extract a compressed knowledge.",
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
      "config",
      "Show default configurations.",
      (yargs) => yargs,
      () => {
        const cfg = getConfig();
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
}
