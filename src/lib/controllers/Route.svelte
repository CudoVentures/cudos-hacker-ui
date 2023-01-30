<script lang="ts">
  import Claims from "@/pages/gravity/claims.svelte";
  import { ComponentType, onDestroy } from "svelte";
  import { Route } from "svelte-navigator";
  import Crumb from "./Crumb.svelte";

  export let path: string;
  export let crumb: string | undefined = undefined;

  export let component: ComponentType | undefined = undefined;
</script>

<Route path="{path}/*" let:params component="{component}">
  {#if crumb}
    <Crumb>{crumb}</Crumb>
    <slot params="{params}" />
  {:else}
    <slot params="{params}" />
  {/if}
</Route>
