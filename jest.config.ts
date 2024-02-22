import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  // ts-jest defaults
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|js)$": "ts-jest",
  },
  // timeout should be rather large due to Docker stuff
  testTimeout: 60000,
  // docker containers may take some time to close
  openHandlesTimeout: 10000,
  // print everything like Mocha
  verbose: true,
  // ignore output directory
  testPathIgnorePatterns: ["bin", "node_modules", "src"],
};

export default config;
