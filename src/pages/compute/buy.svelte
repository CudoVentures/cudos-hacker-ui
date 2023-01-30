<script lang="ts">
  import Page from "@/ui/Page.svelte";
  import { Client } from "@/lib/client";
  import { cudos, randomId, useModal } from "@/lib/utils";
  import _ from "underscore";
  import { generateSlug } from "random-word-slugs";
  import { Task, TaskView } from "@/lib/task";
  import Big from "big.js";

  export let client: Client;

  export let contract_address: string;

  let machine_suffix = randomId();
  let machine_name = generateSlug();
  let machine_description = "";
  let image_id = "alpine-linux-314";
  let machine_type_id = null as string | null;
  let startup_script = "";
  let funding = 1;
  let ssh_key = localStorage.getItem("lastSshKey");
  $: machine_id = `${machine_name}-${machine_suffix}`;
  // "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPpaponfU4HAhbk9Kij7wrC9ORkmRhhqBLQAp+51qf44";

  let durations = {
    "One minute": 1.0 / 60,
    "One hour": 1,
    "One day": 24,
    "One month": 24 * 30.347,
    "One year": 24 * 365.2425,
  };

  async function prepare() {
    const rate = Big(10)
      .pow(18)
      .div(
        (await client.queryContractSmart(contract_address, {
          exchange_rate: {},
        })) as string
      );
    return {
      images: await client.queryContractSmart(contract_address, {
        image_list: {},
      }),
      types: (
        await client.queryContractSmart(contract_address, {
          machine_type_list: {},
        })
      ).map((type) => ({
        ...type,
        display() {
          const parts = [
            `${type.cpu_count} CPUs`,
            `${type.gpu_count} GPUs`,
            `${type.memory_gb} RAM`,
            `${type.storage_gb} HDD`,
            `${type.region}`,
            `${cudos(type.acudos_per_hour)} CUDOS/hr`,
            `${Big(type.acudos_per_hour)
              .div(rate)
              .toFixed(2)} USD/hr`,
          ];
          return parts.join(" ");
        },
      })),
      type(id: string) {
        console.log([this.types, id]);
        return this.types.find((t: any) => t.id === id);
      },
      exchange_rate: rate,
    };
  }

  let data = prepare();

  function msg() {
    if (!machine_type_id || !image_id) return null;
    return {
      order_machine: {
        id: machine_id,
        description: machine_description,
        image_id,
        machine_type_id,
        ssh_key,
        script: startup_script,
      },
    };
  }

  const modal = useModal();

  async function order() {
    localStorage.setItem("lastSshKey", ssh_key ?? "");
    Task.new(
      modal,
      client.execute(
        client.address!,
        contract_address,
        msg()!,
        "auto",
        undefined,
        [
          {
            denom: "acudos",
            amount: BigInt(funding * 1e18).toString(),
          },
        ]
      )
    );
  }
</script>

<Page title="Buy Virtual Machine">
  {#await data then data}
    <section>
      <span>
        <label for="ssh_key">SSH Key</label>
        <input name="ssh_key" bind:value="{ssh_key}" />
      </span>
      <span>
        <label for="machine_name">Machine ID</label>
        <input name="machine_name" bind:value="{machine_name}" />
        -{machine_suffix}
      </span>
      <span>
        <label for="machine_description">Description</label>
        <input name="machine_description" bind:value="{machine_description}" />
      </span>
      <span>
        <strong>Machine Type</strong>
        <select name="machine_type_id" bind:value="{machine_type_id}">
          {#each _.sortBy(data.types, (t) => BigInt(t.acudos_per_hour)) as type}
            <option value="{type.id}">{type.display()}</option>
          {/each}
        </select>
        <!-- <select bind:value="{machine_type_id}"> -->
        <!-- <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap">
          {#each _.sortBy(data.types, (t) => BigInt(t.acudos_per_hour)) as type}
            <label class="selectable" class:selected="{machine_type_id === type.id}" style="display: flex; gap: 1ch; align-items: center; flex-wrap: wrap">
              <input type="radio" bind:group="{machine_type_id}" value="{type.id}" />
              <div style="width: 6rem">{type.cpu_count} CPUs</div>
              <div style="width: 6rem">{type.gpu_count} GPUs</div>
              <div style="width: 6rem">{type.memory_gb} RAM</div>
              <div style="width: 6rem">{type.storage_gb} HDD</div>
              <div style="width: 6rem">{type.region}</div>
              <div style="width: 10rem">
                {cudos(type.acudos_per_hour)} CUDOS/hr
              </div>
              <div style="width: 10rem">
                {Big(type.acudos_per_hour).div(data.exchange_rate).toFixed(2)} USD/hr
              </div>
            </label>
          {/each}
        </div> -->
      </span>
      <!-- </select> -->
      <label for="image_id">OS Image</label>
      <select name="image_id" bind:value="{image_id}">
        {#each data.images as image}
          <option value="{image.id}">{image.id}</option>
        {/each}
      </select>
      <label for="image_id">Startup Script</label>
      <textarea bind:value="{startup_script}"></textarea>
      <label for="funding">Initial Funding</label>
      <div style="display: flex; align-items: center; gap: 1ex">
        <input name="funding" bind:value="{funding}" type="number" step="0.1" />
        CUDOS
      </div>
      <!-- <section>
      <label>Run Duration</label>
      <input bind:value="{duration}" type="number" step="0.1" /> hours
    </section> -->
      <!-- <section>
      <label>Projected Cost</label>
      {#if data.type}
        {((parseFloat(data.type.acudos_per_hour) * duration) / 1e18).toFixed(3)}
        CUDOS (
        {thousands(
          (parseFloat(data.type.acudos_per_hour) * duration).toFixed(0)
        )}
        aCUDOS )
        {#if duration > 24}
          <p></p>
        {/if}
      {:else}
        <em>Select a machine type to see the projected cost.</em>
      {/if}
    </section> -->
      <p>
        {#if machine_type_id}
          <strong>Projected Duration</strong>
          {(
            (funding * 1e18) /
            parseFloat(data.type(machine_type_id).acudos_per_hour)
          ).toFixed(3)}
          hours
          <section class="note">
            The price of compute resources may go up or down over time. This
            duration is an estimate based on current pricing. The actual
            duration may be different.
          </section>
          <button on:click="{order}">Order</button>
        {:else}
          <em>Select a machine type to continue.</em>
        {/if}
      </p>
    </section>
    <!-- {#if msg()}
      <section>
        <pre>docker exec cudos_blast_node \
  cudos-noded tx wasm execute \
    {contract_address} \
    '{JSON.stringify(msg())}' \
    --amount {BigInt(funding * 1e18)}acudos \
    --chain-id {client.chainId} \
    --from account1 \
    --keyring-backend test \
    --gas auto \
    --gas-prices {client.network.gasPrice} \
    --gas-adjustment 1.4 \
    --yes
</pre>
      </section>
    {/if} -->
  {/await}
</Page>

<style lang="scss">
  label.selectable {
    padding: 1rem;
    border: 1px solid #eaeaeb;
    border-radius: 8px;
    &:hover {
      background: #eaeaeb;
    }
    &.selected {
      border: 1px solid #00f;
    }
  }
</style>
