import { writable } from "svelte/store";
import _ from "underscore";
import { Client } from "./client";
import { Network } from "./network";

export const reloads = writable(0)

export const networks = writable(null as unknown as Record<string, Network>)

export const selectedNetwork = writable(null as string | null)

export const params = writable({} as Record<string, string>)

export const client = writable(null as Client | null)
