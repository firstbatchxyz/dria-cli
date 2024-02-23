#!/usr/bin/env node

import { hideBin } from "yargs/helpers";
import { driaCLI } from "./cli";

driaCLI(hideBin(process.argv));
