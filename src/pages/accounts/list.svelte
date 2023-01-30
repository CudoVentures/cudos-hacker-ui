<script lang="ts">
  import { BaseAccount, ModuleAccount, omniClient } from "@/lib/omniclient";
  import Long from "long";
  import { cudos, dump, thousands } from "@/lib/utils";
  import { known } from "@/lib/facts";
  import { Client } from "@/lib/client";
  import { Link } from "@/lib/controllers";
  import { times } from "underscore";
  export var client: Client;
  export let omni = client.omni;
  let nullKey = Uint8Array.from([]);
  let offset = 0;
</script>

<main>
  <h2>Accounts</h2>
  {#await omni.auth.Accounts( { pagination: { reverse: false, countTotal: true, key: nullKey, offset: new Long(offset), limit: new Long(20) } } ) then accounts}
    <table>
      {#each accounts.accounts as account}
        <tr>
          {#if account.typeUrl === "/cosmos.auth.v1beta1.BaseAccount"}
            {#await BaseAccount.decode(account.value) then account}
              <td><Link to="{account.address}">{account.address}</Link></td>
              <td align="right">
                {#await client.getAllBalances(account.address) then balances}
                  {#each balances as balance}
                    {thousands(balance.amount)}
                    {balance.denom}
                    <br />
                  {/each}
                {/await}
              </td>
            {/await}
          {:else if account.typeUrl === "/cosmos.auth.v1beta1.ModuleAccount"}
            {#await ModuleAccount.decode(account.value) then account}
              {#if account.baseAccount}
                <td title="{account.baseAccount.address}">
                  <Link to="{account.baseAccount.address}">
                    {account.name}
                  </Link>
                </td>
                <td align="right">
                  {#await client.getAllBalances(account.baseAccount.address) then balances}
                    {#each balances as balance}
                      {thousands(balance.amount)}
                      {balance.denom}
                      <br />
                    {/each}
                  {/await}
                </td>
              {/if}
            {/await}
          {:else}
            <td>{account.typeUrl}</td>
          {/if}
        </tr>
      {/each}
    </table>
    <section>
      {#each times(Math.ceil(Number(accounts.pagination?.total) / 20), (x) => x) as page}
        <button on:click="{() => (offset = page * 20)}">{page}</button>
      {/each}
    </section>
  {/await}
</main>
