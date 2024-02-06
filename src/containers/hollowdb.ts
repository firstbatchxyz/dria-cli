import { docker, errorToContainerId } from "../common";
import constants from "../constants";

// export async function pullDriaHollowDB(docker: Docker) {
//   console.log("Pulling HollowDB...");
//   await docker.pull("firstbatch/dria-hollowdb:latest");
// }

export async function hollowdbContainer(walletPath: string, contractId: string) {
  const name = "dria-hollowdb";
  const portBinding = `${constants.PORTS.HOLLOWDB}/tcp`;
  const redisPortBinding = `${constants.PORTS.REDIS}/tcp`;

  try {
    return await docker.createContainer({
      Image: "firstbatch/dria-hollowdb:latest",
      ExposedPorts: { [portBinding]: {} },
      name: name,
      Env: [
        // "REDIS=redis://default:redispw@redis:6379",
        "REDIS=redis://default:redispw@localhost:6379",
        `CONTRACT_TXID=${contractId}`,
        "USE_BUNDLR=true", // true if your contract uses Bundlr
        "USE_HTX=true", // true if your contract stores values as `hash.txid`
        "BUNDLR_FBS=80", // batch size for downloading bundled values from Arweave
      ],
      HostConfig: {
        Binds: [walletPath + ":/app/config/wallet.json:ro"],
        PortBindings: {
          [portBinding]: [{ HostPort: constants.PORTS.HOLLOWDB.toString() }],
          [redisPortBinding]: [{ HostPort: constants.PORTS.REDIS.toString() }],
        },
      },
    });
  } catch (err) {
    const containerId = errorToContainerId(name, err);
    if (containerId) return docker.getContainer(containerId);
    else throw err;
  }
}
