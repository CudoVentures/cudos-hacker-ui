<script lang="ts">
  import { afterUpdate, getContext, onMount } from "svelte";
  import { TABS, type Tabs } from "./Tabs.svelte";

  export let title: string;

  const { registerTab, selectedTab } = getContext<Tabs>(TABS);

  registerTab(title, null);

  function moveToTab(x: HTMLDivElement) {
    registerTab(title, x);
    // setTabContent(title, x)
    // return {
    //   destroy () {
    //     setTabContent(title, title)
    //   }
    // }
  }
</script>

<!-- <div use:moveToTab>!{title}!</div> -->

{#if $selectedTab === title}
  <slot />
{/if}
