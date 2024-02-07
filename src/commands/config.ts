import { docker } from "../common";
import { getConfig } from "../configurations";
import constants from "../constants";

export default async function cmdConfig() {
  // TODO: should be able to update values here
  console.log(getConfig());
}
