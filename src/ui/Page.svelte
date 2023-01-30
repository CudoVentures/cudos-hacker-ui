<script lang="ts">
  export let title: string | undefined = undefined;
</script>

<svelte:head>
  {#if title}
    <title>{title} - Cudo Exchange</title>>
  {:else}
    <title>Cudo Exchange</title>>
  {/if}
</svelte:head>
<main>
  {#if title}
    <h1>{title}</h1>
  {/if}
  <slot />
</main>
