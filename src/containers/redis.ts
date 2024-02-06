// export async function pullRedis(docker: Docker) {
//   console.log("Pulling Redis...");
//   await docker.pull("redis:alpine");
// }

import { docker, errorToContainerId } from "../common";
import constants from "../constants";

export async function redisContainer(contractId: string) {
  const name = "dria-redis";
  const portBinding = `${constants.PORTS.REDIS}/tcp`;

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

  try {
    return await docker.createContainer({
      Image: "redis:alpine",
      Cmd: cmd,
      name: name,
      ExposedPorts: { [portBinding]: {} },
      HostConfig: {
        PortBindings: { [portBinding]: [{ HostPort: constants.PORTS.REDIS.toString() }] },
      },
    });
  } catch (err) {
    const containerId = errorToContainerId(name, err);
    if (containerId) return docker.getContainer(containerId);
    else throw err;
  }
}
