<script lang="ts">
  import { Client } from "@/lib/client";
  import { Task, TaskView } from "@/lib/task";
  import { useModal } from "@/lib/utils";
  import Page from "@/ui/Page.svelte";
  import Property from "@/ui/Property.svelte";
  import PropertyList from "@/ui/PropertyList.svelte";
  import { InstantiateOptions } from "cudosjs";
  import { getContext } from "svelte";

  export var client: Client;
  // export let id: string;
  // let address = id;

  let code_id = null as null | number;
  let wasm: FileList;
  let memo = "";
  var label = "";
  var init_msg_json = "{}";
  var admin = client.address;
  var funds = "";

  $: suggested_label = (wasm && wasm[0] && wasm[0].name.split(".")[0]) ?? "";

  async function doUpload() {
    const wasmCode = new Uint8Array(await wasm[0].arrayBuffer());
    const result = await client.upload(client.address!, wasmCode, "auto", memo);
    code_id = result.codeId;
    return result;
  }

  async function doInstantiate() {
    if (code_id == null) throw new Error("code_id not selected");
    let opts: InstantiateOptions = { admin, memo };
    if (funds && funds !== "")
      opts = { funds: [{ amount: funds, denom: "acudos" }], ...opts };
    let theLabel = label === "" ? suggested_label : label;
    const result = await client.instantiate(
      client.address!,
      code_id,
      JSON.parse(init_msg_json),
      theLabel,
      "auto",
      opts
    );
    return result;
  }

  let modal = useModal();

  async function doDeploy() {
    Task.new(modal, async (t) => {
      if ((!wasm || !wasm[0]) && !code) throw "Code or WASM module is required";
      if (!init_msg_json || init_msg_json === "") init_msg_json = "{}";
      try {
        JSON.parse(init_msg_json);
      } catch (e) {
        throw `Initialize message does not look like JSON: ${e}`;
      }
      if (!code) {
        t.status = "Uploading";
        await doUpload();
      }
      code_id = code;
      t.status = "Instantiating";
      await doInstantiate();
    });
  }

  export let code: null | number = null;
</script>

<Page>
  <h1>Deploy contract</h1>

  <section>
    <x-hbox>
      <div>
        <h2>Code</h2>
        {#await client.getCodes() then codes}
          <select bind:value="{code}">
            <option value="{null}">(Upload)</option>
            {#each codes as code}
              <option value="{code.id}">{code.id} ({code.checksum})</option>
            {/each}
          </select>
        {/await}
      </div>
      {#if code === null}
        <div>
          <h2>WASM module</h2>
          <input bind:files="{wasm}" type="file" accept=".wasm" />
        </div>
      {/if}
    </x-hbox>

    <x-hbox>
      <div>
        <h2>Label</h2>
        <input bind:value="{label}" placeholder="{suggested_label}" />
      </div>
      <div>
        <h2>Initial funding* (acudos)</h2>
        <input bind:value="{funds}" />
      </div>
      <div>
        <h2>Memo*</h2>
        <input bind:value="{memo}" />
      </div>
    </x-hbox>

    <!-- <h2>Code ID</h2>
    <div>
      <input bind:value="{code_id}" type="number" />
    </div> -->

    <!-- <h2>Admin address (optional)</h2>
    <div>
      <input bind:value="{admin}" />
    </div> -->

    <div>
      <h2>Initialize message (JSON)</h2>
      <textarea cols="80" rows="10" bind:value="{init_msg_json}"></textarea>
    </div>

    <div>
      <button on:click="{doDeploy}">Deploy</button>
    </div>

    <!-- <TaskView task="{$task}" /> -->
  </section>
</Page>

<style lang="scss">
  x-hbox {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
</style>
