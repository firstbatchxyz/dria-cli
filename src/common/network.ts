import { docker, logger } from ".";
import constants from "../constants";

/** Checks if the network used by Dria images exist. If not, it creates the network. */
export async function checkNetwork() {
  const networks = await docker.listNetworks({
    filters: {
      name: [constants.NETWORK.NAME],
    },
  });

  if (networks.length === 0) {
    logger.debug("Required network:", constants.NETWORK.NAME, "not found, creating now.");
    await docker.createNetwork({
      Name: constants.NETWORK.NAME,
      Driver: "bridge",
      Attachable: true,
      IPAM: {
        Driver: "default",
        Config: [
          {
            Subnet: constants.NETWORK.SUBNET,
            Gateway: constants.NETWORK.GATEWAY,
          },
        ],
      },
    });
  }
}
