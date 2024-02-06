import { docker } from "../common";

export async function cmdPing() {
  try {
    await docker.ping();
  } catch (err) {
    throw "Docker not detected! Is the Docker engine online?";
  }
}
