<script lang="ts">
  import { Client } from "@/lib/client";
  import { Link, Route } from "@/lib/controllers";
  import Page from "@/ui/Page.svelte";
  import Me from "./me.svelte";
  import MyDelegations from "./my/delegations.svelte";
  import MyValidators from "./my/validators.svelte";
  import Validators from "./validators.svelte";

  export let client: Client;
</script>

<Route path="/">
  <Page>
    <ul>
      <li><Link to="my/delegations/">My Delegations</Link></li>
      <li><Link to="my/validators/">My Validators</Link></li>
      <li><Link to="validators/">Validators</Link></li>
    </ul>
  </Page>
</Route>

<Route crumb="My Delegations" path="/my/delegations">
  <MyDelegations client="{client}" />
</Route>

<Route crumb="My Validators" path="/my/validators">
  <MyValidators client="{client}" />
</Route>

<Route crumb="Validators" path="/validators/">
  <Validators client="{client}" />
</Route>
