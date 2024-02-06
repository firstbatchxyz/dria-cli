type ENTITIES = "REDIS" | "HOLLOWDB" | "HNSW";

export default {
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
    IPS: {
      REDIS: "172.30.0.11",
      HOLLOWDB: "172.30.0.12",
      HNSW: "172.30.0.13",
    } as const satisfies Record<ENTITIES, `${number}.${number}.${number}.${number}`>,
  },
} as const;
