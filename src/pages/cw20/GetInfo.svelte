<script lang="ts">
    import { Client } from "@/lib/client";
  import Property from "@/ui/Property.svelte";
  import PropertyList from "@/ui/PropertyList.svelte";
  export let client: Client;
  export let address: string;

  async function suggestToken() {
    window.keplr!.suggestToken("cudos-1", "cudos1wkwy0xh89ksdgj9hr347dyd2dw7zesmtrue6kfzyml4vdtz6e5wszyle5g")
  }
</script>

<main>
  <PropertyList>
    {#await client.queryContractSmart(address, { token_info: {} }) then info}
      <Property label="Name">{info.name}</Property>
      <Property label="Symbol">{info.symbol}</Property>
      <Property label="Decimals">{info.decimals}</Property>
      <Property label="Total supply">{info.total_supply}</Property>
    {/await}

    {#await client.queryContractSmart( address, { marketing_info: {} } ) then info}
      <Property label="Project">{info.project}</Property>
      <Property label="Description">{info.description}</Property>
      <Property label="Marketing data">{info.marketing}</Property>
    {/await}

    {#await client.queryContractSmart(address, { minter: {} }) then minter}
      <Property label="Minter">{minter.minter}</Property>
      <Property label="Mint cap">{minter.cap}</Property>
    {/await}
  </PropertyList>

  <h2>Balances</h2>
  {#await client.queryContractSmart( address, { all_accounts: {} } ) then accounts}
    {#each accounts.accounts as account}
      {#await client.queryContractSmart( address, { balance: { address: account } } ) then balance}
        <p><strong>{account}</strong> {balance.balance}</p>{/await}
    {/each}
  {/await}

  <button on:click={suggestToken}>Keplrify</button>
</main>
