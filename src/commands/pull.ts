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
  logger.info("Running Redis.");
  const redis = await redisContainer(contractId);
  await redis.start();

  logger.info("Running HollowDB.");
  const hollowdb = await hollowdbContainer(walletPath, contractId);
  await hollowdb.start();

  // TODO: find a better solution
  await sleep(2000);

  // wait until HollowDB is ready
  while (true) {
    logger.debug("Checking HollowDB...");
    const res = await fetch(`http://localhost:${constants.PORTS.HOLLOWDB}`, {
      method: "POST",
      body: JSON.stringify({
        route: "STATE",
      }),
    });

    // TODO: show progress here

    if (res.ok) {
      logger.debug("Done!");
      break;
    }
    sleep(1000);
  }

  await hollowdb.stop();
  await redis.stop();

  await hollowdb.remove();
  await redis.remove();
}
