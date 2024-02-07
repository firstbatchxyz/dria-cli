import { docker } from "../common";

export default async function cmdConfig() {
  return await docker.version();
}
