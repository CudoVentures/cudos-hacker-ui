<script lang="ts">
    import Portal from "svelte-portal";

  type T = $$Generic;
  export let data: { ok?: T, err?: any };

  function asOk(o: any): { ok: T } {
    return o
  }
</script>

{#if !("done" in data)}
  <Portal target="#loading">
    Loading...
  </Portal>
{/if}

{#if 'err' in data}
  <div>
    {data.err}
  </div>
{/if}

{#if 'ok' in data}
  <slot data="{asOk(data).ok}" />
{/if}

<style lang="scss">
  div {
    border: 1ch solid red;
    background: #fee;
    padding: 1ch;
  }
</style>
