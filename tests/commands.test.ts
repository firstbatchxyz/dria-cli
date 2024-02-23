import cmdFetch from "../src/commands/fetch";
import cmdClear from "../src/commands/clear";
import constants from "../src/constants";
import { existsSync } from "node:fs";
import cmdServe from "../src/commands/serve";
import { driaClient } from "./common";
import cmdStop from "../src/commands/stop";
import { checkDocker, checkNetwork, sleep } from "../src/common";
import cmdPull from "../src/commands/pull";

describe("commands", () => {
  beforeAll(async () => {
    await checkDocker();
    await checkNetwork();
  });

  describe("fetch", () => {
    // a small knowledge zip on Arweave
    const txid = "3yUzQ8vnLeFUz_T2mhMoAQFZhJtQYG5o6FfeRRbLm-E";
    // the corresponding contract ID from the zip at that txID
    const contractId = "WbcY2a-KfDpk7fsgumUtLC2bu4NQcVzNlXWi13fPMlU";
    // metadata type of this knowledge
    type MetadataType = { id: string; page: string; text: string };

    beforeAll(async () => {
      await cmdClear(contractId);
    });

    afterAll(async () => {
      await cmdClear(contractId);
    });

    it("should fetch", async () => {
      expect(existsSync(`${constants.DRIA.DATA}/${contractId}`)).toBe(false);
      await cmdFetch(txid);
      await sleep(2000);
      expect(existsSync(`${constants.DRIA.DATA}/${contractId}`)).toBe(true);
    });

    it("should serve", async () => {
      expect(await driaClient.health()).toBe(false);
      await cmdServe(contractId);
      await sleep(2000);
      expect(await driaClient.health()).toBe(true);

      const fetched = await driaClient.fetchIds<MetadataType>([0]);
      expect(fetched.length).toBe(1);
      expect(typeof fetched[0].id).toBe("string");
      expect(typeof fetched[0].page).toBe("string");
      expect(typeof fetched[0].text).toBe("string");
    });

    it("should stop", async () => {
      await cmdStop();
      await sleep(2000);
      expect(await driaClient.health()).toBe(false);
    });
  });

  describe("pull", () => {
    // a small knowledge about TypeScript (272 entries)
    const contractId = "-B64DjhUtCwBdXSpsRytlRQCu-bie-vSTvTIT8Ap3g0";
    // metadata type of this knowledge
    type MetadataType = { id: string; page: string; text: string };

    beforeAll(async () => {
      await cmdClear(contractId);
    });

    afterAll(async () => {
      await cmdClear(contractId);
    });

    it("should pull", async () => {
      expect(existsSync(`${constants.DRIA.DATA}/${contractId}`)).toBe(false);
      await cmdPull(contractId);
      await sleep(2000);
      expect(existsSync(`${constants.DRIA.DATA}/${contractId}`)).toBe(true);
    });

    it("should serve", async () => {
      expect(await driaClient.health()).toBe(false);
      await cmdServe(contractId);
      await sleep(2000);
      expect(await driaClient.health()).toBe(true);

      const fetched = await driaClient.fetchIds<MetadataType>([0]);
      expect(fetched.length).toBe(1);
      expect(typeof fetched[0].id).toBe("string");
      expect(typeof fetched[0].page).toBe("string");
      expect(typeof fetched[0].text).toBe("string");
    });

    it("should stop", async () => {
      await cmdStop();
      await sleep(2000);
      expect(await driaClient.health()).toBe(false);
    });
  });
});
