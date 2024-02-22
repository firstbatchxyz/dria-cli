import { readFileSync, writeFileSync } from "fs";
import { getConfig, type DriaCLIConfig, setConfig } from "../src/configurations";
import constants from "../src/constants";

describe.skip("configurations", () => {
  let existingConfig: DriaCLIConfig;

  beforeAll(() => {
    existingConfig = JSON.parse(readFileSync(constants.DRIA.CONFIG, "utf-8"));
  });

  afterAll(() => {
    writeFileSync(constants.DRIA.CONFIG, JSON.stringify(existingConfig));
  });

  it("should get config", () => {
    const cfg = getConfig();
    expect(cfg.contract).toBe(existingConfig.contract);
  });

  it("should update config", () => {
    const newContract = "test-contract";
    setConfig({ contract: newContract });

    const cfg = getConfig();
    expect(cfg.contract).toBe(newContract);
  });
});
