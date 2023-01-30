<script lang="ts">
  import { Client } from "@/lib/client";
  import Page from "@/ui/Page.svelte";
  import { cudos, dump } from "@/lib/utils";
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
    msg[key] = { remove: [address] };
    await client.execute(client.address!, contract_address, msg, "auto");
  }
</script>

<Page>
  <h1>Administrate Contract</h1>
  <h2>View and control permissions for contract usage</h2>
  <section>
    <h2>Authorize</h2>
    <input type="text" bind:value="{address}" />
    <button on:click="{() => add('update_admins')}">Add Admin</button>
    <button on:click="{() => add('update_users')}">Add User</button>
  </section>
  <section>
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
    <h2>Users</h2>
    {#await client.queryContractSmart(contract_address, { user_list: {} })}
      Loading users list...
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
</Page>
