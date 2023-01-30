<script lang="ts">
  import { Client } from "@/lib/client";
  import { Router, Route, Link } from "@/lib/controllers";

  import Create from "./create.svelte";
  import Get from "./get.svelte";
  import List from "./list.svelte";

  export var client: Client;
</script>

<nav>
  <Link to="">List</Link>
  <!-- <Link to="create">Create</Link> -->
</nav>

<Route path="/"><List client="{client}" /></Route>
<Route path="/:id" let:params><Get id="{params.id}" client="{client}" /></Route>
<!-- <Route path="/create"><Create client="{client}" /></Route> -->
