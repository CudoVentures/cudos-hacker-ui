<script lang="ts">
  import Machines from "@/pages/compute/machines.svelte";
  import Machine from "@/pages/compute/machine.svelte";
  import Types from "@/pages/compute/types.svelte";
  import Images from "@/pages/compute/images.svelte";
  import Buy from "@/pages/compute/buy.svelte";
  import Admin from "@/pages/compute/admin.svelte";
  import { Link, Route } from "@/lib/controllers";
  import { Client } from "@/lib/client";
  import Network from "../network/Network.svelte";
  import Page from "@/ui/Page.svelte";
  export let client: Client;
  export let contract_address = client.network.contracts.compute;
</script>

{#if !contract_address}
  <main>Compute not configured for this network.</main>
{:else}
  <Route path="/">
    <Page>
      <menu>
        <li><Link to="list/">Machines</Link></li>
        <li><Link to="buy/">Buy</Link></li>
        <li><Link to="types/">Machine Types</Link></li>
        <li><Link to="images/">Images</Link></li>
        <li><Link to="admin/">Administrate</Link></li>
      </menu>
    </Page>
  </Route>
  <Route crumb="Machines" path="/list"><Machines contract_address="{contract_address}" client="{client}" /></Route>
  <Route crumb="Machine" path="/:id" let:params><Machine id="{params.id}" contract_address="{contract_address}" client="{client}" /></Route>
  <Route crumb="Types" path="/types"><Types contract_address="{contract_address}" client="{client}" /></Route>
  <Route crumb="Images" path="/images"><Images contract_address="{contract_address}" client="{client}" /></Route>
  <Route crumb="Buy Machine" path="/buy"><Buy contract_address="{contract_address}" client="{client}" /></Route>
  <Route crumb="Administrate" path="/admin"><Admin contract_address="{contract_address}" client="{client}" /></Route>
{/if}
