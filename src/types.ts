import type {
  createEmptyFile,
  sequentialReadTest,
  sequentialWriteTest,
} from "../speedtest/lib.ts";

export interface API {
  sequentialWriteTest: typeof sequentialWriteTest;
  sequentialReadTest: typeof sequentialReadTest;
  createEmptyFile: typeof createEmptyFile;
}
export type { Progress } from "../speedtest/lib.ts";
