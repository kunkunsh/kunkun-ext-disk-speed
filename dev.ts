import { sequentialReadTest, sequentialWriteTest } from "./speedtest/lib.ts";

const testPath = "./test.txt";
// const testPath = "/Volumes/Portable2TB/test.txt";

const writeResult = await sequentialWriteTest(
  {
    filePath: testPath,
    sizeInMB: 200,
    rounds: 10,
    bufferSizeMB: 1,
    keepTheFile: true,
  },
  (progress) => {
    console.log(progress);
  }
);
console.log(writeResult);
console.log(writeResult.totalMB / writeResult.totalDuration);

const readResult = await sequentialReadTest({
  filePath: testPath,
  rounds: 3,
  deleteAfter: false,
});
console.log(readResult);
console.log("read speed: ", readResult.totalMB / readResult.totalDuration);
