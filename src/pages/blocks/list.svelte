<script lang="ts">
  import { BaseAccount, ModuleAccount, omniClient } from "@/lib/omniclient";
  import Long from "long";
  import { cudos, dump } from "@/lib/utils";
  import { known } from "@/lib/facts";
  import { Client } from "@/lib/client";
  import { Link } from "@/lib/controllers";
  import { times } from "underscore";
  import Account from "../cosmos/Account.svelte";
  import Lazy from "svelte-lazy";
  import { decodeTxRaw } from "@cosmjs/proto-signing";
  export var client: Client;
  export let omni = client.omni;
  let nullKey = Uint8Array.from([]);
  let offset = 0;

  async function block(height?: number) {
    return await (height
      ? await omni.tm.GetBlockByHeight({ height: new Long(height) })
      : await omni.tm.GetLatestBlock({})
    ).block!;
  }

  async function heights(from: number, to: number) {
    const height = await client.getHeight();
    if (from < 0) from += height + 1;
    if (to < 0) to += height + 1;
    const result = [];
    if (to < from) {
      for (let height = to; height > from; --height) result.push(height);
    } else {
      for (let height = from; height < to; ++height) result.push(height);
    }
    return result;
  }

  let lastHeight = undefined as undefined | number;
  let speed = undefined as undefined | number;

  async function ping() {
    const b0 = await block();
    console.log(b0);
    const thisTime = Number(b0.header!.height);
    if (lastHeight) speed = thisTime - lastHeight;
    lastHeight = thisTime;
  }

  setInterval(ping, 1000);
</script>

{#key speed}
  {speed}
{/key}

<main>
  <h2>Blocks</h2>
  {#await heights(-20, -1) then heights}
    <table>
      {#each heights as height}
        <tr>
          <td>
            {height}
          </td>
          {#await block(height) then block}
            <td>
              <!-- {block.header?.dataHash} -->
              <!-- {block.header?.appHash} -->
              <!-- {block.header?.chainId} -->
              <!-- {block.header?.consensusHash} -->
              <!-- {block.header?.evidenceHash} -->
              <!-- {block.header?.height} -->
              <!-- {block.header?.lastBlockId?.hash} -->
              <!-- {block.header?.lastCommitHash} -->
              <!-- {block.header?.lastResultsHash} -->
              <!-- {block.header?.nextValidatorsHash} -->
              <!-- {block.header?.proposerAddress} -->
              {new Date(Number(block.header?.time?.seconds) * 1000)}
              {block.header?.time?.nanos}
              <!-- {block.header?.validatorsHash} -->
              <!-- {block.header?.version?.app} -->
              <!-- {block.header?.version?.block} -->
            </td>
          {/await}
        </tr>
      {/each}
    </table>
  {/await}
</main>
