<script lang="ts">
  import { Client } from "@/lib/client";

  export var client: Client;
  $: lookup_account = client.address!;
</script>

<h2>Information</h2>
<div>
  Chain ID {#await client.getChainId() then chainId}{chainId}{/await}
</div>
<div>Height {#await client.getHeight() then height}{height}{/await}</div>
<h2>Account lookup</h2>
<div><input bind:value="{lookup_account}" /></div>
{#if lookup_account != ""}
  <h2>Account data</h2>
  {#await client.getAccount(lookup_account) then account}
    {JSON.stringify(account)}
  {/await}
  <h2>Balances</h2>
  {#await client.getAllBalances(lookup_account) then balances}
    {JSON.stringify(balances)}
  {/await}
  <h2>Staked Balance</h2>
  {#await client.getBalanceStaked(lookup_account) then staked}
    {JSON.stringify(staked)}
  {/await}
{/if}
