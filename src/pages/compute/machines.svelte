<script lang="ts">
  import { Client } from "@/lib/client";
  import { Link } from "@/lib/controllers";
  import Page from "@/ui/Page.svelte";
  export let client: Client;
  export let contract_address: string;
</script>

<Page>
  {#await client.queryContractSmart(contract_address, { machine_list: { } })}
    Loading machine type list...
  {:then machines}
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>State</th>
          <th>Type</th>
          <th>Image</th>
          <!-- <th>Credit</th> -->
          <!-- <th>Provider</th> -->
          <th>Address</th>
          <th>Estimated Time Remaining</th>
        </tr>
      </thead>
      {#each machines as machine}
        <tr>
          <td>
            <!-- <Router> -->
            <Link to="../{machine.id}">{machine.id}</Link>
            <!-- </Router> -->
          </td>
          <td>{machine.state}</td>
          <td>{machine.machine_type_id}</td>
          <td>{machine.image_id}</td>
          <!-- <td>{machine.credit}</td> -->
          <!-- <td>{machine.provider}</td> -->
          {#if machine.state === "Failed"}
            <td colspan="2">{machine.reason}</td>
          {:else if machine.state === "Running"}
            <td>{machine.address}</td>
            <td>
              {#await client.queryContractSmart(contract_address, { machine_type: { id: machine.machine_type_id } }) then type}
                {#if machine.until}
                  {(
                    (parseFloat(machine.until) / 1e6 + (parseFloat(machine.credit) / parseFloat(type.acudos_per_hour)) * 60 * 60 * 1e3 - Date.now()) /
                    (1e3 * 60 * 60)
                  ).toFixed(3)} hrs
                {/if}
              {/await}
            </td>
          {/if}
          <!-- <td><pre>{dump(type)}</pre></td> -->
        </tr>
      {/each}
    </table>
  {:catch e}
    {e}
  {/await}
</Page>
