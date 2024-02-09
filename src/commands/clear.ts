import { existsSync, rmSync } from "fs";
import { logger } from "../common";
import constants from "../constants";

/**
 * Deletes the pulled data for a given contract.
 *
 * @param contractId contract ID
 */
export default async function cmdClear(contractId: string) {
  const dir = `${constants.DRIA.DATA}/${contractId}`;
  logger.info("Removing data for contract:", contractId);
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true });
  } else {
    logger.debug("No data found.");
  }
}
