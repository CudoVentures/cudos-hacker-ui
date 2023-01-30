<script lang="ts">
  import Await from "@/lib/await.svelte";
  import { Client } from "@/lib/client";
  import { cudos, dump } from "@/lib/utils";
  import Page from "@/ui/Page.svelte";
  import Big from "big.js";
  import { orderBy, sortBy } from "lodash";
  export let client: Client;
  export let contract_address: string;
  let data = (async function () {
    const exchange_rate = (await client.queryContractSmart(contract_address, {
      exchange_rate: {},
    })) as string;
    const types = (await client.queryContractSmart(contract_address, {
      machine_type_list: {},
    })) as any[];
    return {
      types,
      exchange_rate: Big(10).pow(18).div(Big(exchange_rate)),
    };
  })();

  function dollars(acudos: any, rate: any) {
    return Big(acudos).div(rate).toFixed(3);
  }
</script>

<Page title="Machine Types">
  <Await promise="{data}" let:data>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Region</th>
          <th align="right">Avail.</th>
          <th align="right">CPUs</th>
          <th align="right">GPUs</th>
          <th align="right">RAM</th>
          <th align="right">Disk</th>
          <th align="right">Price/day</th>
          <th align="right">Fees/day</th>
          <th align="right">Fee Proportion</th>
          <th align="right">Apparent $/mo</th>
          <th align="right">Real $/mo</th>
        </tr>
      </thead>
      {#each sortBy(data.types, (t) => Number(t.acudos_per_hour)) as type}
        {type.acudos_per_hour *= 24, ""}
        <tr>
          <td>{type.id}</td>
          <td>{type.region}</td>
          <td align="right">{type.available}</td>
          <td align="right">{type.cpu_count}</td>
          <td align="right">{type.gpu_count}</td>
          <td align="right">{type.memory_gb}</td>
          <td align="right">{type.storage_gb}</td>
          <td align="right">{cudos(type.acudos_per_hour)}</td>
          <td align="right">{cudos("1118605000000000000")}</td>
          <td align="right">
            {Big("111860500000000000000")
              .div(Big(type.acudos_per_hour))
              .toFixed(1)}%
          </td>
          <td align="right">
            {dollars(
              BigInt(type.acudos_per_hour) * BigInt(30),
              data.exchange_rate
            )}
          </td>
          <td align="right">
            {dollars(
              (BigInt(type.acudos_per_hour) - BigInt("1118605000000000000")) * BigInt(30),
              data.exchange_rate
            )}
          </td>
          <!-- <td align=right>{cudos(BigInt(type.acudos_per_hour) - (BigInt("1118605000000000000")))}</td>
          <td align=right>{dollars("1118605000000000000", data.exchange_rate)}</td>
          <td align=right>{dollars(BigInt(type.acudos_per_hour) - (BigInt("1118605000000000000")), data.exchange_rate)}</td> -->
        </tr>
      {/each}
    </table>
  </Await>
</Page>
