import { downloadAndUnzip } from "../common";
import constants from "../constants";

/**
 * Fetch an existing unbundled data on Arweave, i.e. a zipped Rocksdb folder
 * that is bundled & uploaded to Arweave.
 *
 * Note that this command takes in the txID, not a contract ID! When the downloaded
 * knowledge is unzipped, it might have a different name; you can see it with the command:
 *
 * ```sh
 * dria list
 * ```
 *
 * Or, you can see the knowledge ID in the console, while the unzip operations
 * prints its logs.
 *
 * @param txId Arweave txID to download
 */
export default async function cmdFetch(txId: string) {
  await downloadAndUnzip(txId, constants.DRIA.DATA);
}
