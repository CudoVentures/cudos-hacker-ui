<script lang="ts">
  import { Client } from "@/lib/client";
  import { dump } from "@/lib/utils";
  export let client: Client;

  async function prepare() {
    return {
    }
  }

</script>

<main>
  {#await prepare()}
    Loading...
  {:then data}
    <pre>{dump(data)}</pre>
  {:catch e}
    {e}
  {/await}
</main>
