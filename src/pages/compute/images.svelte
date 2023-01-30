<script lang="ts">
  import { Client } from "@/lib/client";
  import Page from "@/ui/Page.svelte";
  export let client: Client;
  export let contract_address: string;
</script>

<Page>
  {#await client.queryContractSmart(contract_address, { image_list: {} })}
    Loading image list...
  {:then images}
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Size</th>
        </tr>
      </thead>
      {#each images as image}
        <tr>
          <td>{image.id}</td>
          <td>{image.name}</td>
          <td>{image.description}</td>
          <td>{image.size / 1e9} GB</td>
        </tr>
      {/each}
    </table>
  {:catch e}
    {e}
  {/await}
</Page>
