import pull from "./pull";
import stop from "./stop";
import serve from "./serve";
import clear from "./clear";
import config from "./config";

export default {
  pull,
  stop,
  serve,
  clear,
  config,
} as const;
