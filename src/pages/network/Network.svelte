<script lang="ts">
  import { cudos, dump, procure, thousands } from "@/lib/utils";
  import PropertyList from "@/ui/PropertyList.svelte";
  import Property from "@/ui/Property.svelte";
  import { Client } from "@/lib/client";
  import { sortBy } from "underscore";
  import { Link } from "@/lib/controllers";
  import Page from "@/ui/Page.svelte";
  import _ from "underscore";

  export let client: Client;

  $: data = (async () => {
    await new Promise((r) => setTimeout(r, 100));
    if (window.keplr) {
      try {
        await client.connect_keplr(false);
        return {
          height: await client.getHeight(),
          key: await window.keplr?.getKey(client.chainId),
          balance: await client.getAllBalances(client.address!),
        };
      } catch (e) {}
    }
    return {
      height: await client.getHeight(),
      key: null,
      balance: null,
    };
  })();
</script>

<Page title="Network Information">
  {#await data then data}
    <section>
      <h2>Information</h2>
      <PropertyList>
        <Property label="RPC URL">{client.network.urls.rpc}</Property>
        <Property label="Rest URL">{client.network.urls.rest}</Property>
        <Property label="Chain ID">{client.chainId}</Property>
        <Property label="Height">{data.height}</Property>
      </PropertyList>
    </section>

    <section>
      <h2>Well-known contracts</h2>
      <PropertyList>
        <Property label="Compute">{client.network.contracts.compute}</Property>
        <Property label="Exchange">{client.network.contracts.exchange}</Property>
      </PropertyList>
    </section>

    {#if data.key}
      <section>
        <h2>Wallet</h2>
        <PropertyList>
          <Property label="Name">{data.key.name}</Property>
          <Property label="Address">{data.key.bech32Address}</Property>
          <Property label="Balance">
            <ul>
              {#each data.balance as coin}
                <li>
                  {coin.amount}
                  {coin.denom}
                </li>
              {/each}
            </ul>
          </Property>
        </PropertyList>
      </section>
    {:else}
      <section>
        <button on:click="{() => client.connect_keplr(true)}"
          >Connect Keplr</button>
      </section>
    {/if}
  {/await}
</Page>
