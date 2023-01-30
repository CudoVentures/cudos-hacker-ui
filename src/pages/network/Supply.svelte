<script lang="ts">
  import { Client } from "@/lib/client";
  import { dump, poll, thousands } from "@/lib/utils";
  export let client: Client;

  const data = poll(async () => ({
    totalSupply: await Promise.all(
      (
        await client.omni.bank.TotalSupply({})
      ).supply.map(async (supply) => {
        if (supply.denom.startsWith("ibc/")) {
          const hash = supply.denom.split("/")[1];
          return {
            ...supply,
            ...(await client.omni.ibc.transfer.DenomTrace({ hash: hash }))
              .denomTrace,
            type: "ibc",
          };
        } else {
          return { ...supply, baseDenom: supply.denom, type: "native" };
        }
      })
    ),
  }));
</script>

<main>
  <h1>Supply</h1>
  <h2>Total</h2>
  {#if $data}
    <table>
      <thead
        ><tr>
          <th>Type</th>
          <th>Denom</th>
          <th align="right">Amount</th>
          <th>IBC Path</th>
        </tr></thead>
      {#each $data.totalSupply as supply}
        <tr>
          <td>{supply.type}</td>
          <td>{supply.baseDenom}</td>
          <td align="right">{thousands(supply.amount)}</td>
          <td>{supply.path ?? "-"}</td>
        </tr>
      {/each}
    </table>
  {/if}
</main>
