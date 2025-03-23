import { writable } from "svelte/store";

export const stress = writable(1);
export const targetDir = writable<string | undefined>(
  import.meta.env.DEV ? "/Volumes/Portable2TB" : undefined
);
