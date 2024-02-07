import { getContainerId, docker, imageExists, safeRemoveContainer } from "../common";
import constants from "../constants";

export async function hollowdbContainer(walletPath: string, contractId: string) {
  const portBinding = `${constants.PORTS.HOLLOWDB}/tcp`;
  const redisPortBinding = `${constants.PORTS.REDIS}/tcp`;

  // check if image exists
  if (!(await imageExists(constants.IMAGES.HOLLOWDB))) {
    await docker.pull(constants.IMAGES.HOLLOWDB);
  }

  // check if container exists
  // remove it if thats the case
  const existingContainerId = await getContainerId(constants.CONTAINERS.HOLLOWDB);
  if (existingContainerId) {
    await safeRemoveContainer(existingContainerId);
  }

  return await docker.createContainer({
    Image: constants.IMAGES.HOLLOWDB,
    name: constants.CONTAINERS.HOLLOWDB,
    Env: [
      // "REDIS=redis://default:redispw@redis:6379",
      `REDIS_URL=redis://default:redispw@${constants.NETWORK.IPS.REDIS}:6379`,
      `CONTRACT_TXID=${contractId}`,
      "USE_BUNDLR=true", // true if your contract uses Bundlr
      "USE_HTX=true", // true if your contract stores values as `hash.txid`
      "BUNDLR_FBS=80", // batch size for downloading bundled values from Arweave
    ],
    ExposedPorts: { [portBinding]: {} },
    HostConfig: {
      Binds: [walletPath + ":/app/config/wallet.json:ro"],
      PortBindings: {
        [portBinding]: [{ HostPort: constants.PORTS.HOLLOWDB.toString() }],
        [redisPortBinding]: [{ HostPort: constants.PORTS.REDIS.toString() }],
      },
    },
    NetworkingConfig: {
      EndpointsConfig: {
        [constants.NETWORK.NAME]: {
          IPAMConfig: {
            IPv4Address: constants.NETWORK.IPS.HOLLOWDB,
          },
        },
      },
    },
  });
}
