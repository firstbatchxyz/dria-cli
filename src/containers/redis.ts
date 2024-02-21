import { docker, pullImage, removeContainerIfExists } from "../common";
import constants from "../constants";
import { resolve } from "path";

export async function redisContainer(contractId: string) {
  const portBinding = `${constants.PORTS.REDIS}/tcp`;
  const hostDataDir = `${resolve(constants.DRIA.DATA)}/${contractId}`;
  const containerDataDir = "/app/data";

  await pullImage(constants.IMAGES.REDIS);
  await removeContainerIfExists(constants.CONTAINERS.REDIS);

  // prettier-ignore
  const cmd: string[] = [
    'redis-server',
    '--port', `${constants.PORTS.REDIS}`,
    '--maxmemory', '100mb',
    '--maxmemory-policy', 'allkeys-lru',
    '--appendonly', 'no',
    // '--save', '""', // we actually want to save
    '--dbfilename', `${contractId}.rdb`,
    '--dir', containerDataDir
  ]

  return await docker.createContainer({
    Image: constants.IMAGES.REDIS,
    Cmd: cmd,
    name: constants.CONTAINERS.REDIS,
    ExposedPorts: { [portBinding]: {} },
    HostConfig: {
      Binds: [`${hostDataDir}:${containerDataDir}`],
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
