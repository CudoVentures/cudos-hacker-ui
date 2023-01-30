<script lang="ts">
  import { Client } from "@/lib/client";
  import { Router, Route, Link } from "@/lib/controllers";

  import Create from "./create.svelte";
  import Get from "./get.svelte";
  import Statement from "./statement.svelte";
  import List from "./list.svelte";

  export var client: Client;
</script>

<Route path="/"></Route>
<Route path="/for/:address" let:params>
  <Statement client="{client}" address="{params.address}" />
</Route>
<Route path="/:id" let:params><Get id="{params.id}" client="{client}" /></Route>
<!-- <Route path="/create"><Create client="{client}" /></Route> -->
