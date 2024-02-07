import { getContainerId, docker, imageExists, safeRemoveContainer } from "../common";
import constants from "../constants";
import { resolve } from "path";

export async function redisContainer(contractId: string) {
  const portBinding = `${constants.PORTS.REDIS}/tcp`;

  // check if image exists
  if (!(await imageExists(constants.IMAGES.REDIS))) {
    await docker.pull(constants.IMAGES.REDIS);
  }

  // check if container exists
  const existingContainerId = await getContainerId(constants.CONTAINERS.REDIS);
  if (existingContainerId) {
    await safeRemoveContainer(existingContainerId);
  }

  // prettier-ignore
  const cmd: string[] = [
    'redis-server',
    '--port', `${constants.PORTS.REDIS}`,
    '--maxmemory', '100mb',
    '--maxmemory-policy', 'allkeys-lru',
    '--appendonly', 'no',
    // '--save', '""', // we actually want to save
    '--dbfilename', `${contractId}.rdb`,
    '--dir', "/app/data"
  ]

  return await docker.createContainer({
    Image: constants.IMAGES.REDIS,
    Cmd: cmd,
    name: constants.CONTAINERS.REDIS,
    ExposedPorts: { [portBinding]: {} },
    HostConfig: {
      Binds: [resolve("./data") + ":/app/data"],
      PortBindings: { [portBinding]: [{ HostPort: constants.PORTS.REDIS.toString() }] },
    },
    NetworkingConfig: {
      EndpointsConfig: {
        [constants.NETWORK.NAME]: {
          IPAMConfig: {
            IPv4Address: constants.NETWORK.IPS.REDIS,
          },
        },
      },
    },
  });
}
