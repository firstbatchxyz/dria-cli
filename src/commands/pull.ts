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

  // TODO: find a better solution
  logger.info("Pulling the latest contract data.");
  await sleep(1000);

  // wait until HollowDB is ready
  while (true) {
    const res = await fetch(`http://localhost:${constants.PORTS.HOLLOWDB}`, {
      method: "POST",
      body: JSON.stringify({
        route: "STATE",
      }),
    });

    // TODO: show progress here
    if (res.status === 503) {
      const msg = await res.text();
      process.stdout.write(msg.slice("Contract cache is still loading, please try again shortly: ".length) + "\x1b[0G");
    } else if (res.ok) {
      console.log("");
      logger.info("Done!");
      break;
    }
    await sleep(250);
  }

  logger.debug("Cleaning up.");
  await hollowdb.stop();
  await redis.stop();

  await hollowdb.remove();
  await redis.remove();
}
