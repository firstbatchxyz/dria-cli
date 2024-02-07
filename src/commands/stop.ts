import { getContainerId, logger, safeRemoveContainer } from "../common";
import constants from "../constants";

/**
 * Stops an existing Dria service.
 */
export default async function cmdStop() {
  const redisContainerId = await getContainerId(constants.CONTAINERS.REDIS);
  if (redisContainerId) {
    logger.debug("Stopping Redis.");
    await safeRemoveContainer(redisContainerId);
  } else {
    logger.debug("No Redis container found.");
  }

  const hnswContainerId = await getContainerId(constants.CONTAINERS.HNSW);
  if (hnswContainerId) {
    logger.debug("Stopping Dria HNSW.");
    await safeRemoveContainer(hnswContainerId);
  } else {
    logger.debug("No Dria HNSW container found.");
  }
}
