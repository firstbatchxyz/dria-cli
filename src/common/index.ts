import Docker from "dockerode";
import loglevel from "loglevel";
import constants from "../constants";
import { existsSync, mkdirSync } from "fs";

export * from "./download";
export * from "./image";
export * from "./container";
export * from "./network";

/** Main docker host, connected via a socket. */
export const docker = new Docker({ socketPath: "/var/run/docker.sock" });

/** Dria logger. */
export const logger = loglevel.getLogger(constants.LOGGER.NAME);

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
