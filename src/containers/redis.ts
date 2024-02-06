import { containerWithName, docker, imageExists } from "../common";
import constants from "../constants";

export async function redisContainer(contractId: string) {
  const portBinding = `${constants.PORTS.REDIS}/tcp`;

  // check if image exists
  if (!(await imageExists(constants.IMAGES.REDIS))) {
    await docker.pull(constants.IMAGES.REDIS);
  }

  // check if container exists
  const existingContainerId = await containerWithName(constants.CONTAINERS.REDIS);
  if (existingContainerId) {
    return docker.getContainer(existingContainerId);
  }

  // prettier-ignore
  const cmd: string[] = [
    'redis-server',
    '--port', `${constants.PORTS.REDIS}`,
    '--maxmemory', '100mb',
    '--maxmemory-policy', 'allkeys-lru',
    '--appendonly', 'no',
    '--save', '""',
    '--dbfilename', contractId + '.rdb'
  ]

  return await docker.createContainer({
    Image: constants.IMAGES.REDIS,
    Cmd: cmd,
    name: constants.CONTAINERS.REDIS,
    ExposedPorts: { [portBinding]: {} },
    HostConfig: {
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
