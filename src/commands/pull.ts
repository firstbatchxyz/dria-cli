import { sleep } from "../common";
import constants from "../constants";
import { hollowdbContainer, redisContainer } from "../containers";

/**
 * Pull a contract data, and unbundle the data w.r.t transaction IDs.
 * This is essentially the first steps of the Dria Docker compose, that
 * is to prepare the data for Dria HNSW to use.
 *
 * @param walletPath wallet required for HollowDB
 * @param contractId contract ID to download
 */
export async function cmdPull(walletPath: string, contractId: string) {
  console.log("Running Redis.");
  const redis = await redisContainer(contractId);
  await redis.start();

  console.log("Running HollowDB.");
  const hollowdb = await hollowdbContainer(walletPath, contractId);
  await hollowdb.start();

  // TODO: find a better solution
  await sleep(2000);

  // wait until HollowDB is ready
  // TODO: create a dump for this contract
  while (true) {
    console.log("Checking HollowDB...");
    const res = await fetch(`http://localhost:${constants.PORTS.HOLLOWDB}`, {
      method: "POST",
      body: JSON.stringify({
        route: "STATE",
      }),
    });

    if (res.ok) {
      console.log("Done!");
      break;
    }
    sleep(1000);
  }

  await hollowdb.stop();
  await redis.stop();

  await hollowdb.remove();
  await redis.remove();
}
