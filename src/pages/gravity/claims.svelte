<script lang="ts">
  import * as cudosjs from "cudosjs";
  import { BaseAccount, ModuleAccount, omniClient } from "@/lib/omniclient";
  import Long from "long";
  import { cudos, dump, thousands } from "@/lib/utils";
  import { known } from "@/lib/facts";
  import { Client } from "@/lib/client";
  import { Link } from "@/lib/controllers";
  import { Dictionary, times } from "underscore";
  import Account from "../cosmos/Account.svelte";
  import Lazy from "svelte-lazy";
  import { decodeTxRaw } from "@cosmjs/proto-signing";
  import { sha256 } from "@cosmjs/crypto";
  import { toBase64, toHex } from "@cosmjs/encoding";
  import { entries, orderBy, reverse } from "lodash";
  import { MsgSendToCosmosClaim } from "cudosjs/build/stargate/modules/gravity/proto-types/msgs";
  export var client: Client;
  export let omni = client.omni;
  let nullKey = Uint8Array.from([]);
  let offset = 0;

  let C = prepare().then((c) => c.client);

  async function prepare() {
    return {
      client: await cudosjs.StargateClient.connect(client.network.urls.rpc),
    };
  }

  async function balanceAtHeight(height: number, address: string) {
    const result = await fetch(
      `${client.network.urls.rest}/bank/balances/${address}?height=${height}`
    );
    const data = await result.json();
    for (const result of data.result) {
      if (result.denom === "acudos") return BigInt(data.result[0].amount);
    }
    return BigInt(0);
    // return await (
    //   await client.omni.bank.Balance({
    //     address: address,
    //     denom: "acudos",
    //     height: height,
    //   })
    // ).balance?.amount;
  }

  async function transactions() {
    // const hash = sha256(blockTx);
    // {#await decodeTxRaw(tx) then tx}
    // return await client.getTx(hash);
    const txs = await client.tendermint.txSearchAll({
      query:
        "message.action='/gravity.v1.MsgSendToCosmosClaim' and tx.height > 1400000",
    });
    return reverse(txs.txs);
  }

  interface Claim {
    was: bigint;
    now?: bigint;
    a: MsgSendToCosmosClaim & { height: number };
    b?: MsgSendToCosmosClaim & { height: number };
  }

  async function gravity() {
    return {
      valset: await client.omni.gravity.getCurrentValset(),
    };
  }

  async function claims() {
    // const hash = sha256(blockTx);
    // {#await decodeTxRaw(tx) then tx}
    // return await client.getTx(hash);
    return [];
    const txs = await client.tendermint.txSearchAll({
      query:
        "message.action='/gravity.v1.MsgSendToCosmosClaim' and tx.height > 1400000",
    });
    let claims = {} as Dictionary<Claim>;
    for (const row of txs.txs) {
      const tx = decodeTxRaw(row.tx);
      for (const msgRaw of tx.body.messages) {
        if (msgRaw.typeUrl === "/gravity.v1.MsgSendToCosmosClaim") {
          let msg = (await C).registry.decode(msgRaw) as MsgSendToCosmosClaim;
          if (!claims[Number(msg.eventNonce)]) {
            claims[Number(msg.eventNonce)] = {
              a: { ...msg, height: row.height },
              was: await balanceAtHeight(row.height - 1, msg.cosmosReceiver),
            };
          } else {
            claims[Number(msg.eventNonce)].b = { ...msg, height: row.height };
            claims[Number(msg.eventNonce)].now = await balanceAtHeight(
              row.height,
              msg.cosmosReceiver
            );
          }
        }
      }
    }
    return claims;
  }

  async function getTx(blockTx: Uint8Array) {
    const hash = sha256(blockTx);
    // {#await decodeTxRaw(tx) then tx}
    // return await client.getTx(hash);
    const tx = await client.tendermint.tx({ hash });
    return tx;
  }

  async function block(height: number) {
    return await (
      await omni.tm.GetBlockByHeight({ height: new Long(height) })
    ).block!;
  }

  async function heights(from: number, to: number) {
    const height = await client.getHeight();
    if (from < 0) from += height + 1;
    if (to < 0) to += height + 1;
    const result = [];
    if (to < from) {
      for (let height = to; height > from; --height) result.push(height);
    } else {
      for (let height = from; height < to; ++height) result.push(height);
    }
    return result;
  }
</script>

<main>
  {#await gravity() then gravity}
    <pre>{dump(gravity)}</pre>
  {/await}
  <h2>Transactions</h2>
  {#await claims() then claims}
    <table>
      <tr>
        <th>Num</th>
        <th>Amount</th>
        <th>Sender</th>
        <th>Receiver</th>
        <th>Eth. Height</th>
        <th>Balance Before</th>
        <th>Balance After</th>
        <th>Orchestrator</th>
        <th>Cudos Height</th>
        <th>Block Delay</th>
      </tr>
      {#each reverse(orderBy(entries(claims))) as [num, claim], i}
        <tr class="{i % 2 == 0 ? 'odd' : 'even'}">
          <td>{num}</td>
          <td align="right">{thousands(claim.a.amount)}</td>
          <td>{claim.a.ethereumSender}</td>
          <td>{claim.a.cosmosReceiver}</td>
          <td>{thousands(claim.a.blockHeight)}</td>
          <td align="right">
            {thousands(claim.was)}
          </td>
          <td align="right">
            {thousands(claim.now || "Pending")}
          </td>
          <td>{claim.a.orchestrator}</td>
          <td>{thousands(claim.a.height)}</td>
          <td>
            {#if claim.b}
              {thousands(claim.b.height - claim.a.height)}
            {/if}
          </td>
        </tr>
        <tr class="{i % 2 == 0 ? 'odd' : 'even'}">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          {#if claim.b}
            <td>{claim.b.orchestrator}</td>
            <td>{thousands(claim.b.height)}</td>
            <td></td>
          {/if}
        </tr>
      {/each}
    </table>
  {:catch e}
    {e}
  {/await}
</main>

<style>
  tr.odd {
    background: #eee;
  }
</style>
