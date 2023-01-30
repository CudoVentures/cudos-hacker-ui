<script lang="ts">
  import Page from "@/ui/Page.svelte";
  import { Client } from "@/lib/client";
  import {  format } from "@/lib/utils";
  import _ from "underscore";
  import { Big } from "big.js";
  import { Task, TaskView } from "@/lib/task";

  export let client: Client;
  export let contract_address: string;

  function big(n: string | number | Big | undefined) {
    if (!n) return Big(0);
    else return Big(n);
  }

  interface Rate {
    denom: string;
    name: string;
    rate: string;
    exponent: number;
    liquidity: string;
    yourLiquidity?: string;
  }

  Big.DP = 36;
  Big.RM = Big.roundDown;

  let task = Task.none;

  let mode: "FROM_EXACT" | "TO_EXACT" = "FROM_EXACT";

  let rates: Record<string, Rate> = {};

  let fromDenom: string = "acudos";
  let fromAmount: string = "100";
  $: fromAtoms = Big(0);
  $: fromRate = rates[fromDenom];
  $: fromLiquidity = fromRate?.yourLiquidity;

  let toDenom: string = "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858";
  let toAmount: string = "1";
  $: toAtoms = Big(0);
  $: toRate = rates[toDenom];
  $: toLiquidity = toRate?.liquidity;

  let slippedAmount = Big(0);

  let slippage: number = 0;

  $: {
    [rates, fromAmount, toAmount, slippage, mode];
    updateFromTo();
  }

  function updateFromTo() {
    if (!fromRate || !toRate) return;
    if (mode == "FROM_EXACT") {
      fromAtoms = Big(fromAmount || "0").mul(Big(10).pow(fromRate.exponent));
      toAtoms = fromAtoms.mul(Big(fromRate.rate)).div(Big(toRate.rate));
      toAmount = toAtoms.div(Big(10).pow(toRate.exponent)).round(fromRate.exponent, Big.roundDown).toFixed(toRate.exponent);
      slippedAmount = slip(toAmount);
    } else {
      toAtoms = Big(toAmount || "0").mul(Big(10).pow(toRate.exponent));
      fromAtoms = toAtoms.mul(Big(toRate.rate)).div(Big(fromRate.rate));
      fromAmount = fromAtoms.div(Big(10).pow(fromRate.exponent)).round(fromRate.exponent, Big.roundUp).toFixed();
      slippedAmount = slip(fromAmount);
    }
  }

  async function loadData() {
    const balances = _.object((await client.getAllBalances(client.address!)).map((b) => [b.denom, b.amount]));
    const list = (
      (await client.queryContractSmart(contract_address, {
        rate_list: {},
      })) as Rate[]
    ).map((r) => ({ ...r, yourLiquidity: balances[r.denom] || "0" }));
    const ratePairs = list.map((r) => [r.denom, r] as [string, Rate]);
    const rateMap = _.object(ratePairs);
    rates = rateMap;
    updateFromTo();
  }

  loadData();

  setInterval(loadData, 1000);

  function slip(n: string | Big) {
    if (mode === "FROM_EXACT")
      return Big(n)
        .mul(100 - slippage)
        .div(100)
        .round(toRate.exponent, Big.roundUp);
    else
      return Big(n)
        .mul(100)
        .div(100 - slippage)
        .round(fromRate.exponent, Big.roundDown);
  }

  async function exchange() {
    let msg: any = {};
    if (mode === "FROM_EXACT") {
      const from = Big(fromAtoms).toFixed(0);
      const to = slip(toAtoms).toFixed(0);
      msg = {
        exchange_from: {
          from: { denom: fromDenom, amount: from },
          to: { denom: toDenom, amount: to },
        },
      };
    } else {
      const from = Big(fromAtoms).toFixed(0);
      const to = slip(toAtoms).toFixed(0);
      msg = {
        exchange_to: {
          from: { denom: fromDenom, amount: from },
          to: { denom: toDenom, amount: to },
        },
      };
    }
    task = Task.new(client.execute(client.address!, contract_address, msg, "auto", undefined, [{ denom: fromDenom, amount: fromAtoms.toFixed(0) }]));
    $task.then(() => loadData());
  }
</script>

<Page title="Exchange Tokens">
  <section>
    <div>
      Mode
      <select bind:value="{mode}">
        <option value="FROM_EXACT">Exact from</option>
        <option value="TO_EXACT">Exact to </option>
      </select>
    </div>
    <div>
      From
      <span>
        <select bind:value="{fromDenom}">
          {#each _.values(rates).filter((r) => r.yourLiquidity != "0") as rate}
            <option value="{rate.denom}">{rate.name}</option>
          {/each}
        </select>
        <input bind:value="{fromAmount}" on:input="{() => (mode = 'FROM_EXACT')}" />
        {#if mode === "TO_EXACT"}
          &nbsp; Max slippage:
          <select bind:value="{slippage}">
            <option value="{0}">0%</option>
            <option value="{1}">1%</option>
            <option value="{3}">3%</option>
            <option value="{5}">5%</option>
          </select>
        {/if}
      </span>
      (You have {format(fromLiquidity ?? "0", fromRate?.exponent ?? 0)} available)
    </div>
    <div>
      To
      <span>
        <select bind:value="{toDenom}">
          {#each _.values(rates).filter((r) => r.liquidity != "0") as rate}
            <option value="{rate.denom}">{rate.name}</option>
          {/each}
        </select>
        <input bind:value="{toAmount}" on:input="{() => (mode = 'TO_EXACT')}" />
        {#if mode === "FROM_EXACT"}
          &nbsp; Max slippage:
          <select bind:value="{slippage}">
            <option value="{0}">0%</option>
            <option value="{1}">1%</option>
            <option value="{3}">3%</option>
            <option value="{5}">5%</option>
          </select>
        {/if}
      </span>
      (We have {format(toLiquidity ?? "0", toRate?.exponent ?? 0)} available)
    </div>
    <div>
      {#if fromRate && toRate}
        {#if mode === "FROM_EXACT"}
          <p>
            Exchange exactly {fromAmount}
            {fromRate.name} for at least {slippedAmount}
            {toRate.name}.
          </p>
        {:else}
          <p>
            Exchange at most {slippedAmount}
            {fromRate.name} for exactly {toAmount}
            {toRate.name}.
          </p>
        {/if}
      {/if}
    </div>
    <div>
      <p>
        {#if $task.running}
          Performing exchange...
        {:else if !fromRate || !toRate}
          Pick a pair of tokens.
        {:else if fromDenom === toDenom}
          Not a very sensible exchange.
        {:else if big(fromAmount).eq(Big(0)) || big(toAmount).eq(Big(0))}
          Will not perform a zero-value exchange.
        {:else if fromLiquidity && Big(fromLiquidity).lt(Big(fromAtoms))}
          You don't have enough money for that exchange.
        {:else if toLiquidity && Big(toLiquidity).lt(Big(toAtoms))}
          We don't have enough money for that exchange.
        {:else}
          <button on:click="{() => exchange()}">Exchange</button>
        {/if}
      </p>
    </div>
    <div>
      <TaskView store="{$task}" />
    </div>
  </section>
</Page>

<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
  }
</style>
