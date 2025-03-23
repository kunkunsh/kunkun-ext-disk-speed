import { API } from "../src/types.ts";
import { expose } from "@kksh/api/runtime/deno";
import {
  sequentialWriteTest,
  sequentialReadTest,
  createEmptyFile,
} from "./lib.ts";

expose({
  sequentialWriteTest,
  sequentialReadTest,
  createEmptyFile,
} satisfies API);
