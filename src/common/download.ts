import Axios from "axios";
import unzipper from "unzipper";
import constants from "../constants";
import { logger } from ".";
import { createReadStream, createWriteStream, existsSync, mkdirSync, rmSync } from "fs";

/** Download a zipped data from Arweave, unzip & extract it at a given path.
 *
 * Uses streaming to write request to tmp disk, and then to target folder due to large size.
 *
 * @param txId txID on Arweave
 * @param outDir output directory for the extraction file
 */
export async function downloadAndUnzip(txId: string, outDir: string) {
  const url = `${constants.ARWEAVE.DOWNLOAD_URL}/${txId}`;

  logger.info("Downloading from", url);

  // download the file using a stream (due to large size)
  if (!existsSync(constants.DRIA.TMP)) {
    mkdirSync(constants.DRIA.TMP, { recursive: true });
  }
  const tmpPath = `${constants.DRIA.TMP}/${txId}.zip`;
  const writer = createWriteStream(tmpPath);
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
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);

      let error: Error | null = null;

      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });

      writer.on("close", () => {
        if (!error) resolve(true);
        // if error, we've rejected above
      });
    });
  });

  // unzip to out directory
  createReadStream(tmpPath)
    .pipe(unzipper.Extract({ path: outDir }))
    .on("close", () => {
      logger.info("Knowledge extracted at", outDir);
      logger.info("Cleaning up zip artifacts.");
      rmSync(tmpPath);
      logger.info("Done.");
    });
}
