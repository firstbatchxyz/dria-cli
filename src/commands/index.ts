import pull from "./pull";
import config from "./config";
import serve from "./serve";
import stop from "./stop";

export default {
  pull,
  serve,
  config,
  stop,
} as const;
