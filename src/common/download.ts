import Axios from "axios";
import constants from "../constants";
import { logger } from ".";
import { createWriteStream, existsSync, mkdirSync } from "fs";

/** Download a zipped data from Arweave and writes to dist with streams.
 *
 * @param txId txID on Arweave
 */
export async function downloadZip(txId: string) {
  const url = `${constants.ARWEAVE.DOWNLOAD_URL}/${txId}`;

  logger.info("Downloading from", url);

  // download the file using a stream (due to large size)
  if (!existsSync(constants.DRIA.TMP)) {
    mkdirSync(constants.DRIA.TMP, { recursive: true });
  }
  const zipPath = `${constants.DRIA.TMP}/${txId}.zip`;
  const writer = createWriteStream(zipPath);
  await Axios({
    url,
    method: "get",
    timeout: 0, // no timeouts
    // TODO: connecting axios stream to unzipper could work, but couldnt solve it yet
    responseType: "stream",
    // show download progress here
    onDownloadProgress(progressEvent) {
      if (progressEvent.total) {
        const percentCompleted = ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2);
        logger.info(`Progress: ${percentCompleted}%`);
      }
    },
  }).then((response) => {
    return new Promise<void>((resolve, reject) => {
      response.data.pipe(writer);

      let error: Error | null = null;

      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });

      writer.on("close", () => {
        if (!error) resolve();
        // if error, we've rejected above
      });
    });
  });

  return zipPath;
}
