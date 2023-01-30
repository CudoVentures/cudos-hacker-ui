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
  import { Client } from "@/lib/client";

  export var client: Client;

  $: lookup_account = client.address;
</script>

<main></main>
