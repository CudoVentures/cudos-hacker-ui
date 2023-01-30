<script context="module" lang="ts">
  export const TABS = {}
  export interface Tabs {
    registerTab: (name: string, content: HTMLDivElement) => void
    selectTab: any
    selectedTab: any
  }
</script>

<script lang="ts">
  import { onDestroy, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { type Dictionary, values } from 'underscore'

  export let bare: boolean = false

  export let klass: string = ''
  export { klass as class }

  const tabNames: Dictionary<string> = {}
  const tabHolders: Dictionary<HTMLDivElement> = {}
  const tabContent: Dictionary<HTMLDivElement> = {}

  const selectedTab = writable(null as string | null)

  function registerTab(name: string, content: HTMLDivElement) {
    tabNames[name] = name
    tabContent[name] = content
    selectedTab.update((current) => current || name)
  }

  function selectTab(tab: string) {
    selectedTab.set(tab)
  }

  setContext<Tabs>(TABS, {
    registerTab,
    selectTab,
    selectedTab,
  })

  function registerTabElement(e: HTMLDivElement) {
    tabHolders[e.dataset.tab!] = e
    if (tabContent[e.dataset.tab!]) {
      e.innerHTML = ''
      e.appendChild(tabContent[e.dataset.tab!])
    }
  }
</script>

<div class="tab-group {klass}">
  <div class="tab-row">
    <slot name="before-tabs" />
    {#each values(tabNames) as tab}
      <div
        class="tab"
        class:selected={$selectedTab === tab}
        use:registerTabElement
        data-tab={tab}
        on:click={() => selectTab(tab)}>
        {tab}
      </div>
    {/each}
    <slot name="after-tabs" />
  </div>
  {#if bare}
    <slot />
  {:else}
    <div class="tab-panel">
      <slot />
    </div>
  {/if}
</div>
