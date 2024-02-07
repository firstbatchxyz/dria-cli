#!/usr/bin/env node

import commands from "./commands/";
import { checkDocker, checkNetwork } from "./common";
import { getConfig } from "./configurations";

const command: string = "stop";

async function main() {
  // pre-requisites
  const cfg = getConfig();
  await checkDocker();
  await checkNetwork();

  switch (command) {
    case "pull": {
      await commands.pull(cfg.wallet, cfg.contract);
      break;
    }
    case "serve": {
      await commands.serve(cfg.contract);
      break;
    }
    case "stop": {
      await commands.stop();
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
