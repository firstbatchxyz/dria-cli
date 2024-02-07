import { logger } from "../common";
import { redisContainer, hnswContainer } from "../containers";

/**
 * Serve a given data via Dria HNSW. Assumes that the contract has been
 * pulled before-hand, via `dria pull <contract-id>`.
 *
 * @param contractId contract ID
 */
export default async function cmdServe(contractId: string) {
  logger.info("Running Redis.");
  const redis = await redisContainer(contractId);
  await redis.start();

  logger.info("Running Dria HNSW.");
  const hnsw = await hnswContainer(contractId);
  await hnsw.start();
}
