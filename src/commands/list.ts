import { existsSync, readdirSync, statSync } from "fs";
import { logger } from "../common";
import constants from "../constants";

/**
 * Lists the contract IDs currently pulled & interacted so far.
 * The interactions are stored locally within the history.
 */
export default function cmdList() {
  const files = existsSync(constants.DRIA.DATA)
    ? readdirSync(constants.DRIA.DATA) // .map((f) => f.slice(0, f.lastIndexOf(".")))
    : [];

  if (files.length === 0) {
    logger.info("  No contracts pulled yet!");
  } else {
    for (const file of files) {
      const lastModified = statSync(`${constants.DRIA.DATA}/${file}`).mtime.toLocaleString();
      logger.info(`${file.split(".")[0]}\t(last modified: ${lastModified})`);
    }
  }
  // logger.info(files.length ? files.map((v) => "  " + v).join("\n") : "  no contracts pulled yet!");
}
