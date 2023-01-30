<script lang="ts">
  import { Client } from "@/lib/client";
  import { cudos, useModal } from "@/lib/utils";
  import Property from "@/ui/Property.svelte";
  import PropertyList from "@/ui/PropertyList.svelte";
  import Page from "@/ui/Page.svelte";
  import { Task } from "@/lib/task";

  export let client: Client;
  export let contract_address: string;
  export let id: string;

  let topUp = 0;

  let description = null as string | null;

  $: data = (async function () {
    const data: any = {};
    data.machine = await client.queryContractSmart(contract_address, { machine: { id }, });
    data.type = await client.queryContractSmart(contract_address, {
      machine_type: { id: data.machine.machine_type_id },
    });
    data.image = await client.queryContractSmart(contract_address, {
      image: { id: data.machine.image_id },
    });
    if (description === null)
      description = data.machine.description;
    return data;
  })();

  const modal = useModal();

  async function disown(id: string) {
    Task.new(modal, client.execute(client.address!, contract_address, { disown_machine: { id } }, "auto"));
  }

  async function restart(id: string) {
    Task.new(modal, client.execute(client.address!, contract_address, { request_machine_restart: { id } }, "auto"));
  }

  async function stop(id: string) {
    Task.new(modal, client.execute(client.address!, contract_address, { request_machine_stop: { id } }, "auto"));
  }

  async function start(id: string) {
    Task.new(modal, client.execute(client.address!, contract_address, { request_machine_start: { id } }, "auto"));
  }

  async function describe(id: string) {
    Task.new(modal, client.execute(client.address!, contract_address, { describe_machine: { id, description } }, "auto"));
  }

  async function add_credit(id: string) {
    Task.new(
      modal,
      client.execute(
        client.address!,
        contract_address,
        {
          fund_machine: { id },
        },
        "auto",
        undefined,
        [
          {
            denom: "acudos",
            amount: (topUp * 1e18).toFixed(0),
          },
        ]
      )
    );
  }
</script>

{#await data then data}
  <Page>
    <h1>Virtual Machine {data.machine.id}</h1>
    <h2>A virtual machine on the chain</h2>
    <section>
      <PropertyList>
        <Property label="ID" value="{data.machine.id}" />
        <Property label="Description" value="{data.machine.description}" />
        <Property label="State" value="{data.machine.state}" />
        <Property label="Credit" value="{cudos(data.machine.credit)}" />
        <Property label="SSH Key" value="{data.machine.ssh_key}" />
        <Property label="Image" value="{data.image.name}" />
        <Property label="Price (CUDOS/hr)" value="{cudos(data.type.acudos_per_hour)}" />
        <Property label="CPUs" value="{data.type.cpu_count}" />
        <Property label="GPUs" value="{data.type.gpu_count}" />
        <Property label="RAM (GB)" value="{data.type.memory_gb}" />
        <Property label="Storage (GB)" value="{data.type.storage_gb}" />
        <Property label="Owner Address" value="{data.machine.owner}" />
        <Property label="Provider Address" value="{data.machine.provider}" />
        <Property label="Machine Address" value="{data.machine.address}" />
        <Property label="Next Billing Cycle" value="{data.machine.until ? new Date(parseFloat(data.machine.until) / 1e6) : 'Never'}" />
        <Property label="Startup Script" value="{data.machine.startup_script}" />
        <Property label="Reason" value="{data.machine.reason}" />
        <Property
          label="Estimated Stop Time"
          value="{data.machine.until
            ? new Date(parseFloat(data.machine.until) / 1e6 + (parseFloat(data.machine.credit) / parseFloat(data.type.acudos_per_hour)) * 60 * 60 * 1e3)
            : 'Immediately'}" />
      </PropertyList>
    </section>
    <section>
      <div>
        <input bind:value={description}/>
      </div>
      <div>
        <button on:click="{() => describe(data.machine.id)}">Describe</button>
      </div>
    </section>
    <section>
      <div>
        <button on:click="{() => disown(data.machine.id)}">Disown</button>
      </div>
      <p>
        Disowning the machine refunds all remaining credits to your account. The provider will delete the machine at least at the next billing cycle. It will no
        longer appear on your machine list.
      </p>
    </section>
    <section>
      <div>
        <button on:click="{() => start(data.machine.id)}">Start</button>
        <button on:click="{() => stop(data.machine.id)}">Stop</button>
        <button on:click="{() => restart(data.machine.id)}">Restart</button>
      </div>
    </section>
    <section>
      <div>
        <input type="number" bind:value="{topUp}" /> CUDOS
        <p>
          <button on:click="{() => add_credit(data.machine.id)}">Add Credit</button>
        </p>
      </div>
    </section>
  </Page>
{/await}
