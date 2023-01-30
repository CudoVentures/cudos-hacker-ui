<script lang="ts">
  import ListInstances from "@/pages/contracts/list.svelte";
  import CreateInstance from "@/pages/contracts/create.svelte";
  import GetInstance from "@/pages/contracts/get.svelte";
  import { Link, Route } from "@/lib/controllers";
  import { Client } from "@/lib/client";
  import Crumb from "@/lib/controllers/Crumb.svelte";
  export let client: Client;
</script>

<Link to="create">Create</Link>

<Route path="/">
  <ListInstances client="{client}" />
</Route>

<Route path="/create">
  <CreateInstance client="{client}" />
  </Route>

<Route path="/:id" let:params>
  <Crumb>{params.id}</Crumb>
  <GetInstance client="{client}" id="{params.id}" />
</Route>
