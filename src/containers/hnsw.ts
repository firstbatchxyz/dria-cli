import { getContainerId, docker, imageExists, safeRemoveContainer } from "../common";
import constants from "../constants";

export async function hnswContainer(contractId: string) {
  const portBinding = `${constants.PORTS.HNSW}/tcp`;
  const redisPortBinding = `${constants.PORTS.REDIS}/tcp`;

  // check if image exists
  if (!(await imageExists(constants.IMAGES.HNSW))) {
    await docker.pull(constants.IMAGES.HNSW);
  }

  // check if container exists
  // remove it if thats the case
  const existingContainerId = await getContainerId(constants.CONTAINERS.HNSW);
  if (existingContainerId) {
    await safeRemoveContainer(existingContainerId);
  }

  return await docker.createContainer({
    Image: constants.IMAGES.HNSW,
    name: constants.CONTAINERS.HNSW,
    Env: [
      `REDIS_URL=redis://default:redispw@${constants.NETWORK.IPS.REDIS}:6379`,
      `CONTRACT_ID=${contractId}`,
      `ROCKSDB_PATH=/data/${contractId}`,
    ],
    ExposedPorts: { [portBinding]: {} },
    HostConfig: {
      Binds: [`${constants.DRIA.DATA}:/data`],
      PortBindings: {
        [portBinding]: [{ HostPort: constants.PORTS.HNSW.toString() }],
        [redisPortBinding]: [{ HostPort: constants.PORTS.REDIS.toString() }],
      },
    },
    NetworkingConfig: {
      EndpointsConfig: {
        [constants.NETWORK.NAME]: {
          IPAMConfig: {
            IPv4Address: constants.NETWORK.IPS.HNSW,
          },
        },
      },
    },
  });
}
