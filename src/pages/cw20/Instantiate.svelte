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

  $: lookup_account = client.address;

  var code_id = "";
  var label = "My CW20 token";
  var memo = "";
  var admin = "";
  var funds = "";

  var instantiating = false;
  var instantiated = false as false | InstantiateResult;
  var failed: any;

  var msg = {
    name: "My CW20 token",
    symbol: "CW20",
    decimals: 18,
    mint: {
      minter: null
    }
  }

  async function upload() {
    instantiating = true;
    failed = "";
    let opts: InstantiateOptions = {};
    if (admin !== "") opts = { admin, ...opts };
    if (memo !== "") opts = { memo, ...opts };
    if (funds && funds !== "")
      opts = { funds: [{ amount: funds, denom: "acudos" }], ...opts };
    try {
      const result = await client.instantiate(
        client.address!,
        parseInt(code_id),
        msg,
        label,
        "auto",
        opts
      );
      console.log(result);
      instantiated = result;
    } catch (e: unknown) {
      failed = e;
    } finally {
      instantiating = false;
    }
  }
</script>

<h1>Instantiate CW20 Contract</h1>

<h2>Code ID</h2>

<div>
  <input bind:value={code_id} />
</div>

<h2>Admin address (optional)</h2>

<div>
  <input bind:value={admin} />
</div>

<h2>Initial funding (optional, usually unnecessary)</h2>

<div>
  <input bind:value={funds} /> acudos
</div>

<h2>Label</h2>

<div>
  <input bind:value={label} />
</div>

<h2>Token name</h2>

<input bind:value={msg.name} />

<h2>Token symbol</h2>

<input bind:value={msg.symbol} />

<h2>Decimals</h2>

<input type="number" bind:value={msg.decimals} />

<h2>Minter (optional)</h2>

<input bind:value={msg.mint.minter} />

<h2>Memo (optional)</h2>

<div>
  <textarea cols="80" rows="10" bind:value={memo} />
</div>

{#if instantiating}
  <div>Uploading</div>
{:else}
  <div>
    <button on:click={upload} disabled={instantiating || !!instantiated}
      >Upload</button
    >
  </div>
  {#if !!failed}
    <div>
      {JSON.stringify(failed)}
    </div>
  {:else if !!instantiated}
    <div>Instantiated contract at {instantiated.contractAddress}</div>
    <div>
      {instantiated.gasUsed}/{instantiated.gasWanted}
    </div>
    <div>
      {instantiated.transactionHash} @
      {instantiated.height}
    </div>
    {#each instantiated.logs as log}
      {log.log}
      {#each log.events as event}
        <pre>{JSON.stringify(event, null, 2)}</pre>
      {/each}
    {/each}
  {/if}
{/if}
