import pull from "./pull";
import fetch from "./fetch";
import stop from "./stop";
import list from "./list";
import serve from "./serve";
import clear from "./clear";

export default {
  pull,
  fetch,
  stop,
  list,
  serve,
  clear,
} as const;
