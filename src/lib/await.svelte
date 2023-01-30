<script lang="ts">
  type T = $$Generic;
  export let promise: Promise<T>;
  export let loadingMessage = "Loading...";
</script>

{#await promise}
  <slot name="loading" promise="{promise}">
    {loadingMessage}
  </slot>
{:then datum}
  <slot data="{datum}" />
{:catch e}
  <slot name="error" error="{e}">
    {e}
  </slot>
{/await}
