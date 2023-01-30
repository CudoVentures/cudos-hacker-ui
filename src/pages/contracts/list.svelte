<script lang="ts">
  import { Client } from "@/lib/client";
  import { Link } from "@/lib/controllers";
  import { Code } from "cudosjs";
  export let client: Client;
  // export let id: number;

  // cudos14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9strccpl

  // async function getContracts() {
  //   const result = [];
  //   const info = await client.omni.wasm.ContractInfo({address: "cudos14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9strccpl"})
  //   for (const code of await client.getCodes()) {
  //     for (const addr of await client.getContracts(code.id)) {
  //       result.push(addr);
  //     }
  //   }
  //   return result;
  // }

  async function getCodes() {
    const result = [] as Code[];
    for (const code of await client.getCodes()) {
      result.push(code);
    }
    return result;
  }

  async function getContracts() {
    const result = [] as string[];
    for (const code of await client.getCodes()) {
      for (const addr of await client.getContracts(code.id)) {
        result.push(addr);
      }
    }
    return result;
  }
</script>

<main>
  <h1>Contract Instances</h1>
  <h2>Deployed codes on the chain</h2>
  {#await getCodes()}
    Loading codes data
  {:then codes}
    <table>
      <tr>
        <th>Label</th>
        <th>Code</th>
        <th>Creator</th>
        <th>Address</th>
        <th>Revisions</th>
      </tr>
      {#each codes as code}
        <tr>
          <td>{code.id}</td>
          <td>{code.checksum}</td>
          {#await client.getContracts(code.id) then contracts}
            <td>{contracts.length}</td>
          {/await}
        </tr>
      {/each}
    </table>
  {/await}
  <h2>Deployed contracts on the chain</h2>
  {#await getContracts()}
    Loading contract data
  {:then contracts}
    <table>
      <tr>
        <th>Label</th>
        <th>Code</th>
        <th>Creator</th>
        <th>Address</th>
        <th>Revisions</th>
      </tr>
      {#each contracts as contract}
        {#await client.getContract(contract) then contract}
          <tr>
            <td>{contract.label}</td>
            <td>{contract.codeId}</td>
            <td>{contract.creator}</td>
            <td>
              <Link to="{contract.address}">{contract.address}</Link>
            </td>
            {#await client.getContractCodeHistory(contract.address) then history}
              <td>{history.length}</td>
            {/await}
          </tr>
        {/await}
      {:else}
        Not instantiated.
      {/each}
    </table>
  {/await}
</main>

<!-- <Tabs>
  <Tab title="Codes">
    <h2>Codes</h2>
    <table>
      <tr>
        <th>Id</th>
        <th>Creator</th>
        <th>Checksum</th>
      </tr>
      {#await client.getCodes() then codes}
        {#each codes as code}
          <tr>
            <td>{code.id}</td>
            <td>{code.creator}</td>
            <td>{code.checksum}</td>
          </tr>
          -- <h3>WASM</h3>
            <pre style="overflow: scroll; max-height: 10rem">
              {#await client.getCodeDetails(code.id) then details}
                {toBase64(details.data).replaceAll(/(.{50})/g, "$1\n")}
              {/await}
            </pre> --
          -- <h3>Instances</h3>
          {#await client.getContracts(code.id) then contracts}
            {#each contracts as contract}
              {#await client.getContract(contract) then contract}
                <h4>{contract.label} @ {contract.address}</h4>
                <strong>Creator</strong>
                {contract.creator}
                {#if contract.admin}
                  <strong>Admin</strong> {contract.admin}
                {/if}
                {#if contract.ibcPortId}
                  <strong>IBC port</strong> {contract.ibcPortId}
                {/if}
                {#await client.getAllBalances(contract.address) then balances}
                  <strong>Balances</strong> {JSON.stringify(balances)}
                {/await}
                {#await client.getContractCodeHistory(contract.address) then history}
                  {#each history as histor, i}
                    <strong>Revision</strong>
                    {i}
                    <strong>Code</strong>
                    {histor.codeId}
                    <strong>Operation</strong>
                    {histor.operation}
                    <strong>Message</strong>
                    <pre>{JSON.stringify(histor.msg)}</pre>
                  {/each}
                {/await}
              {/await}
            {:else}
              Not instantiated.
            {/each} --
          -- {/await} --
        {/each}
      {/await}
    </table>
  </Tab>
</Tabs> -->
