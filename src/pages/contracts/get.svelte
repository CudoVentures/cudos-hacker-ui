<script lang="ts">
  import { Client } from "@/lib/client";
  import { Task } from "@/lib/task";
  import { dump, useModal } from "@/lib/utils";
  import Page from "@/ui/Page.svelte";
  import Property from "@/ui/Property.svelte";
  import PropertyList from "@/ui/PropertyList.svelte";

  export var client: Client;
  export let id: string;

  let address = id;
  let code_id = null as null | number;

  let wasm: FileList;
  let memo = "";
  let migrate_msg = "{}";

  async function doUpload() {
    if (!wasm[0]) throw "Must select a WASM source file";
    const wasmCode = new Uint8Array(await wasm[0].arrayBuffer());
    const result = await client.upload(client.address!, wasmCode, "auto", memo);
    code_id = result.codeId;
    return result;
  }

  async function doMigrate() {
    if (code_id == null) throw new Error("code_id not selected");
    const result = await client.migrate(
      client.address!,
      address,
      code_id,
      JSON.parse(migrate_msg),
      "auto"
    );
    console.log(result);
    return result;
  }
  // cudos1m4kxqu2fhh0z0af5jlkhhy7e0qlanxkhvt074v
  let modal = useModal();

  function doUpgrade() {
    Task.new(modal, async (t) => {
      if (wasm.length > 0) {
        t.status = "Uploading";
        t.post(await doUpload());
      }
      t.status = "Migrating";
      t.post(await doMigrate());
    });
  }

  let newAdmin = "";
  function doChangeAdmin() {
    Task.new(modal, async (t) => {
      t.post(
        await client.updateAdmin(client.address!, address, newAdmin, "auto")
      );
    });
  }
</script>

<Page>
  <h1>Contract {address}</h1>
  <h2>A contract instance</h2>

  {#await client.getContract(address) then contract}
    <pre>{dump(contract)}</pre>
  {/await}

  <section>
    <h1>Balance</h1>

    {#await client.getAllBalances(address) then balances}
      {#if balances.length > 0}
        <ul>
          {#each balances as balance}
            <li>{balance.amount}{balance.denom}</li>
          {/each}
        </ul>
      {:else}
        This contract isn't holding any coins.
      {/if}
    {/await}
  </section>

  <section>
    <h1>Status</h1>
    <PropertyList>
      {#await client.omni.wasm.ContractInfo({ address }) then info}
        <Property label="Code ID" value="{info.contractInfo?.codeId}" />
      {/await}
    </PropertyList>
  </section>

  <section>
    <h1>Change Admin</h1>
    <input type="text" bind:value="{newAdmin}" placeholder="Admin address" />
    <div>
      <button on:click="{doChangeAdmin}">Change</button>
    </div>
  </section>

  <section>
    <h1>Upgrade</h1>
    <textarea bind:value="{migrate_msg}"></textarea>
    <input bind:files="{wasm}" type="file" accept=".wasm" />
    <div>
      <button on:click="{doUpgrade}">Upgrade</button>
    </div>
  </section>
</Page>
