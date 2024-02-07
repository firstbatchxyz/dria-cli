#!/usr/bin/env node

import { cmdPull } from "./commands/pull";
import { checkDocker, checkNetwork } from "./common";
import { cmdServe } from "./commands/serve";
import { getConfig } from "./configurations";

const command: string = "pull";

async function main() {
  // pre-requisites
  const cfg = getConfig();
  await checkDocker();
  await checkNetwork();

  if (command === "pull") {
    await cmdPull(cfg.wallet, cfg.contract);
  } else if (command === "serve") {
    await cmdServe(cfg.contract);
  }
}

// curl --fail --output /dev/null --silent --data '{"route": "STATE"}' http://localhost:3000
main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
