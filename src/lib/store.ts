import { writable } from "svelte/store";
import { dev } from "$app/environment";

export const stress = writable(1);
export const targetDir = writable<string | undefined>(
  dev ? "/Volumes/Portable2TB" : undefined
);
