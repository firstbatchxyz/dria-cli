import type { LogLevelNames } from "loglevel";
import { homedir } from "os";
import { resolve } from "path";

type ENTITIES = "REDIS" | "HOLLOWDB" | "HNSW";

const DRIA_ROOT = homedir() + "/.dria"; // "~/.dria/",

export default {
  ARWEAVE: {
    /** Base URL for `fetch` command. */
    DOWNLOAD_URL: "https://arweave.net",
  },
  DRIA: {
    /** Path to Dria root directory. */
    PATH: DRIA_ROOT,
    /** Path to Dria config. */
    CONFIG: `${DRIA_ROOT}/.driarc.json`,
    /** Path to Dria pulled contract data directory. */
    DATA: resolve(`${DRIA_ROOT}/data`),
    /** Temporary Dria path, used for zip buffer. */
    TMP: resolve(`${DRIA_ROOT}/tmp`),
  } as const,
  HOLLOWDB: {
    /** Timeout until download starts during `pull`,
     * if download doesn't start by then, it gives an error. */
    DOWNLOAD_TIMEOUT: 15000,
  },
  LOGGER: {
    NAME: "dria-logger",
    LEVEL: "info" satisfies LogLevelNames,
  } as const,
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
  CONTAINERS:
    process.env.NODE_ENV === "test"
      ? ({
          REDIS: "dria-redis-testing",
          HOLLOWDB: "dria-hollowdb-testing",
          HNSW: "dria-hnsw-testing",
        } as const satisfies Record<ENTITIES, `${string}-testing`>)
      : ({
          REDIS: "dria-redis",
          HOLLOWDB: "dria-hollowdb",
          HNSW: "dria-hnsw",
        } as const satisfies Record<ENTITIES, string>),
  NETWORK: {
    NAME: process.env.NODE_ENV === "test" ? "dria-network-testing" : "dria-network",
    SUBNET: "172.30.0.0/24",
    GATEWAY: "172.30.0.1",
    IPS: {
      REDIS: "172.30.0.11",
      HOLLOWDB: "172.30.0.12",
      HNSW: "172.30.0.13",
    } as const satisfies Record<ENTITIES, `${number}.${number}.${number}.${number}`>,
  },
} as const;
