import { logger, sleep } from "../common";
import constants from "../constants";
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
 * @param walletPath wallet required for HollowDB
 * @param contractId contract ID to download
 */
export default async function cmdPull(walletPath: string, contractId: string) {
  logger.debug("Running Redis.");
  const redis = await redisContainer(contractId);
  await redis.start();

  logger.debug("Running HollowDB.");
  const hollowdb = await hollowdbContainer(walletPath, contractId);
  await hollowdb.start();

  logger.info("Pulling the latest contract data.");
  // TODO: find a better solution to wait for server-startup
  await sleep(1000);

  // wait until HollowDB is ready
  const url = `http://localhost:${constants.PORTS.HOLLOWDB}/state`;
  while (true) {
    const res = await fetch(url, { method: "GET" });

    // TODO: show progress here by getting the log from hollowdb container
    if (res.ok) {
      logger.info("\nDone! Cleaning up...");
      break;
    }
    await sleep(250);
  }

  await hollowdb.stop();
  await redis.stop();

  await hollowdb.remove();
  await redis.remove();
}
