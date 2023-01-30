<script lang="ts">
  import { dump } from "@/lib/utils";

  export var data: Promise<unknown>;
  export var loading = "Loading..."
</script>

{#await data}
  {loading}
{:then data}
  <pre>{dump(data)}</pre>
{:catch e}
  <strong>{e}</strong>
{/await}
