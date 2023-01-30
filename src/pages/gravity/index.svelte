<script lang="ts">
  import { dump } from "@/lib/utils";
  import { Client } from "@/lib/client";
  import Long from "long";
  export var client: Client;

  async function gravity() {
    return [
      await client.omni.gravity.getCurrentValset(),
      await client.omni.gravity.getAttestations(new Long(1)),
    ];
  }
</script>

<main>
  {#await gravity() then gravity}
    <pre>{dump(gravity)}</pre>
  {:catch e}
    {e}
  {/await}
</main>
