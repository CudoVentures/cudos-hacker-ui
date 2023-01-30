<script lang="ts">
  import { cudos, dump, procure, thousands } from "@/lib/utils";
  import PropertyList from "@/ui/PropertyList.svelte";
  import Property from "@/ui/Property.svelte";
  import { Client } from "@/lib/client";
  import { sortBy } from "underscore";
  import {
    MsgDelegate,
    MsgUndelegate,
    MsgBeginRedelegate,
    MsgCreateValidator,
  } from "cosmjs-types/cosmos/staking/v1beta1/tx";
  import { RedelegationResponse } from "cosmjs-types/cosmos/staking/v1beta1/staking";
  import { sum } from "lodash";
  import { omniClient } from "@/lib/omniclient";
  import { fromBase64, toBech32 } from "cudosjs";
  import { Any } from "cosmjs-types/google/protobuf/any";

  export let client: Client;

  let data = {
    pubkey: "caKpUDcQlsDrRRuzQI676uqeUrfbWo1wAX73bH1pVIY=",
    msg: {
      delegatorAddress: client.address!,
      validatorAddress: toBech32("cudosvaloper", client.key?.address!),
      minSelfDelegation: "1",
      value: {
        denom: "acudos",
        amount: "1",
      },
      description: {
        details: "Sup"
      },
      commission: {
        maxChangeRate: "1",
        maxRate: "1",
        rate: "1",
      }
    } as Partial<MsgCreateValidator>
  };

  let task: null | Promise<any> = null;

  function createValidator() {
    task = new Promise((resolve, reject) => {
      try {
        const msg = {
          typeUrl: "/cosmos.staking.v1beta1.MsgCreateValidator",
          value: MsgCreateValidator.fromPartial({
            ...data.msg,
            ...{
              pubkey: {
                typeUrl: "/cosmos.crypto.ed25519.PubKey",
                key: fromBase64(data.pubkey),
              } as unknown as Any,
            },
          }),
        };
        client
          .signAndBroadcast(client.address!, [msg], "auto", "")
          .then((r) => resolve(r))
          .catch((e) => reject(e));
      } catch (e) {
        reject(e);
      }
    });
  }
</script>

<main>
  <h1>Create Validator</h1>
  <section>
    <strong>Delegator address</strong>
    <input bind:value="{data.msg.delegatorAddress}" size="51" />

    <strong>Validator address</strong>
    <input bind:value="{data.msg.validatorAddress}" size="51" />

    <strong>Minimum self delegation</strong>
    <input bind:value="{data.msg.minSelfDelegation}" size="51" />

    <strong>Initial delegation</strong>
    <input bind:value="{data.msg.value.amount}" size="51" />

    <strong>Public key</strong>
    <input bind:value="{data.pubkey}" size="51" />

    <button on:click="{() => createValidator()}">Create</button>
  </section>
  <section>
    {#if task}
      {#await task}
        Performing task
      {:then data}
        {data}
      {:catch e}
        {e}
      {/await}
    {/if}
  </section>
  <!-- {#await client.omni.staking.x then data} -->
  <!-- <pre>{dump(data)}</pre> -->
  <!-- {/await} -->
</main>
