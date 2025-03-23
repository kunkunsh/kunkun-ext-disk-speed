const oneMB = 1024 * 1024;
export type Progress = { totalMB: number; totalDuration: number };

export async function sequentialWriteTest(
  options: {
    filePath: string;
    sizeInMB: number;
    rounds: number;
    bufferSizeMB: number;
    keepTheFile?: boolean;
  },
  callback?: (progress: Progress) => void
): Promise<Progress> {
  //   console.error("sequentialWriteTest", options);
  const { filePath, sizeInMB, rounds, bufferSizeMB } = options;
  const data = new Uint8Array(bufferSizeMB * oneMB); // 1MB buffer
  let start = performance.now();
  let totalMB = 0;
  let totalDuration = 0;
  for (let round = 0; round < rounds; round++) {
    const file = await Deno.open(filePath, { write: true, create: true });
    const writer = file.writable.getWriter();

    start = performance.now();
    for (let i = 0; i < Math.floor(sizeInMB / bufferSizeMB); i++) {
      await writer.write(data);
      totalMB += bufferSizeMB;
    }
    const roundEnd = performance.now();
    totalDuration += (roundEnd - start) / 1000;
    callback?.({ totalMB, totalDuration });
    await writer.close();
    // if keepTheFile, do not remove the file in the last round
    const isLastRound = round === rounds - 1;
    if (!isLastRound && !options.keepTheFile) {
      Deno.removeSync(filePath);
    }
  }

  return { totalDuration, totalMB };
}

export async function createEmptyFile(
  filePath: string,
  sizeInMB: number
): Promise<void> {
  if (await fileExists(filePath)) {
    await Deno.remove(filePath);
  }
  const file = await Deno.open(filePath, { write: true, create: true });
  const writer = file.writable.getWriter();
  for (let i = 0; i < sizeInMB; i++) {
    await writer.write(new Uint8Array(oneMB));
  }
  await writer.close();
}

// Sequential Read
export async function sequentialReadTest(
  options: { filePath: string; rounds: number; deleteAfter: boolean } = {
    filePath: "",
    rounds: 1,
    deleteAfter: true,
  }
): Promise<Progress> {
  const { filePath, rounds, deleteAfter } = options;
  const file = await Deno.open(filePath, { read: true });
  const buffer = new Uint8Array(oneMB); // 1MB buffer
  const start = performance.now();
  let totalMB = 0;
  while ((await file.read(buffer)) !== null) {
    totalMB += 1;
  }
  const totalDuration = (performance.now() - start) / 1000;
  file.close();
  if (options.deleteAfter) {
    Deno.removeSync(filePath);
  }
  return { totalMB, totalDuration };
}

export function fileExists(filePath: string): boolean {
  try {
    Deno.statSync(filePath);
    return true;
  } catch (_error) {
    return false;
  }
}
