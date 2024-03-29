import { docker, pullImage, removeContainerIfExists } from "../common";
import constants from "../constants";

export async function hollowdbContainer(contractId: string) {
  const portBinding = `${constants.PORTS.HOLLOWDB}/tcp`;
  const redisPortBinding = `${constants.PORTS.REDIS}/tcp`;
  const guestDataDir = "/app/data";

  await pullImage(constants.IMAGES.HOLLOWDB);
  await removeContainerIfExists(constants.CONTAINERS.HOLLOWDB);

  return await docker.createContainer({
    Image: constants.IMAGES.HOLLOWDB,
    name: constants.CONTAINERS.HOLLOWDB,
    Env: [
      `REDIS_URL=redis://default:redispw@${constants.NETWORK.IPS.REDIS}:${constants.PORTS.REDIS}`,
      `ROCKSDB_PATH=${guestDataDir}/${contractId}`,
      `CONTRACT_ID=${contractId}`,
      "USE_BUNDLR=true", // true if your contract uses Bundlr
      "USE_HTX=true", // true if your contract stores values as `hash.txid`
      "BUNDLR_FBS=80", // batch size for downloading bundled values from Arweave
      `PORT=${constants.PORTS.HOLLOWDB}`,
    ],
    ExposedPorts: { [portBinding]: {} },
    HostConfig: {
      // prettier-ignore
      Binds: [ 
        `${constants.DRIA.DATA}:${guestDataDir}`
      ],
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
