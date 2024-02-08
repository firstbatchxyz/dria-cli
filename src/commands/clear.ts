import { existsSync, rmSync } from "fs";
import { logger } from "../common";
import constants from "../constants";

/**
 * Deletes the pulled data for a given contract.
 *
 * @param contractId contract ID
 */
export default async function cmdClear(contractId: string) {
  const contractData = `${constants.DRIA.DATA}/${contractId}.rdb`;
  logger.info("Removing data for contract:", contractId);
  if (existsSync(contractData)) {
    rmSync(contractData);
  } else {
    logger.debug("No data found.");
  }
}
