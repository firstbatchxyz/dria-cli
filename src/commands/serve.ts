import { logger } from "../common";
import constants from "../constants";
import { redisContainer, hnswContainer } from "../containers";

/**
 * Serve a given data via Dria HNSW. Assumes that the contract has been
 * pulled before-hand, via `dria pull <contract-id>`.
 *
 * @param contractId contract ID
 */
export default async function cmdServe(contractId: string) {
  logger.debug("Running Redis.");
  const redis = await redisContainer(contractId);
  await redis.start();

  logger.debug("Running Dria HNSW.");
  const hnsw = await hnswContainer(contractId);
  await hnsw.start();

  logger.info("Knowledge", contractId, "is served on:", `http://localhost:${constants.PORTS.HNSW}`);
}
