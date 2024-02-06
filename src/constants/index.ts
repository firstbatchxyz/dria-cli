export default {
  PORTS: {
    REDIS: 6379,
    HOLLOWDB: 3000,
    DRIA: 8080,
  } as const satisfies Record<Uppercase<string>, number>,
} as const;
