import { sequentialReadTest, sequentialWriteTest } from "./speedtest/lib.ts";

const testPath = "./test.txt";
// const testPath = "/Volumes/Portable2TB/test.txt";

const writeResult = await sequentialWriteTest(
  {
    filePath: testPath,
    sizeInMB: 1000,
    rounds: 5,
    bufferSizeMB: 1,
    keepTheFile: true,
  },
  (progress) => {
    console.log("Write progress:", progress);
  }
);
console.log("Write result:", writeResult);
console.log(
  "Write speed (MB/s):",
  writeResult.totalMB / writeResult.totalDuration
);

const readResult = await sequentialReadTest({
  filePath: testPath,
  rounds: 3,
  deleteAfter: false,
});
console.log("Read result:", readResult);
console.log(
  "Read speed (MB/s):",
  readResult.totalMB / readResult.totalDuration
);
