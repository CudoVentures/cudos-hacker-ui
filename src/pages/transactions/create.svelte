<script lang="ts">
  import { Client } from "@/lib/client";
  import { dump } from "@/lib/utils";
  import type { UploadResult } from "@cosmjs/cosmwasm-stargate";

  export var client: Client;

  let wasm: FileList;
  let memo = "";

  var upload: Promise<UploadResult> | undefined = undefined;

  function doUpload() {
    async function helper() {
      if (!wasm[0]) throw "Must select a WASM source file";
      try {
        const wasmCode = new Uint8Array(await wasm[0].arrayBuffer());
        const result = await client.upload(
          client.address!,
          wasmCode,
          "auto",
          memo
        );
        console.log(result);
        return result;
      } catch (e: unknown) {
        console.log(e);
        throw e;
      }
    }
    upload = helper();
  }
</script>

<main>
  <h1>Upload Contract</h1>

  <h2>Memo</h2>

  <section>
    <input type="text" bind:value="{memo}" />
  </section>

  <h2>WASM source</h2>

  <section>
    <input bind:files="{wasm}" type="file" accept=".wasm" />
  </section>

  {#if upload}
    {#await upload}
      Uploading
    {:then result}
      <pre>{dump(result)}</pre>
    {:catch e}
      <pre>{dump(e)}</pre>
    {/await}
  {/if}
  <section>
    <button on:click="{doUpload}">Upload</button>
  </section>
</main>
