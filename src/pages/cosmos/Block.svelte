<script lang="ts">
  import {
    createProtobufRpcClient,
    SigningStargateClient,
    StargateClient,
  } from "@cosmjs/stargate";
  import {
    CosmWasmClient,
    SigningCosmWasmClient,
  } from "@cosmjs/cosmwasm-stargate";
  import { toBase64, toHex } from "@cosmjs/encoding";
  import { range } from "underscore";
  import PropertyList from "@/ui/PropertyList.svelte";
  import Property from "@/ui/Property.svelte";
  import { decodeTxRaw } from "@cosmjs/proto-signing";
  import { sha256 } from "@cosmjs/crypto";
  import { dump } from "@/lib/utils";
  import { Client } from "@/lib/client";

  export var client: Client;
  export var height: number;

  $: lookup_account = client.address;
</script>

<main>
  {#if height}
    {#await client.getBlock(height) then block}
      <section>
        <h2>{block.header.height}</h2>
        <PropertyList>
          <Property label="Chain">{block.header.chainId}</Property>
          <Property label="Version"
            >{block.header.version.app}.{block.header.version.block}</Property>
          <Property label="Time">{block.header.time}</Property>
          <Property label="ID">{block.id}</Property>
        </PropertyList>
        <h2>Transactions</h2>
        {#each block.txs as rawTx}
          <h3>{toHex(sha256(rawTx))}</h3>
          {#await decodeTxRaw(rawTx) then tx}
            <pre>{dump(tx)}</pre>
          {/await}
        {/each}
      </section>
    {/await}
  {/if}
</main>
