<script lang="ts">
  import PropertyList from "@/ui/PropertyList.svelte";
  import Property from "@/ui/Property.svelte";
  import { omniClient } from "@/lib/omniclient";
  import { bankTypes } from "@cosmjs/stargate/build/modules";
  import { useParams } from "svelte-navigator";
  import { fromUtf8 } from "@cosmjs/encoding";
  import Long from "long";
  import { cudos, dump, parseDec, parseDecPct, parseTime } from "@/lib/utils";
  import { validate_dynamic_element } from "svelte/internal";
  import { writable } from "svelte/store";
  import { Client } from "@/lib/client";
  export let client: Client;
  export let omni = client.omni;
  const BOND_STATUS = ["Unspecified", "Unbonded", "Unbonding", "Bonded"];
</script>

<main>
  <!-- {#await omni.staking.Pool({}) then pool}
        <pre>{dump(pool)}</pre>
      {/await}
      {#await omni.staking.HistoricalInfo( { height: new Long(height) } ) then info}
        <pre>{dump(info)}</pre>
      {:catch}
        Failed to get data for block {height}
      {/await} -->
  {#await omni.staking.Validators({ status: "" }) then validators}
    {#each validators.validators as validator}
      <h2>
        {validator.description.moniker} ({validator.description.identity})
      </h2>
      {#await omni.distribution.ValidatorOutstandingRewards( { validatorAddress: validator.operatorAddress } )}
        Loading outstanding rewards
      {:then x}
        <pre>{dump(x)}</pre>
      {:catch}
        Failed to get validator data for {validator.operatorAddress}
      {/await}
      <!-- <PropertyList>
      <Property label="Security Contact">{validator.description.securityContact}</Property>
      <Property label="Website">{validator.description.website}</Property>
      <Property label="Details">{validator.description.details}</Property>
    </PropertyList> -->
      <PropertyList>
        <Property label="Commission rate"
          >{parseDecPct(validator.commission.commissionRates.rate)}</Property>
        <Property label="Commission max rate"
          >{parseDecPct(
            validator.commission.commissionRates.maxRate
          )}</Property>
        <Property label="Commission max change rate"
          >{parseDecPct(
            validator.commission.commissionRates.maxChangeRate
          )}</Property>
        <Property label="Commission last updated"
          >{parseTime(validator.commission.updateTime)}</Property>
        <Property label="Delegator shares"
          >{cudos(parseDec(validator.delegatorShares))}</Property>
        <Property label="Jailed?">{validator.jailed}</Property>
        <Property label="Min. self delegation"
          >{cudos(BigInt(validator.minSelfDelegation))}</Property>
        <Property label="Unbonding height"
          >{validator.unbondingHeight}</Property>
        <Property label="Unbonding time"
          >{parseTime(validator.unbondingTime)}</Property>
        <Property label="Delegated">{cudos(BigInt(validator.tokens))}</Property>
        <Property label="Operator address"
          >{validator.operatorAddress}</Property>
        <Property label="Bond status">{BOND_STATUS[validator.status]}</Property>
      </PropertyList>
    {/each}
  {/await}
</main>
