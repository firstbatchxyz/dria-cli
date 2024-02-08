import Docker from "dockerode";
import loglevel from "loglevel";
import constants from "../constants";

/** Main docker host, connected via a socket. */
export const docker = new Docker({ socketPath: "/var/run/docker.sock" });

/** Dria logger. */
export const logger = loglevel.getLogger(constants.LOGGER.NAME);

/** Returns the first container ID with the given image if it exists, otherwise `null`. *
 *
 * @param containerName name of the container
 * @returns containerID or `null`
 * @example
 * await containerWithName("dria-redis"); // 9706...14af
 * await containerWithName("i-dont-exist-at-all"); // null
 */
export async function getContainerId(containerName: string): Promise<string | undefined> {
  const containers = await docker.listContainers({
    all: true,
    filters: {
      name: [containerName],
    },
  });

  return containers.at(0)?.Id;
}

/** Returns the first image ID with the given image if it exists, otherwise `null`.
 *
 * @param imageName name of the image along with its tag, e.g. `redis:alpine`
 * @returns a boolean indicating that the image exists
 * @example
 * await imageExists("redis:alpine"); // true
 * await imageExists("idontexist:atall"); // false
 */
export async function imageExists(imageName: string): Promise<boolean> {
  const images = await docker.listImages({
    all: true,
    filters: JSON.stringify({
      reference: [imageName],
    }),
  });

  return images.length !== 0;
}

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

/** Pings the Docker engine, throws a string error if the engine is offline. */
export async function checkDocker() {
  try {
    await docker.ping();
  } catch (err) {
    throw new Error("Docker not detected! Is the Docker engine online?");
  }
}

/** Sleep for the given amount of milliseconds.
 *
 * @param ms number of milliseconds
 * @example
 * await sleep(1000);
 */
export async function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

/**
 * Safely removes a container, that is to stop it if its running
 * and then remove the container.
 *
 * @param containerId container id
 */
export async function safeRemoveContainer(containerId: string) {
  const container = docker.getContainer(containerId);
  const info = await container.inspect();

  if (info.State.Running) {
    await container.stop();
  }

  await container.remove();
}
