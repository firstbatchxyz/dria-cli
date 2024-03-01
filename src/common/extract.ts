import unzipper from "unzipper";
import { createReadStream, rmSync } from "fs";
import { logger } from ".";

/**
 * Unzips a zip file.
 *
 * @param zipPath path to zip file
 * @param outDir path to extraction
 */
export async function extractZip(zipPath: string, outDir: string) {
  try {
    await new Promise<void>((resolve, reject) => {
      createReadStream(zipPath)
        // unzips to out directory
        .pipe(unzipper.Extract({ path: outDir, verbose: process.env.NODE_ENV !== "test" }))
        .on("error", (err) => {
          reject(err);
        })
        .on("close", () => {
          logger.info("Knowledge extracted at", outDir);
          logger.info("Cleaning up zip artifacts.");
          rmSync(zipPath);
          logger.info("Done.");
          resolve();
        });
    });
  } catch (err) {
    logger.error((err as Error).toString());

    logger.info(`Something went wrong while extracting the downloaded zip file.
You can instead try unzipping via:

  unzip ${zipPath} -d ~/.dria/data

`);
  }
}
