import { rmSync } from "fs";
import { logger } from "../common";
import constants from "../constants";
import { access } from "fs";

/**
 * Deletes the pulled data for a given contract.
 *
 * @param contractId contract ID
 */
export default async function cmdClear(contractId: string) {
  const dir = `${constants.DRIA.DATA}/${contractId}`;
  access(dir, (error) => {
    if (error) {
      if (error.code === "ENOENT") {
        logger.info("No data found for:", contractId);
      } else {
        logger.warn("Unexpected error:", error.message);
      }
    } else {
      logger.info("Removing data for contract:", contractId);
      rmSync(dir, { recursive: true });
    }
  });
}
