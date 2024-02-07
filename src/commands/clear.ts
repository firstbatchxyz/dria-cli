import { existsSync, rmSync } from "fs";
import { logger } from "../common";
import constants from "../constants";

export default async function cmdClear(contractId: string) {
  const contractData = `${constants.DRIA_PATH}/data/${contractId}.rdb`;
  logger.info("Removing data for contract:", contractId);
  if (existsSync(contractData)) {
    rmSync(contractData);
  } else {
    logger.debug("No data found.");
  }
}
