<script lang="ts">
  import { Client } from "@/lib/client";
  import { dump, procure } from "@/lib/utils";
  import _ from "underscore";
  import { Type, Field } from "protobufjs";
  import { MsgMint } from "@/protos/midas/tx";
  import Page from "@/ui/Page.svelte";
  import { Task, TaskView } from "@/lib/task";
  import { Writable } from "svelte/store";

  export let client: Client;
  const contract_address = client.network.contracts.exchange!;

  interface Rate {
    denom: string;
    name: string;
    rate: string;
    exponent: number;
  }

  let data = procure(async function () {
    const rates = (await client.queryContractSmart(contract_address, {
      rate_list: {},
    })) as Rate[];
    const rateMap = _.object(rates.map((r) => [r.denom, r] as [string, Rate]));
    rateMap["acudos"] = {
      denom: "acudos",
      name: "CUDOS, the native Cudos Network token",
      rate: "1",
      exponent: 18,
    };
    return { rates, rateMap };
  });

  export let toAmount: string = "1";
  export let toDenom: string = "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858";

  client.registry?.register("/cudos.midas.MsgMint", MsgMint);

  let task = Task.none;

  async function mint() {
    task = Task.new(
      client.signAndBroadcast(
        client.address!,
        [
          {
            typeUrl: "/cudos.midas.MsgMint",
            value: MsgMint.fromPartial({
              creator: client.address!,
              recipient: client.address!,
              amount: [
                {
                  denom: toDenom,
                  amount: (Number(toAmount) * Math.pow(10, $data.rateMap[toDenom].exponent)).toFixed(),
                },
              ],
            }),
          },
        ],
        "auto"
      )
    );
  }

  // cudos-noded tx midas mint cudos1genudzpvqe2t9k64xwueua35a8kfvl3fc6uc62 --from cudos1yvtuaadhfhxf8ke7zm902z4rj382a8ayymq32s --keyring-backend test --chain-id cudos-localnet -y 1000000000ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858
</script>

<Page title="Mint tokens">
  {#await $data then data}
    {#if data}
      <section>
        <select bind:value="{toDenom}">
          {#each data.rates as rate}
            <option value="{rate.denom}">{rate.name}</option>
          {/each}
        </select>
        {data.rateMap[toDenom].name}
        <span>
          <input bind:value="{toAmount}" />
        </span>
        <button on:click="{() => mint()}">Mint</button>
        <TaskView store="{$task}" />
      </section>
    {/if}
  {:catch error}
    {error}
  {/await}
</Page>

<style lang="scss">
  section {
    gap: 0;
  }
  input,
  select,
  button {
    margin-bottom: 1rem;
  }
</style>
