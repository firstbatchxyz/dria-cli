import type { LogLevelNames } from "loglevel";
import { homedir } from "os";
import { resolve } from "path";

type ENTITIES = "REDIS" | "HOLLOWDB" | "HNSW";

/** The main Dria directory is located at $HOME/.dria */
const DRIA_ROOT = homedir() + "/.dria";

/** This will be `true` when we run `yarn test`. */
const IS_TEST = process.env.NODE_ENV === "test";

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
    DOWNLOAD_TIMEOUT: IS_TEST ? 100_000 : 15_000,
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
  CONTAINERS: IS_TEST
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
  NETWORK: IS_TEST
    ? {
        NAME: "dria-network",
        SUBNET: "172.30.0.0/24",
        GATEWAY: "172.30.0.1",
        IPS: {
          REDIS: "172.30.0.11",
          HOLLOWDB: "172.30.0.12",
          HNSW: "172.30.0.13",
        } as const satisfies Record<ENTITIES, `${number}.${number}.${number}.${number}`>,
      }
    : {
        NAME: "dria-network-testing",
        SUBNET: "173.30.0.0/24",
        GATEWAY: "173.30.0.1",
        IPS: {
          REDIS: "173.30.0.11",
          HOLLOWDB: "173.30.0.12",
          HNSW: "173.30.0.13",
        } as const satisfies Record<ENTITIES, `${number}.${number}.${number}.${number}`>,
      },
} as const;
