import { homedir } from "os";
import { resolve } from "path";

type ENTITIES = "REDIS" | "HOLLOWDB" | "HNSW";

// "~/.dria/",
const DRIA_ROOT = homedir() + "/.dria";

export default {
  DRIA: {
    /** Path to Dria root directory. */
    PATH: DRIA_ROOT,
    /** Path to Dria config. */
    CONFIG: `${DRIA_ROOT}/.driarc.json`,
    /** Path to Dria pulled contract data directory. */
    DATA: resolve(`${DRIA_ROOT}/data`),
  } as const,
  LOGGER: {
    NAME: "dria-logger",
    LEVEL: "info",
  },
  PORTS: {
    REDIS: 6379,
    HOLLOWDB: 3000,
    HNSW: 8080,
  } as const satisfies Record<ENTITIES, number>,
  IMAGES: {
    REDIS: "redis:alpine",
    HOLLOWDB: "firstbatch/dria-hollowdb:latest",
    HNSW: "firstbatch/dria-hnsw:latest",
  } as const satisfies Record<ENTITIES, string>,
  CONTAINERS: {
    REDIS: "dria-redis",
    HOLLOWDB: "dria-hollowdb",
    HNSW: "dria-hnsw",
  } as const satisfies Record<ENTITIES, string>,
  NETWORK: {
    NAME: "dria-network",
    SUBNET: "172.30.0.0/24",
    GATEWAY: "172.30.0.1",
    IPS: {
      REDIS: "172.30.0.11",
      HOLLOWDB: "172.30.0.12",
      HNSW: "172.30.0.13",
    } as const satisfies Record<ENTITIES, `${number}.${number}.${number}.${number}`>,
  },
} as const;
