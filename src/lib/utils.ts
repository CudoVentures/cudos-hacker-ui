import { stringify } from "yaml";
import { fromUtf8, toBech32 } from "@cosmjs/encoding";
import { Timestamp } from "cosmjs-types/google/protobuf/timestamp";
import { Writable, writable } from "svelte/store";
import pLazy from "p-lazy";
import { Big } from "big.js";
import { getContext } from "svelte";
import { TaskView } from "./task";

// export function generator<T>(i: T, g: (d: T) => AsyncGenerator<T>) {
//   let data = writable<T>(i);
//   async function helper() {
//     for await (const datum of g(i))
//       data.set(datum)
//   }
//   helper()
//   return data
// }

export interface Modal {
  open(tv: typeof TaskView, props: Record<string, unknown>)
}

export function useModal() {
  return getContext("simple-modal") as Modal;
}

function future<T>(f: () => Promise<T>) {
  return pLazy.from(f)
}

export function procure<T>(p: undefined | (() => Promise<T>) | Promise<T>) {
  const store: Writable<T> = writable<T>(undefined);
  function helper() {
    if (p === undefined) {
      // do nothing
    } else if (typeof p === "function") {
      (async () => store.set(await p()))()
    } else {
      (async () => store.set(await p))()
    }
  }
  helper()
  return {
    ...store,
    again: (...args: any[]) => helper()
  }
}

export function generator<T>(f: () => AsyncGenerator<T>) {
  let data = writable<{ ok?: T, err?: any, done?: boolean }>({});
  async function helper() {
    try {
      for await (const datum of f())
        data.update((d) => ({ ...d, ok: datum }))
      data.update((d) => ({ ...d, done: true }))
    } catch (e) {
      data.update((d) => ({ ...d, err: e, done: true }))
    }
  }
  helper()
  return data
}

export function loader<
  T1,
  T2 = T1,
  T3 = T2,
  T4 = T3,
  T5 = T4,
  T6 = T5,
  T7 = T6,
  T8 = T7,
  T9 = T8
>(
  f1: () => T1,
  f2?: (datum: T1) => Promise<T2>,
  f3?: (datum: T2) => Promise<T3>,
  f4?: (datum: T3) => Promise<T4>,
  f5?: (datum: T4) => Promise<T5>,
  f6?: (datum: T5) => Promise<T6>,
  f7?: (datum: T6) => Promise<T7>,
  f8?: (datum: T7) => Promise<T8>,
  f9?: (datum: T8) => Promise<T9>
) {
  let fs = [f1, f2, f3, f4, f5, f6, f7, f8, f9] as [
    () => T1,
    (datum: T1) => Promise<T2>,
    (datum: T2) => Promise<T3>,
    (datum: T3) => Promise<T4>,
    (datum: T4) => Promise<T5>,
    (datum: T5) => Promise<T6>,
    (datum: T6) => Promise<T7>,
    (datum: T7) => Promise<T8>,
    (datum: T8) => Promise<T9>
  ];
  let vs = [] as unknown as [T1, T2, T3, T4, T5, T6, T7, T8, T9];
  vs[0] = f1();
  let data = writable<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>(vs[0]);
  async function helper() {
    if (fs[1]) data.set((vs[1] = await fs[1](vs[0])));
    if (fs[2]) data.set((vs[2] = await fs[2](vs[1])));
    if (fs[3]) data.set((vs[3] = await fs[3](vs[2])));
    if (fs[4]) data.set((vs[4] = await fs[4](vs[3])));
    if (fs[5]) data.set((vs[5] = await fs[5](vs[4])));
    if (fs[6]) data.set((vs[6] = await fs[6](vs[5])));
    if (fs[7]) data.set((vs[7] = await fs[7](vs[6])));
    if (fs[8]) data.set((vs[8] = await fs[8](vs[7])));
  }
  helper();
  return data;
}

export function poll<T, Q>(fn: () => Promise<T>): Writable<T | null>
export function poll<T, Q>(fn: () => Promise<T>, initial: Q): Writable<Q | T>
export function poll<T, Q>(fn: () => Promise<T>, initial: Q, interval: number): Writable<Q | T>

export function poll<T, Q>(fn: () => Promise<T>, initial?: Q, interval: number = 1000) {
  const store = writable(initial as Q | T);
  async function fetch() {
    store.set(await fn());
    setTimeout(fetch, interval);
  }
  fetch();
  return store;
}

export function randomId(size: number = 8) {
  const array = new Uint8Array(8)
  crypto.getRandomValues(array)
  return toBech32("", array).slice(1)
}

export function dump(x: any) {
  return stringify(x, { merge: true });
}

export function parseDec(v: string | Uint8Array) {
  if (typeof v !== "string") v = fromUtf8(v);
  return parseFloat(v) / 1e18;
}

export function parseDecPct(v: string | Uint8Array) {
  return (parseDec(v) * 100).toFixed(0) + "%"
}

export function parseTime(t: Timestamp) {
  const nanos = BigInt(t.seconds.toString()) * BigInt(1000000000) + BigInt(t.nanos)
  const millis = nanos / BigInt(1000)
  return new Date(Number(millis))
}

export function thousands(n: string | bigint | number | Long) {
  if (typeof n === "number") n = n.toFixed(0);
  return n.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export function cudos(n: string | bigint | number) {
  if (typeof n === "string") {
    n = n.replace(/acudos$/, '')
    n = BigInt(n)
  }
  return thousands((Number(n) / 1e18).toFixed(3));
}

export function format(amount: string, exponent: number) {
  return thousands(Big(amount).div(Big(10).pow(exponent)).toFixed());
}
