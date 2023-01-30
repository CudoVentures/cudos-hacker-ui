<script lang="ts">
  import { Link, Route } from "@/lib/controllers";
  import { Client } from "@/lib/client";
  import Network from "../network/Network.svelte";
  import Page from "@/ui/Page.svelte";

  import Rates from "./rates.svelte";
  import Buy from "./buy.svelte";
  import Admin from "./admin.svelte";

  export let client: Client;
  const contract_address = client.network.contracts.exchange;
</script>

{#if !contract_address}
  <main>Compute not configured for this network.</main>
{:else}
  <Route path="/">
    <Page>
      <menu>
        <li><Link to="buy/">Buy CUDOS</Link></li>
        <li><Link to="rates/">Rates</Link></li>
        <li><Link to="admin/">Administrate</Link></li>
      </menu>
    </Page>
  </Route>
  <Route crumb="Buy CUDOS" path="/buy"><Buy contract_address="{contract_address}" client="{client}" /></Route>
  <Route crumb="Rates" path="/rates"><Rates contract_address="{contract_address}" client="{client}" /></Route>
  <Route crumb="Administrate" path="/admin"><Admin contract_address="{contract_address}" client="{client}" /></Route>
{/if}
