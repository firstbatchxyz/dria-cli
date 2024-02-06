import Docker from "dockerode";

/** Main docker host, connected via a socket. */
export const docker = new Docker({ socketPath: "/var/run/docker.sock" });

/**
 * Hacky way to retrieve the existing container ID.
 * TODO: there must be a better way...
 *
 * @param containerName name of the container
 * @param err error object
 * @returns parsed container ID
 */
export function errorToContainerId(containerName: string, err: unknown) {
  const _err = err as { statusCode: number; json: { message: string } };
  if (_err.statusCode == 409) {
    const containerId = _err.json.message.slice(
      `Conflict. The container name "/${containerName}" is already in use by container "`.length,
    );
    return containerId.slice(0, containerId.indexOf('"'));
  } else {
    return undefined;
  }
}
