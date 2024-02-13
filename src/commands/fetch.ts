import { downloadAndUnzip } from "../common";
import constants from "../constants";

/**
 * Fetch an existing unbundled data on Arweave, i.e. a zipped Rocksdb folder
 * that is bundled & uploaded to Arweave.
 *
 * @param contractId contract ID to download
 */
export default async function cmdFetch(contractId: string) {
  await downloadAndUnzip(contractId, constants.DRIA.DATA);
}
