<script lang="ts">
  import { Client } from "@/lib/client";
  import { omniClient } from "@/lib/omniclient";
  import { cudos, dump, thousands } from "@/lib/utils";
  import { Coin } from "@cosmjs/amino";
  import { identity, map, times } from "underscore";
  import Account from "../cosmos/Account.svelte";
  export let client: Client;
  let address = "cudos1vfgc45smrr5vuydzqvv0w8vc2gknxm9z9xf5yg";

  async function balance(height: number) {
    const result = await fetch(
      `${client.network.urls.rest}/bank/balances/${address}?height=${height}`
    );
    const data = await result.json();
    return data.result as Coin[];
  }

  async function change(from: number, to: number) {
    const was = await balance(from);
    const now = await balance(to);
    const change: Record<string, bigint> = {};
    was.forEach((coin) => (change[coin.denom] ||= BigInt(0)));
    now.forEach((coin) => (change[coin.denom] ||= BigInt(0)));
    was.forEach((coin) => (change[coin.denom] -= BigInt(coin.amount)));
    now.forEach((coin) => (change[coin.denom] += BigInt(coin.amount)));
    return map(change, (amount, key) => ({
      denom: key,
      amount: amount.toString(),
    })) as Coin[];
  }

  async function getHeight() {
    let height = await client.getHeight();
    // height -= height % 100;
    return height;
  }

  const txPromise = client.getTx(
    "C68AA0C702F6FB662A50E5B9DD017C5B3E77465501AFB583A573091DA807C9A4"
  );
</script>

<main>
  <!-- {#await txPromise then tx}
    {dump(tx)}
  {/await} -->
  {#await 1348010 then height}
    <table>
      {#each times(100, identity) as i}
        {#await change(height + i * 1, height + (i + 1) * 1) then result}
          <tr>
            <td>{thousands(height + i * 1)}</td>
            <td>{thousands(height + (i + 1) * 1)}</td>
            <td>{cudos(result[0].amount)}</td>
          </tr>
        {:catch e}
          <!-- {e} -->
        {/await}
      {/each}
    </table>
  {/await}
</main>

4000000000000000000 1200000000000000000000 000000000000000000
