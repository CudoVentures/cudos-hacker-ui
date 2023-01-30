<script lang="ts">
  import { Client } from "@/lib/client";
  import Page from "@/ui/Page.svelte";
  import { cudos, dump, useModal } from "@/lib/utils";
  import Await from "../../lib/await.svelte";
  import { Task } from "@/lib/task";
  export let client: Client;
  export let contract_address: string;
  let address = client.address;
  async function add(key: string) {
    let msg: any = {};
    msg[key] = { add: [address] };
    await client.execute(client.address!, contract_address, msg, "auto");
  }
  async function remove(key: string, address: string) {
    let msg: any = {};
    msg[key] = { del: [address] };
    await client.execute(client.address!, contract_address, msg, "auto");
  }

  let exchangeRateInput: HTMLInputElement;

  const modal = useModal();
  async function updateExchangeRate() {
    Task.new(modal, client.execute(client.address!, contract_address, { update_exchange_rate: { rate: exchangeRateInput.value } }, "auto"));
  }

  let machine_id = ""
  let new_machine_id = ""
  let pay = client.address!

  let reason = ""
  let ip = ""
  let new_state = null as null | string

  async function delete_vm(id: string, pay: string) {
    Task.new(modal, client.execute(client.address!, contract_address, { delete_machine: { id, pay } }, "auto"));
  }

  async function rename_vm(id: string, new_id: string) {
    Task.new(modal, client.execute(client.address!, contract_address, { rename_machine: { id, new_id } }, "auto"));
  }

  async function override_vm() {
    Task.new(modal, client.execute(client.address!, contract_address, {
      override_machine: {
        id: machine_id,
        state: new_state,
        address: ip === "" ? null : ip,
        reason: reason === "" ? null : reason,
      }
    }, "auto"));
  }
</script>

<Page>
  <h1>Administer Compute</h1>
  
  <h2>Override a VM</h2>
  <section>
    <input type="text" bind:value="{machine_id}" placeholder="Machine ID" />
    <select bind:value={new_state}>
      <option value={null}>Unchanged</option>
      <option value="StartRequested">StartRequested</option>
      <option value="Running">Running</option>
      <option value="RestartRequested">RestartRequested</option>
      <option value="StopRequested">StopRequested</option>
      <option value="Stopped">Stopped</option>
      <option value="Finished">Finished</option>
      <option value="Failed">Failed</option>
    </select>
    <input type="text" bind:value="{reason}" placeholder="Reason" />
    <input type="text" bind:value="{ip}" placeholder="IP Address" />
    <button on:click="{() => override_vm()}">Override</button>
  </section>

  <h2>Delete a VM</h2>
  <section>
    <input type="text" bind:value="{machine_id}" />
    <input type="text" bind:value="{pay}" />
    <button on:click="{() => delete_vm(machine_id, pay)}">Delete</button>
  </section>

  <h2>Rename a VM</h2>
  <section>
    <input type="text" bind:value="{machine_id}" />
    <input type="text" bind:value="{new_machine_id}" />
    <button on:click="{() => rename_vm(machine_id, new_machine_id)}">Rename</button>
  </section>

  <h2>View and control permissions for contract usage</h2>
  <section>
    <h2>Authorize</h2>
    <input type="text" bind:value="{address}" />
    <button on:click="{() => add('update_admins')}">Add Admin</button>
    <button on:click="{() => add('update_consumers')}">Add Consumer</button>
    <button on:click="{() => add('update_providers')}">Add Provider</button>
  </section>
  <section>
    <h2>Exchange Rate</h2>
    <Await let:data promise="{client.queryContractSmart(contract_address, { exchange_rate: {} })}">
      <input value="{data}" bind:this="{exchangeRateInput}" /><button on:click="{updateExchangeRate}">Update</button>
    </Await>
    <h2>Admins</h2>
    {#await client.queryContractSmart(contract_address, { admin_list: {} })}
      Loading admin list...
    {:then addresses}
      <table>
        {#each addresses as address}
          <tr>
            <td>{address}</td>
            <td><button on:click="{() => remove('update_admins', address)}">Remove</button></td>
          </tr>
        {/each}
      </table>
    {:catch e}
      {e}
    {/await}
  </section>
  <section>
    <h2>Consumers</h2>
    {#await client.queryContractSmart(contract_address, { consumer_list: {} })}
      Loading consumers list...
    {:then addresses}
      <table>
        {#each addresses as address}
          <tr>
            <td>{address}</td>
            <td><button on:click="{() => remove('update_consumers', address)}">Remove</button></td>
          </tr>
        {/each}
      </table>
    {:catch e}
      {e}
    {/await}
  </section>
  <section>
    <h2>Providers</h2>
    {#await client.queryContractSmart(contract_address, { provider_list: {} })}
      Loading providers list...
    {:then addresses}
      <table>
        {#each addresses as address}
          <tr>
            <td>{address}</td>
            <td><button on:click="{() => remove('update_providers', address)}">Remove</button></td>
          </tr>
        {/each}
      </table>
    {:catch e}
      {e}
    {/await}
  </section>
</Page>
