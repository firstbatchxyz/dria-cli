import { logger } from "../common";
import { hollowdbContainer, redisContainer } from "../containers";

/**
 * Pull a contract data, and unbundle the data w.r.t transaction IDs.
 * This is essentially the first steps of the Dria Docker compose, that
 * is to prepare the data for Dria HNSW to use.
 *
 * Once the unbundling is complete, the containers are stopped & removed.
 * Stopping the Redis server causes the Redis cache to be saved to disk.
 * The saved `.rdb` file has the contract name, which can be used later by
 * Dria HNSW.
 *
 * @param contractId contract ID to download
 */
export default async function cmdPull(contractId: string) {
  logger.debug("Running Redis.");
  const redis = await redisContainer(contractId);
  await redis.start();

  logger.debug("Running HollowDB.");
  const hollowdb = await hollowdbContainer(contractId);
  await hollowdb.start();

  logger.info("Pulling the latest contract data.");
  await new Promise((resolve, reject) => {
    hollowdb.attach({ stream: true, stdout: true, stderr: true }, function (err, stream) {
      if (err) {
        reject(err);
      }

      // will be used to offset the progress string
      const targetStr = "INFO (1): [";
      if (stream) {
        stream.on("data", (chunk: Buffer) => {
          // hacky way to see progress by reading the container stream
          const str: string = chunk.toString();

          // finished downloading
          if (str.includes("Server synced & ready!")) {
            resolve(true);
          } else {
            const idx = str.indexOf(targetStr);
            if (idx != -1) {
              logger.info(str.slice(idx + targetStr.length - 1).replace("\n", ""));
            }
          }
        });
      }
    });
  });
  logger.info("Done! Cleaning up...");

  await hollowdb.stop();
  await redis.stop();

  await hollowdb.remove();
  await redis.remove();
}
