import cmdFetch from "../src/commands/fetch";
import cmdClear from "../src/commands/clear";
import constants from "../src/constants";
import { existsSync } from "node:fs";
import cmdServe from "../src/commands/serve";
import { DriaClient } from "./common";
import cmdStop from "../src/commands/stop";

describe("commands", () => {
  const client = new DriaClient("http://localhost:8080");

  // a small knowledge zip on Arweave
  const txid = "3yUzQ8vnLeFUz_T2mhMoAQFZhJtQYG5o6FfeRRbLm-E";

  // the corresponding contract ID from the zip at that txID
  const contractId = "WbcY2a-KfDpk7fsgumUtLC2bu4NQcVzNlXWi13fPMlU";

  beforeAll(async () => {
    await cmdClear(contractId);
  });

  afterAll(async () => {
    await cmdClear(contractId);
  });

  it("should fetch", async () => {
    await cmdFetch(txid);
    expect(existsSync(`${constants.DRIA.DATA}/${contractId}`)).toBe(true);
  });

  it("should serve", async () => {
    await cmdServe(contractId);
    expect(await client.health()).toBe(true);
  });

  it("should stop", async () => {
    await cmdStop();
    expect(await client.health()).toBe(false);
  });
});
