<script lang="ts">
  import Property from "@/ui/Property.svelte";
  import PropertyList from "@/ui/PropertyList.svelte";
  import { entries } from "lodash";
  import { Readable } from "svelte/store";
  import { Task } from "./task";
  import { cudos, dump, thousands } from "./utils";

  export let store: Readable<Task>;
  $: task = $store;
</script>

<div>
  {#if task.status}
    <h1>{task.status}</h1>
    {#if task.error}
      <div class="error">
        {task.error}
      </div>
    {/if}
    {#if task.result}
      {#each task.result as res}
        <h2>
          Transaction
          {res.transactionHash}
          @{thousands(res.height)}
          {thousands(res.gasUsed)}/{thousands(res.gasWanted)}
          ({(100 - (100 * res.gasUsed) / res.gasWanted).toFixed(0)}% surplus)
        </h2>
        <ul>
          {#each res.messages.flatMap((l) => l.events) as event}
            {#if event.type === "store_code"}
              <li>A wasm module was stored with ID {event.data.code_id}</li>
            {:else if event.type === "instantiate"}
              <li>
                A contract was instantiated at {event.data._contract_address} from the wasm module with ID {event.data.code_id}
              </li>
            {:else if event.type === "migrate"}
              <li>
                The contract at {event.data._contract_address} was migrated to the wasm module with ID {event.data.code_id}
              </li>
            {:else if event.type === "execute"}
              <li>
                The contract at
                {event.data._contract_address}
                was executed
              </li>
            {:else if event.type === "coin_received"}
              <li>
                {event.data.receiver}
                received
                {cudos(event.data.amount)} CUDOS
              </li>
            {:else if event.type === "coin_spent"}
              <li>
                {event.data.spender}
                spent
                {cudos(event.data.amount)} CUDOS
              </li>
            {:else if event.type === "transfer"}
              <li>
                {event.data.sender}
                sent
                {cudos(event.data.amount)} CUDOS to
                {event.data.recipient}
              </li>
            {:else if event.type === "message"}
              <!-- do nothing -->
            {:else}
              <PropertyList>
                <Property label="{event.type}">
                  <PropertyList>
                    {#each entries(event.data) as [key, value]}
                      <Property label="{key}">{value}</Property>
                    {/each}
                  </PropertyList>
                </Property>
              </PropertyList>
            {/if}
          {/each}
        </ul>
      {/each}
    {/if}
  {:else}
    {store}
  {/if}
</div>

<style lang="scss">
  ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .error {
    color: #900;
    background: rgba(255, 0, 0, 0.1);
    padding: 1rem;
    border: 1px solid #a00;
  }
  h1 {
    font-weight: bold;
    color: #009;
  }
  h2 {
    font-weight: bold;
    color: #909;
  }
  div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  ul {
    padding-left: 1rem;
  }
</style>
