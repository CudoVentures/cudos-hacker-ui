<script lang="ts">
  import { cudos, dump, procure, thousands } from "@/lib/utils";
  import { Client } from "@/lib/client";

  import PropertyList from "@/ui/PropertyList.svelte";
  import Property from "@/ui/Property.svelte";

  export let client: Client;

  export const chainConfiguration = procure(async () => ({
    chainId: await client.getChainId(),
    chainName: client.network.name,
    rpc: client.network.urls.rpc,
    rest: client.network.urls.rest,
    stakeCurrency: {
      coinDecimals: 18,
      coinDenom: "CUDOS",
      coinMinimalDenom: "acudos",
      coinGeckoId: "cudos",
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "cudos",
      bech32PrefixAccPub: "cudospub",
      bech32PrefixValAddr: "cudosvaloper",
      bech32PrefixValPub: "cudosvaloperpub",
      bech32PrefixConsAddr: "cudosvalcons",
      bech32PrefixConsPub: "cudosvalconspub",
    },
    currencies: [
      {
        coinDenom: "CUDOS",
        coinMinimalDenom: "acudos",
        coinDecimals: 18,
        coinGeckoId: "cudos",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "CUDOS",
        coinMinimalDenom: "acudos",
        coinDecimals: 18,
        coinGeckoId: "cudos",
      },
    ],
    features: ["cosmwasm"],
    coinType: 118,
    gasPriceStep: {
      low: Number(5000000000000),
      average: Number(5000000000000) * 1.25,
      high: Number(5000000000000) * 1.5,
    },
  }));

  let keplr = procure(async () => {
    return window.keplr!;
  });

  async function connect() {
    if (!window.keplr) throw "Keplr not found";
    window.keplr.experimentalSuggestChain($chainConfiguration);
    window.keplr.enable($chainConfiguration.chainId);
  }
</script>

<main>
  {#await client.getChainId() then chainId}
    {#await $keplr.getKey(chainId)}
      Connecting to localnet
    {:then result}
      <PropertyList>
        <Property label="Name">{result.name}</Property>
        <Property label="Address">{result.bech32Address}</Property>
        {#await client.getAllBalances(result.bech32Address) then balances}
          <Property label="CUDOS">{cudos(balances[0].amount)}</Property>
          <Property label="aCUDOS">{thousands(balances[0].amount)} aCUDOS</Property>
        {/await}
      </PropertyList>
    {:catch e}
      {e}
    {/await}
    <section>
      <button on:click="{connect}">Connect</button>
    </section>
  {/await}
</main>
