<script lang="ts">
  import * as cudosjs from "cudosjs";
  import { cudos, dump } from "@/lib/utils";
  import { Client } from "@/lib/client";
  import { Log } from "@cosmjs/stargate/build/logs";
  import {
    decodeTxRaw,
    fromHex,
    fromUtf8,
    sha256,
    toHex,
    toUtf8,
  } from "cudosjs";
  import { object } from "underscore";
  export let client: Client;
  export let address: string;

  function tryParseJSON(data: string) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  async function search(query: string) {
    const txs = (
      await client.tendermint.txSearch({
        query,
        per_page: 1000,
        order_by: "desc",
      })
    ).txs;
    // query: "tx.height > 0 and transfer.recipient exists",
    // query: "tx.height > 0 and transfer.recipient = 'cudos1n8a8f580pjq4da82asd3tgdkwlxydecpaws8yg'",
    // "tx.height > 0 and transfer.recipient = 'cudos1vfgc45smrr5vuydzqvv0w8vc2gknxm9z9xf5yg'",
    return await Promise.all(
      txs.map(async (raw) => {
        let block = await client.tendermint.block(raw.height);
        let tx = decodeTxRaw(raw.tx);
        return {
          height: raw.height,
          // blockHash: toHex(block.blockId.hash),
          time: block.block.header.time,
          txHash: toHex(sha256(raw.tx)),
          // index: raw.index,
          // proof: raw.proof,
          // result: {
          // data: toHex(raw.result.data!),
          // code: raw.result.code,
          // codeSpace: raw.result.codeSpace,
          gasWanted: raw.result.gasWanted,
          gasUsed: raw.result.gasUsed,
          // log: tx.result.log,
          fee:
            BigInt(tx.authInfo.fee?.amount[0].amount!) +
            tx.authInfo.fee?.amount[0].denom!,
          events: raw.result.events.flatMap((e) => {
            // if (!["transfer"].includes(e.type))
            // if (e.type !== "transfer")
            //   return []
            return [
              {
                [e.type]: object(
                  e.attributes.map((a) => {
                    return [fromUtf8(a.key), fromUtf8(a.value)];
                  })
                ),
              },
            ];
          }),
          // },
          // tx: {
          // granter: tx.authInfo.fee?.granter,
          // payer: tx.authInfo.fee?.payer,
          // signatures: tx.signatures.map((s) => toHex(s)),
          // memo: tx.body.memo,
          // options: tx.body.extensionOptions,
          messages: tx.body.messages.map((m) => {
            let data = null as any;
            try {
              data = client.registry?.decode(m);
            } catch (e) {
              data = toHex(m.value);
            }
            if (m.typeUrl === "/cosmwasm.wasm.v1.MsgExecuteContract") {
              data.msg = JSON.parse(fromUtf8(data.msg));
            }
            return { [m.typeUrl]: data };
          }),
          // },
        };
        // tx.tx
        // return tx
      })
    );
  }

  async function prepare() {
    let queries = [
      `message.sender = '${address}'`,
      // `transfer.recipient = '${address}'`,
      // `transfer.sender = '${address}'`,
    ]
    let results = await Promise.all(queries.map(q => search(q)))
    return results.flatMap(r => r);
  }
</script>

<main>
  {#await prepare() then txs}
    <table>
      {#each txs as tx}
        <tr><td><pre>{dump(tx)}</pre></td></tr>
        <tr><td>-</td></tr>
        <!-- {#each log as row}
          {#if row.transfer}
            <tr>
              <td>{row.message.action}</td>
              <td align="right">
                {#if row.coin_received && row.coin_received.receiver == address}
                  {row.coin_received.amount}
                {/if}
              </td>
              <td align="right">
                {#if row.coin_spent && row.coin_spent.spender == address}
                  {row.coin_spent.amount}
                {/if}
              </td>
              <td>{dump(row.transfer)}</td>
            </tr>
          {/if}
        {/each} -->
      {/each}
    </table>
  {:catch e}
    <h2>{JSON.parse(e.message).message}</h2>
    <p>{JSON.parse(e.message).data}</p>
  {/await}
</main>
