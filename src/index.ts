#!/usr/bin/env node

import { cmdPull } from "./commands/pull";
import { resolve } from "path";
import { docker } from "./common";

async function main() {
  // await pullRedis(docker);
  // const rediscont = await runRedis(docker);
  // console.log(rediscont);
  const contractId = "WbcY2a-KfDpk7fsgumUtLC2bu4NQcVzNlXWi13fPMlU";
  const absWalletPath = resolve("./wallet.json");
  await cmdPull(absWalletPath, contractId);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
