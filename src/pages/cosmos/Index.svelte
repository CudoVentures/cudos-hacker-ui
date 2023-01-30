<script lang="ts">
  import _ from "underscore";
  import { Route, Link } from "@/lib/controllers";
  import { Client } from "@/lib/client";
  import { dump } from "@/lib/utils";
  import { decodeTxRaw } from "@cosmjs/proto-signing";

  import Accounts from "@/pages/Network/Accounts.svelte";
  import Validators from "@/pages/Network/Validators.svelte";
  import Block from "@/pages/cosmos/Block.svelte";
  import Blocks from "@/pages/Network/Blocks.svelte";
  import Params from "@/pages/network/Params.svelte";

  export var client: Client;
</script>

<nav>
  <Link to="">Params</Link>
  <Link section to="a/">Accounts</Link>
  <Link section to="v/">Validators</Link>
  <Link section to="b/">Blocks</Link>
</nav>

<Route path="/"><Params client="{client}" /></Route>

<Route path="/a"><Accounts client="{client}" /></Route>

<Route path="/v"><Validators client="{client}" /></Route>

<Route path="/tx/:id" let:params>
  {#await client.getTx(params.id) then tx}
    <pre>{dump(tx)}</pre>
    <pre>{dump(JSON.parse(tx.rawLog))}</pre>
    {#await decodeTxRaw(tx.tx) then tx}
      {#each tx.body.messages as msg}
        <strong>{msg.typeUrl}</strong>
        <pre>{dump(client.registry?.decode(msg))}</pre>
      {/each}
    {/await}
  {/await}
</Route>

<Route path="/b/*">
  <Route path="/*"><Blocks client="{client}" /></Route>
  <Route path="/:height" let:params>
    <Block client="{client}" height="{parseInt(params.height)}" />
  </Route>
</Route>
