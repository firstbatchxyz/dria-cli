import axios from "axios";
import AdmZip from "adm-zip";
import constants from "../constants";
import { logger } from ".";

/** Download a zipped data from Arweave, unzip & extract it at a given path.
 *
 * @param txid txID on Arweave
 * @param outDir output directory for the extraction file
 */
export async function downloadAndUnzip(contractId: string, outDir: string) {
  const url = `${constants.ARWEAVE.DOWNLOAD_URL}/${contractId}`;

  logger.debug("Downloading...");
  const response = await axios.get<Buffer>(url, {
    timeout: constants.ARWEAVE.DOWNLOAD_TIMEOUT,
    responseType: "arraybuffer",
  });
  if (response.status !== 200) {
    throw new Error(`Arweave Download failed with ${response.status}`);
  }
  logger.debug(`${response.data.length} bytes downloaded.`);

  const zip = new AdmZip(response.data);
  zip.extractAllTo(outDir, true); // overwrite existing data at path
  logger.info("Knowledge extracted at", outDir);
}
