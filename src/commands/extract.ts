import { extractZip } from "../common";
import constants from "../constants";

/**
 * Extracts a zipped knowledge.
 *
 * This command is used in particular when you have a large knowledge and you would like to
 * move it around locally, without downloading the entire thing again.
 *
 * @param path Arweave txID to download
 */
export default async function cmdExtract(path: string) {
  const outDir = constants.DRIA.DATA;
  await extractZip(path, outDir);
}
