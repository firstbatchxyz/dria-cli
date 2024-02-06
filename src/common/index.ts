import Docker from "dockerode";

/** Main docker host, connected via a socket. */
export const docker = new Docker({ socketPath: "/var/run/docker.sock" });

/** Returns the first container ID with the given image if it exists, otherwise `null`. *
 *
 * @param containerName name of the container
 * @returns containerID or `null`
 * @example
 * await containerWithName("dria-redis"); // 9706...14af
 * await containerWithName("i-dont-exist-at-all"); // null
 */
export async function containerWithName(containerName: string): Promise<string | null> {
  const containers = await docker.listContainers({
    all: true,
    filters: {
      name: [containerName],
    },
  });

  if (containers.length === 0) return null;
  else return containers[0].Id;
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

export async function checkNetwork() {
  await docker.createNetwork({
    Name: "dria-network",
    Driver: "bridge",
    Attachable: true,
    IPAM: {
      Driver: "default",
      Config: [
        {
          Subnet: "172.30.0.0/24",
          Gateway: "172.30.0.1",
        },
      ],
    },
  });
}
