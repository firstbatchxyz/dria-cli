import { docker, pullImageIfNotExists, removeContainerIfExists } from "../common";
import constants from "../constants";

export async function hnswContainer(contractId: string) {
  const portBinding = `${constants.PORTS.HNSW}/tcp`;
  const redisPortBinding = `${constants.PORTS.REDIS}/tcp`;
  const guestDataDir = "/data";

  await pullImageIfNotExists(constants.IMAGES.HNSW);
  await removeContainerIfExists(constants.CONTAINERS.HNSW);

  return await docker.createContainer({
    Image: constants.IMAGES.HNSW,
    name: constants.CONTAINERS.HNSW,
    Env: [
      `REDIS_URL=redis://default:redispw@${constants.NETWORK.IPS.REDIS}:${constants.PORTS.REDIS}`,
      `CONTRACT_ID=${contractId}`,
      `ROCKSDB_PATH=${guestDataDir}/${contractId}`,
      `PORT=${constants.PORTS.HNSW}`,
    ],
    ExposedPorts: { [portBinding]: {} },
    HostConfig: {
      Binds: [`${constants.DRIA.DATA}:${guestDataDir}`],
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
