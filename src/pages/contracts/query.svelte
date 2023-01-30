<script lang="ts">
  import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
  import type {
    CosmWasmClient,
    InstantiateOptions,
    InstantiateResult,
    SigningCosmWasmClient,
    UploadResult,
  } from "@cosmjs/cosmwasm-stargate";
  import { toBase64 } from "@cosmjs/encoding";
  import { Client } from "@/lib/client";

  export var client: Client;

  var address =
    "cudos1c676xpc64x9lxjfsvpn7ajw2agutthe75553ws45k3ld46vy8ptsg9e9ez";
  var query_msg_json = "{}";

  var querying = false;
  var queried = false as false | InstantiateResult;
  var failed: any;

  async function upload() {
    querying = true;
    failed = "";
    try {
      const result = await client.queryContractSmart(
        address,
        JSON.parse(query_msg_json)
      );
      console.log(result);
      queried = result;
    } catch (e: unknown) {
      failed = e.message;
    } finally {
      querying = false;
    }
  }
</script>

<h1>Query Contract</h1>

<h2>Contract address</h2>

<div>
  <input bind:value="{address}" />
</div>

<h2>Query message</h2>

<div>
  <textarea cols="80" rows="10" bind:value="{query_msg_json}"></textarea>
</div>

{#if querying}
  <div>Uploading</div>
{:else}
  <div>
    <button on:click="{upload}" disabled="{querying || !!queried}"
      >Upload</button>
  </div>
  {#if !!failed}
    <div>
      {JSON.stringify(failed)}
    </div>
  {:else if !!queried}
    <div>Instantiated contract at {queried.contractAddress}</div>
    <div>
      {queried.gasUsed}/{queried.gasWanted}
    </div>
    <div>
      {queried.transactionHash} @
      {queried.height}
    </div>
    {#each queried.logs as log}
      {log.log}
      {#each log.events as event}
        <pre>{JSON.stringify(event, null, 2)}</pre>
      {/each}
    {/each}
  {/if}
{/if}
