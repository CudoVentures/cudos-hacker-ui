<script lang="ts">
  import Await from "@/lib/await.svelte";
  import { Client } from "@/lib/client";
  import { dump } from "@/lib/utils";
  export var client: Client;
</script>

<Await promise="{client.tendermint.abciInfo()}" let:data>
  <pre>{dump(data)}</pre>
</Await>

<Await promise="{client.tendermint.status()}" let:data>
  <pre>{dump(data)}</pre>
</Await>
