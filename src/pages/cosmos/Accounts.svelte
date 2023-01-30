<script lang="ts">
  import { BaseAccount, ModuleAccount, omniClient } from "@/lib/omniclient";
  import Long from "long";
  import { dump } from "@/lib/utils";
  import { Client } from "@/lib/client";
  export let client: Client;
  export let omni = client.omni;
  const nullKey = Uint8Array.from([]);
</script>

<main>
  <h2>Accounts</h2>
  {#await omni.auth.Accounts( { pagination: { reverse: false, countTotal: true, key: nullKey, offset: new Long(0), limit: new Long(20) } } ) then accounts}
    <table>
      {#each accounts.accounts as account}
        <tr>
          {#if account.typeUrl === "/cosmos.auth.v1beta1.BaseAccount"}
            <td>Base</td>
            {#await BaseAccount.decode(account.value) then account}
              <td>{account.address}</td>
              <td></td>
              <td></td>
              <td
                >{#await client.getAllBalances(account.address) then balance}{dump(
                    balance
                  )}{/await}</td>
            {/await}
          {:else if account.typeUrl === "/cosmos.auth.v1beta1.ModuleAccount"}
            {#await ModuleAccount.decode(account.value) then account}
              <td>Module</td>
              {#if account.baseAccount}
                <td>{account.baseAccount.address}</td>
                <td>{account.name}</td>
                <td>{account.permissions}</td>
                <td
                  >{#await client.getAllBalances(account.baseAccount.address) then balance}{dump(
                      balance
                    )}{/await}</td>
              {/if}
            {/await}
          {:else}
            <td>{account.typeUrl}</td>
          {/if}
        </tr>
      {/each}
    </table>
  {/await}
</main>
