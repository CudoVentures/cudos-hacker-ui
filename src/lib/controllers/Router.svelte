<script context="module" lang="ts">
  import { getContext } from "svelte";
  export const CRUMBS = {};
  export interface Crumbs {
    add: (label: string, path: string) => void
    list: () => [string, string][]
    remove: (path: string) => void
  }
  export function getCrumbs() {
    return getContext<Crumbs>(CRUMBS);
  }
</script>

<script lang="ts">
  import { setContext } from "svelte";
  import { Router } from "svelte-navigator";
  import { RouterHistory } from "@/lib/history";

  let crumbs = [] as [string, string][]

  function add(name: string, path: string) {
    crumbs.push([name, path])
  }

  function remove(path: string) {
    crumbs = crumbs.filter(c => c[1] !== path)
  }

  function list() {
    return crumbs
  }

  setContext<Crumbs>(CRUMBS, {
    add,
    list,
    remove,
  });
</script>

<Router primary="{false}" history="{new RouterHistory()}">
  <slot />
</Router>
