import { writable } from "svelte/store";

export const stress = writable(1);
export const targetDir = writable<string | undefined>(undefined);
