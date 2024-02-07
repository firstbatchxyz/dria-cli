#!/usr/bin/env node

import { resolve } from "path";
import commands from "./commands/";
import { checkDocker, checkNetwork, logger } from "./common";
import { getConfig } from "./configurations";

const command: string = "pull";

async function main() {
  // pre-requisites
  const cfg = getConfig();
  if (cfg.verbose) {
    logger.setLevel("DEBUG");
  } else {
    logger.setLevel("INFO");
  }
  await checkDocker();
  await checkNetwork();

  //  TODO: or override with command-line
  const wallet = cfg.wallet ?? resolve("./wallet.json");
  const contract = cfg.contract ?? "WbcY2a-KfDpk7fsgumUtLC2bu4NQcVzNlXWi13fPMlU";

  switch (command) {
    case "pull": {
      await commands.pull(wallet, contract);
      break;
    }
    case "serve": {
      await commands.serve(contract);
      break;
    }
    case "stop": {
      await commands.stop();
      break;
    }
    case "config": {
      await commands.config();
      break;
    }
    case "clear": {
      await commands.clear(contract);
      break;
    }
    default:
      console.error("Unknown command:", command);
      break;
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
