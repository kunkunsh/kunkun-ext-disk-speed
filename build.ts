import { $ } from "bun";

await Bun.build({
  entrypoints: ["speedtest/index.ts"],
  outdir: "speedtest",
  minify: true,
});
await $`vite build`;
