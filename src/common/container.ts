import { docker } from ".";

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
