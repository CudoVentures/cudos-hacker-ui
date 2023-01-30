<script lang="ts">
  import PropertyList from "@/ui/PropertyList.svelte";
  import Property from "@/ui/Property.svelte";
  import { bankTypes } from "@cosmjs/stargate/build/modules";
  import { useParams } from "svelte-navigator";
  import { fromUtf8 } from "@cosmjs/encoding";
  import Long from "long";
  import { Client } from "@/lib/client";
  import { dump } from "@/lib/utils";
  export let client: Client;
  export let omni = client.omni;

  function parseDec(v: string | Uint8Array) {
    if (typeof v !== "string") v = fromUtf8(v);
    return parseFloat(v) / 1e18;
  }

  function integral(t: number): number {
    t = Math.min(t, 10);
    return (0.6 * t * t * t - 26.5 * t * t + 358 * t) * 1000000 * 1e18;
  }

  function thousands(n: string | bigint | number) {
    if (typeof n === "number") n = n.toFixed(0);
    return n.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  function cudos(n: bigint | number) {
    return thousands((Number(n) / 1e18).toFixed(0)) + " CUDOS";
  }

  $: compute = async function (days: number | null) {
    const current_height = await client.getHeight();
    const bonded = BigInt((await omni.staking.Pool({})).pool!.bondedTokens);
    const block1 = await client.getBlock(current_height);
    const block2 = await client.getBlock(current_height - 12345);
    const real_time =
      (Date.parse(block1.header.time) - Date.parse(block2.header.time)) / 12345;
    const real_blocks_per_second = 1000 / real_time;
    const real_blocks_per_day = real_blocks_per_second * (60 * 60 * 24);
    const assumed_blocks_per_day = 12345;
    const assumed_blocks_per_year = assumed_blocks_per_day * 365.25;
    const time0 = 0.70118475970821069;
    const height0 = 1069391;
    const height1 = current_height;
    const time1 = time0 + (height1 - height0) / assumed_blocks_per_year;
    if (days == null) {
      days = (10 - time0) * 365.25;
    }
    const future_height = current_height + real_blocks_per_day * days;
    const height2 = future_height;
    const time2 = time1 + (height2 - height1) / assumed_blocks_per_year;
    const reward1 = integral(time1);
    const reward2 = integral(time2);
    const reward = reward2 - reward1;
    const reward_year = (reward * 365.2) / days;
    const apr = reward_year / Number(bonded);
    return {
      days,
      real_blocks_per_day,
      bonded,
      height1,
      height2,
      time1,
      time2,
      reward1,
      reward2,
      reward,
      reward_year,
      apr,
    };
  };
</script>

{#await omni.staking.Pool({}) then pool}{dump(pool.pool.bondedTokens)}{/await}

<pre>
{#await omni.tm.GetNodeInfo({}) then info}{dump(info)}{/await}
</pre>

<!-- 
  <h2>Module Settings</h2>
  <h3>Auth</h3>
  {#await omni.auth.Params({}) then params}
    <PropertyList>
      <Property label="Memo length" value={params.params.maxMemoCharacters} />
      <Property
        label="Ed25519 verification cost"
        value={params.params.sigVerifyCostEd25519}
      />
      <Property
        label="Secp256k1 verification cost"
        value={params.params.sigVerifyCostSecp256k1}
      />
      <Property label="Signature limit" value={params.params.txSigLimit} />
      <Property
        label="TX cost per byte"
        value={params.params.txSizeCostPerByte}
      />
    </PropertyList>
  {/await}
  <h3>Bank</h3>
  {#await omni.bank.Params({}) then params}
    <PropertyList>
      <Property
        label="Send enabled by default?"
        value={params.params.defaultSendEnabled}
      />
      <Property
        label="Send overrides by denom"
        value={dump(params.params.sendEnabled)}
      />
    </PropertyList>
  {/await}
  {#await omni.bank.DenomsMetadata({}) then data}
    {#each data.metadatas as metadata}
      <PropertyList>
        <Property label="Name" value={metadata.name} />
        <Property label="Symbol" value={metadata.symbol} />
        <Property label="Display" value={metadata.display} />
        <Property label="Description" value={metadata.description} />
        {#each metadata.denomUnits as unit}
          <Property label={unit.denom} value={unit.exponent} />
        {/each}
      </PropertyList>
    {/each}
  {/await}
  <h3>Distribution</h3>
  {#await omni.distribution.Params({}) then params}
    <PropertyList>
      <Property
        label="Community Tax"
        value="{parseDec(params.params.communityTax)}" />
      <Property label="Proposer Reward">
        {parseDec(params.params.baseProposerReward)}
        +
        {parseDec(params.params.bonusProposerReward)}
      </Property>
      <Property
        label="Withdraw Address?"
        value="{params.params.withdrawAddrEnabled}" />
    </PropertyList>
  {/await}
  <h3>Governance</h3>
  <PropertyList>
    {#await omni.gov.Params({ paramsType: "voting" }) then params}
      <Property label="Voting period"
        >{params.votingParams.votingPeriod.seconds}.{params.votingParams
          .votingPeriod.nanos}</Property>
    {/await}
    {#await omni.gov.Params({ paramsType: "tallying" }) then params}
      <Property label="Quorum" value="{parseDec(params.tallyParams.quorum)}" />
      <Property
        label="Threshold"
        value="{parseDec(params.tallyParams.threshold)}" />
      <Property
        label="Veto threshold"
        value="{parseDec(params.tallyParams.vetoThreshold)}" />
    {/await}
    {#await omni.gov.Params({ paramsType: "deposit" }) then params}
      <Property label="Max deposit period"
        >{params.depositParams.maxDepositPeriod.seconds}.{params.depositParams
          .maxDepositPeriod.nanos}</Property>
      <Property
        label="Min deposit"
        value="{dump(params.depositParams.minDeposit)}" />
    {/await}
  </PropertyList>

  <h3>Mint</h3>
  {#await omni.mint.Params({}) then params}
    <PropertyList>
      <Property label="Blocks per year" value="{params.params.blocksPerYear}" />
    </PropertyList>
  {:catch c}
    Failed to retrieve mint module parameters.
  {/await}
  <h3>Slashing</h3>
  {#await omni.slashing.Params({}) then params}
    <PropertyList>
      <Property
        label="downtimeJailDuration"
        value="{params.params.downtimeJailDuration.seconds}" />
      <Property
        label="minSignedPerWindow"
        value="{parseDec(params.params.minSignedPerWindow)}" />
      <Property
        label="signedBlocksWindow"
        value="{params.params.signedBlocksWindow}" />
      <Property
        label="slashFractionDoubleSign"
        value="{parseDec(params.params.slashFractionDoubleSign)}" />
      <Property
        label="slashFractionDowntime"
        value="{parseDec(params.params.slashFractionDowntime)}" />
    </PropertyList>
  {:catch c}
    Failed to retrieve slashing module parameters.
  {/await}
  <h3>Staking</h3>
  {#await omni.staking.Params({}) then params}
    <PropertyList>
      <Property label="maxEntries" value="{params.params.maxEntries}" />
      <Property label="bondDenom" value="{params.params.bondDenom}" />
      <Property
        label="historicalEntries"
        value="{params.params.historicalEntries}" />
      <Property
        label="unbondingTime"
        value="{params.params.unbondingTime.seconds}" />
    </PropertyList>
  {:catch c}
    Failed to retrieve staking module parameters.
  {/await} -->
