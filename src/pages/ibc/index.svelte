<script lang="ts">
  import { Client } from "@/lib/client";
  import { Link, Route } from "@/lib/controllers";
  import { dump } from "@/lib/utils";
  import Page from "@/ui/Page.svelte";
  import Long from "long";

  export let client: Client;

  const CHANNEL_STATE = [null, "INIT", "TRYOPEN", "OPEN", "CLOSED"];
</script>

<Page>
  <h1>Clients</h1>
  <section>
    {#await client.omni.ibc.client.ClientStates({})}
      Loading...
    {:then data}
      <table>
        {#each data.clientStates as row}
          <tr>
            <td>{row.clientId}</td>
            {#if row.clientState}
              {#await client.registry.decode(row.clientState) then state}
                <td>{state.chainId}</td>
                <td>{Number(state.latestHeight.revisionHeight)}</td>
              {/await}
            {/if}
          </tr>
        {/each}
      </table>
    {:catch e}
      {e}
    {/await}
  </section>
  <h1>Connections</h1>
  <section>
    {#await client.omni.ibc.connection.Connections({}) then data}
      <table>
        {#each data.connections as row}
          <tr>
            <td>{row.clientId}</td>
            <td>{row.id}</td>
            <td>{row.counterparty?.clientId}</td>
            <td>{row.counterparty?.connectionId}</td>
          </tr>
        {/each}
      </table>
    {/await}
  </section>
  <h1>Channels</h1>
  <section>
    <h2>All channels</h2>
    {#await client.omni.ibc.channel.Channels({})}
      Loading...
    {:then data}
      <table>
        {#each data.channels as row}
          <tr>
            <td>{CHANNEL_STATE[row.state]}</td>
            <td>{row.connectionHops}</td>
            <td>{row.portId}</td>
            <td>{row.channelId}</td>
            <td>{row.counterparty?.portId}</td>
            <td>{row.counterparty?.channelId}</td>
          </tr>
        {/each}
      </table>
    {:catch e}
      {e}
    {/await}
    <!--<h2>Packets</h2>
    {#await client.omni.ibc.channel.Channels({})}
      Loading...
    {:then data}
      <table>
        {#each data.channels as row}
          <tr>
            <td>{row.channelId}</td>
            <td>{row.portId}</td>
            <td>{row.counterparty?.channelId}</td>
            <td>{row.counterparty?.portId}</td>
            <td>
              {#await client.omni.ibc.channel.PacketAcknowledgements( { channelId: row.channelId, portId: row.portId, packetCommitmentSequences: [] } ) then data}
                <pre>{dump(data)}</pre>
              {/await}
            </td>
          </tr>
        {/each}
      </table>
    {:catch e}
      {e}
    {/await} -->
  </section>
  <h1>Transfers</h1>
  <section>
    <h2>Denom traces</h2>
    {#await client.omni.ibc.transfer.DenomTraces({})}
      Loading...
    {:then data}
      <table>
        {#each data.denomTraces as row}
          <tr>
            <td>{row.baseDenom}</td>
            <td>{row.path}</td>
          </tr>
        {/each}
      </table>
    {:catch e}
      {e}
    {/await}
  </section>
</Page>

<!-- <Route path="/">
  <Page>
    <ul>
      <li><Link to="my/delegations/">My Delegations</Link></li>
      <li><Link to="my/validators/">My Validators</Link></li>
      <li><Link to="validators/">Validators</Link></li>
    </ul>
  </Page>
</Route> -->

<!-- <Route crumb="My Delegations" path="/my/delegations">
  <MyDelegations client="{client}" />
</Route>

<Route crumb="My Validators" path="/my/validators">
  <MyValidators client="{client}" />
</Route>

<Route crumb="Validators" path="/validators/">
  <Validators client="{client}" />
</Route> -->
