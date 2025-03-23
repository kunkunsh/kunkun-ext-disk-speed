<script lang="ts">
  import { open, path, shell, toast, ui } from "@kksh/api/ui/custom";
  import { Button, ModeWatcher, ThemeWrapper, updateTheme } from "@kksh/svelte";
  import SpeedGauge from "$lib/components/SpeedGauge.svelte";
  import StressSelect from "$lib/components/StressSelect.svelte";
  import TargetDirSelect from "$lib/components/TargetDirSelect.svelte";
  import { stress, targetDir } from "$lib/store";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { type API } from "./types";

  let readSpeedMBps = $state(0);
  let writeSpeedMBps = $state(0);
  let running = $state(false);

  onMount(() => {
    ui.registerDragRegion();
    ui.showBackButton({ right: 0.5, bottom: 0.5 });

    updateTheme({
      theme: "neutral",
      radius: 0.5,
      lightMode: "dark",
    });
  });

  async function startSpeedTest() {
    running = true;
    readSpeedMBps;
    writeSpeedMBps;
    const _targetDir = get(targetDir);
    if (!_targetDir) {
      toast.error("Target directory is not set");
      return;
    }
    const { rpcChannel, process, command } = await shell.createDenoRpcChannel<
      {},
      API
    >(
      "$EXTENSION/speedtest/index.js",
      [],
      {
        allowAllRead: true,
        allowAllWrite: true,
      },
      {}
    );

    const api = rpcChannel.getAPI();
    const testFileName = "kk-disk-speed-test";

    const testFilePath = await path.join(_targetDir, testFileName);

    const writeResult = await api.sequentialWriteTest(
      {
        filePath: testFilePath,
        sizeInMB: get(stress) * 1024,
        rounds: 3,
        bufferSizeMB: 1,
        keepTheFile: true,
      },
      ({ totalMB, totalDuration }) => {
        writeSpeedMBps = totalMB / totalDuration;
      }
    );
    const readResult = await api.sequentialReadTest({
      filePath: testFilePath,
      rounds: 3,
      deleteAfter: true,
    });
    writeSpeedMBps = writeResult.totalMB / writeResult.totalDuration;

    readSpeedMBps = readResult.totalMB / readResult.totalDuration;

    process
      .kill()
      .then(() => {
        console.log("process killed");
      })
      .catch((err) => {
        console.error("error killing process", err);
        toast.error(`Error killing process ${process.pid}`);
      })
      .finally(() => {
        running = false;
      });
  }
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.key === "Escape") {
      ui.goBack();
    }
  }}
/>
<ModeWatcher />

<ThemeWrapper>
  <main class="container flex flex-col gap-4 pt-10">
    <div
      class="absolute left-0 top-0 h-10 w-screen"
      data-kunkun-drag-region
    ></div>
    <div class="flex items-center gap-4">
      <strong>Stress</strong>
      <StressSelect />
    </div>
    <div class="flex items-center gap-4">
      <strong>Target Directory</strong>
      <TargetDirSelect />
      {#if $targetDir}
        <button
          onclick={() => {
            if ($targetDir) {
              open.folder($targetDir);
            }
          }}
        >
          <pre>{$targetDir}</pre>
        </button>
      {:else}
        <pre class="text-red-500">Pick a target directory to test</pre>
      {/if}
    </div>
    <Button disabled={!$targetDir || running} on:click={startSpeedTest}>
      Start Speed Test
    </Button>
    <small class="text-gray-500">
      This extension's read speed may be inaccurate. Your OS may cache the test
      data and result in a much higher speed. Will be fixed in the future.
    </small>
    <div class="grid h-96 w-full grid-cols-2">
      <SpeedGauge
        speedInMBps={writeSpeedMBps}
        title="Write Speed"
        class="h-full w-full"
      />
      <SpeedGauge
        speedInMBps={readSpeedMBps}
        title="Read Speed"
        class="h-full w-full"
      />
    </div>
  </main>
</ThemeWrapper>
