<script lang="ts">
  import { Link, Route } from "@/lib/controllers";

  import Network from "@/pages/network/Network.svelte";
  import Compute from "@/pages/compute/index.svelte";
  import Exchange from "@/pages/exchange/index.svelte";
  import Contracts from "@/pages/contracts/index.svelte";
  import Page from "@/ui/Page.svelte";
  import { Networks } from "@/lib/networks";
  import Crumb from "@/lib/controllers/Crumb.svelte";
  import IBC from "@/pages/ibc/index.svelte";
  import Staking from "@/pages/staking/index.svelte";
  import Transactions from "@/pages/transactions/index.svelte";
  import Supply from "@/pages/network/Supply.svelte";
  // import Midas from "@/pages/midas/index.svelte";
  import Blocks from "@/pages/blocks/index.svelte";
  import Feegrant from "@/pages/feegrant/index.svelte";
  import ClientContext from "./ClientContext.svelte";
  import Tendermint from "@/pages/tendermint/Index.svelte";
  import Accounts from "@/pages/accounts/index.svelte";

  export let network: string;
</script>

{#await Networks[network].client()}
  <Page>
    Connecting to {network}.
  </Page>
{:then client}
  <ClientContext client="{client}">
    <Crumb>{client.network.name}</Crumb>
    <Route path="/">
      <Page>
        <h1>Applications</h1>
        <ul>
          {#if client.network.has("compute")}
            <li><Link to="compute/">Compute</Link></li>
          {/if}
          {#if client.network.has("exchange")}
            <li><Link to="exchange/">Exchange</Link></li>
          {/if}
          {#if client.network.has("midas")}
            <li><Link to="midas/">Midas</Link></li>
          {/if}
        </ul>
        <h1>Cosmos</h1>
        <ul>
          <li><Link to="info/">Network Information</Link></li>
          <li><Link to="contracts/">Contracts</Link></li>
          <li><Link to="ibc/">IBC</Link></li>
          <li><Link to="supply/">Supply</Link></li>
          <li><Link to="staking/">Staking</Link></li>
          <li><Link to="transactions/">Transactions</Link></li>
          <li><Link to="feegrant/">Feegrant</Link></li>
          <li><Link to="tendermint/">Tendermint</Link></li>
          <li><Link to="accounts/">Accounts</Link></li>
        </ul>
      </Page>
    </Route>
    <Route crumb="Information" path="/info/"><Network client="{client}" /></Route>
    <Route crumb="Exchange" path="/exchange/"><Exchange client="{client}" /></Route>
    <Route crumb="Compute" path="/compute/"><Compute client="{client}" /></Route>
    <Route crumb="Contracts" path="/contracts/">
      <Contracts client="{client}" />
    </Route>
    <Route crumb="Staking" path="/staking/">
      <Staking client="{client}" />
    </Route>
    <Route crumb="IBC" path="/ibc/">
      <IBC client="{client}" />
    </Route>
    <Route crumb="Supply" path="/supply/">
      <Supply client="{client}" />
    </Route>
    <Route crumb="Transactions" path="/transactions/">
      <Transactions client="{client}" />
    </Route>
    <!-- <Route crumb="Midas" path="/midas/">
      <Midas client="{client}" />
    </Route> -->
    <Route crumb="Blocks" path="/blocks/">
      <Blocks client="{client}" />
    </Route>
    <Route crumb="Feegrant" path="/feegrant/">
      <Feegrant client="{client}" />
    </Route>
    <Route crumb="Tendermint" path="/tendermint/">
      <Tendermint client="{client}" />
    </Route>
    <Route crumb="Accounts" path="/accounts/">
      <Accounts client="{client}" />
    </Route>
  </ClientContext>
{:catch e}
  {e}
{/await}
