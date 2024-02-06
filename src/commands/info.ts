import { docker } from "../common";

export async function cmdInfo() {
  return await docker.version();
}
