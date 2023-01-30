<script lang="ts">
  import { dump, procure } from "@/lib/utils";
  import { Client } from "@/lib/client";
  import Page from "@/ui/Page.svelte";
  import * as cudos from "cudosjs";

  export let client: Client;
  export let id: string;

  const data = procure(async () => {
    return {
      block: await client.getBlock(parseInt(id)),
    };
  });
</script>

<Page title="Block {id}">
  {#await $data then data}{#if data}
      {#each data.block.txs as rawTx}
        {#each [cudos.decodeTxRaw(rawTx)] as tx}
          <pre>{dump(tx.authInfo.fee?.amount)}</pre>
        {/each}
      {/each}
    {/if}
  {/await}
</Page>
