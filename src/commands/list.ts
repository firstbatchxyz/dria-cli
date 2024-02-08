import { existsSync, readdirSync } from "fs";
import { logger } from "../common";
import constants from "../constants";

/**
 * Lists the contract IDs currently pulled & interacted so far.
 * The interactions are stored locally within the history.
 */
export default function cmdList() {
  const files = existsSync(constants.DRIA.DATA)
    ? readdirSync(constants.DRIA.DATA).map((f) => f.slice(0, f.lastIndexOf(".")))
    : [];

  logger.info("Pulled contracts:");
  logger.info(files.length ? files.map((v) => "  " + v).join("\n") : "  no contracts pulled yet!");
}
