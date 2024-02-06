#!/usr/bin/env node

import { cmdPull } from "./commands/pull";
import { resolve } from "path";
import { checkNetwork, containerWithName, docker, imageExists } from "./common";
import constants from "./constants";

const command: string = "pull22";

async function main() {
  // TODO: check if exists, if not; create
  console.log(
    await docker.listNetworks({
      id: [constants.NETWORK.NAME],
    }),
  );
  // await checkNetwork();
  if (command === "pull") {
    const contractId = "WbcY2a-KfDpk7fsgumUtLC2bu4NQcVzNlXWi13fPMlU";
    const absWalletPath = resolve("./wallet.json");
    await cmdPull(absWalletPath, contractId);
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
