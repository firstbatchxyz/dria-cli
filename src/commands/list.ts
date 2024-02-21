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
    logger.info("No contracts found!");
  } else {
    for (const file of files) {
      const lastModified = statSync(`${constants.DRIA.DATA}/${file}`).mtime.toLocaleString();
      const name = file.split(".")[0];
      logger.info(`${name.padEnd(45)}(last modified: ${lastModified})`);
    }
  }
}
