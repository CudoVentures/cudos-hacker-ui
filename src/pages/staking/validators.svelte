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
  import _ from "underscore";

  export let client: Client;

  async function prepare() {
    client.connect_keplr();
    const validators = await client.omni.staking
      .Validators({ status: "" })
      .then((v) => v.validators);
    return {
      validators: validators,
    };
  }
</script>

<main>
  {#await prepare()}
    Fetching validators
  {:then data}
    <h1>Validators</h1>
    {#each data.validators as validator}
      <h2>
        {#if validator.jailed}
          <span class="jailed">JAILED!</span>
        {/if}
        {validator.description?.moniker}
        {#if validator.description?.website}
          - <a href="{validator.description?.website}"
            >{validator.description?.website}</a>
        {/if}
        ({validator.operatorAddress})
      </h2>
      <section>
        {#if validator.description?.details}
          <p>"{validator.description?.details}"</p>
        {/if}
        {#if validator.description?.securityContact}
          <p>Contact: {validator.description?.securityContact}</p>
        {/if}
        <p>Delegator shares: {validator.delegatorShares}</p>
        <p>Unbonding height: {validator.unbondingHeight}</p>
        <p>Unbonding time: {validator.unbondingTime?.seconds}</p>
        <p>Commision rate: {validator.commission?.commissionRates?.rate}</p>
        <p>
          Max. commission rate: {validator.commission?.commissionRates?.maxRate}
        </p>
        <p>
          Max. rate change per block: {validator.commission?.commissionRates
            ?.maxChangeRate}
        </p>
        <p>Last update time: {validator.commission?.updateTime?.seconds}</p>
        <p>Minimum self delegation: {validator.minSelfDelegation}</p>
      </section>
    {/each}
  {:catch e}
    <pre>
      {e}
      {e.stack.join("\n")}
    </pre>
  {/await}
</main>

<style>
  span.jailed {
    color: red;
  }
  section {
    padding-left: 2ch;
  }
</style>
