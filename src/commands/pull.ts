import { docker } from "../common";
import { hollowdbContainer, redisContainer } from "../containers";

export async function cmdPull(walletPath: string, contractId: string) {
  console.log("Running Redis.");
  const redis = await redisContainer(contractId);
  await redis.start();

  console.log("Running HollowDB.");
  const hollowdb = await hollowdbContainer(walletPath, contractId);
  await hollowdb.start();
}
