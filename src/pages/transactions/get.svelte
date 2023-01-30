<script lang="ts">
  import { dump } from "@/lib/utils";
  import PropertyList from "@/ui/PropertyList.svelte";
  import Property from "@/ui/Property.svelte";
  import { Contract } from "@/lib/testbed/contract";
  import { object } from "underscore";
  import { Client } from "@/lib/client";
  import { Link } from "@/lib/controllers";

  export let client: Client;
  export let id: string;

  const explanations: Record<string, string> = {
    interface_version_8:
      "Does nothing, but indicates that this contract supports the v8 CosmWasm interface",
    allocate: "Allocates memory, for the runtime to fill with data",
    deallocate: "Deallocates memory returned by allocate",
    instantiate: "Invoked after contract instantiation",
    execute: "Invoked to process execute messages",
    migrate: "Invoked after contract is migrated to new code",
    query: "Invoked to process queries",
    reply: "Invoked to handle response from a submessage",
    sudo: "Invoked by privileged Cosmos modules, usually governance",
    ibc_channel_open: "",
    ibc_channel_connect: "",
    ibc_channel_close: "",
    ibc_packet_receive: "",
    ibc_packet_ack: "",
    ibc_packet_timeout: "",
  };
</script>

<nav><Link to="">{id}</Link></nav>

<main>
  {#await client.getCodeDetails(parseInt(id)) then details}
    <PropertyList>
      <Property label="Checksum">{details.checksum}</Property>
      <Property label="Creator">{details.creator}</Property>
    </PropertyList>
    <section>
      {#await Contract.make(undefined, details.data, "") then contract}
        <h2>Supported features</h2>
        <ul>
          {#if contract.exports.instantiate}<li>Instantiation</li>{/if}
          {#if contract.exports.migrate}<li>Migration</li>{/if}
          {#if contract.exports.execute}<li>Execution</li>{/if}
          {#if contract.exports.query}<li>Queries</li>{/if}
          {#if contract.exports.sudo}<li>Governance</li>{/if}
          {#if contract.exports.ibc_packet_ack}<li>IBC</li>{/if}
        </ul>
        <h2>Exported names</h2>
        <table>
          <tr><th>Name</th><th>Object</th></tr>
          {#each Object.entries(contract.instance.exports) as [key, value]}
            <tr>
              <td>{key}</td>
              <td>
                {#if undefined === value}
                  Undefined
                {:else if "function" === typeof value}
                  Function
                {:else if value.constructor === WebAssembly.Global}
                  Global
                {:else if value.constructor === WebAssembly.Memory}
                  Memory
                {:else if value.constructor === WebAssembly.Table}
                  Table
                {/if}
              </td>
            </tr>
          {/each}
        </table>
      {/await}
    </section>
  {/await}
</main>
