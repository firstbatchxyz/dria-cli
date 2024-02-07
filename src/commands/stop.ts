import { getContainerId, logger, safeRemoveContainer } from "../common";
import constants from "../constants";

/**
 * Stops an existing Dria service.
 */
export default async function cmdStop() {
  const redisContainerId = await getContainerId(constants.CONTAINERS.REDIS);
  logger.debug("Stopping Redis.");
  if (redisContainerId) {
    await safeRemoveContainer(redisContainerId);
  } else {
    logger.debug("No Redis container found.");
  }

  const hnswContainerId = await getContainerId(constants.CONTAINERS.HNSW);
  logger.debug("Stopping Dria HNSW.");
  if (hnswContainerId) {
    await safeRemoveContainer(hnswContainerId);
  } else {
    logger.debug("No Dria HNSW container found.");
  }

  logger.info("Stopped Dria.");
}
