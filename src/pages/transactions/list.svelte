<script lang="ts">
  import * as cudosjs from "cudosjs";
  import { cudos, dump, thousands } from "@/lib/utils";
  import { Client } from "@/lib/client";
  import { Log } from "@cosmjs/stargate/build/logs";
  import _ from "underscore";
  import Long from "long";
  import { sha256, toHex } from "cudosjs";
  export var client: Client;

  function tryParseJSON(data: string) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  async function search(query: string) {
    const txs = (await client.tendermint.txSearch({ query, per_page: 10 })).txs;
    return await Promise.all(
      txs.map(async (tx) => {
        // const txi = await client.getTx(toHex(sha256(tx.tx)))
        const dtx = cudosjs.decodeTxRaw(tx.tx);
        const gasWanted = BigInt(tx.result.gasWanted);
        const gasUsed = BigInt(tx.result.gasUsed);
        if (!dtx.authInfo.fee?.amount[0]) {
          return {
            height: tx.height,
            hash: toHex(tx.hash).toUpperCase(),
            gasWanted,
            gasUsed,
            fee: BigInt(0),
            gasPriceEstimate: BigInt(0),
            cost: BigInt(0),
            profit: BigInt(0),
            tx: dtx,
            margin: BigInt(0),
          };
        }
        const amount = BigInt(dtx.authInfo.fee?.amount[0].amount!);
        const gasPriceEstimate = amount / gasWanted;
        // const gasPriceEstimate = BigInt("5000000000000");
        const truePrice = gasPriceEstimate * gasUsed;
        const profit = amount - truePrice;
        return {
          height: tx.height,
          hash: toHex(tx.hash).toUpperCase(),
          gasWanted,
          gasUsed,
          fee: amount,
          gasPriceEstimate,
          cost: truePrice,
          profit,
          tx: dtx,
          margin: (BigInt(100) * profit) / amount,
        };
      })
    );
  }

  async function prepare() {
    return await search(`tx.height > 1690000`);
  }
</script>

<main>
  {#await prepare() then data}
    <table>
      <thead
        ><tr>
          <th>Height</th>
          <th>TX</th>
          <th align="right">Gas Used</th>
          <th align="right">Gas Wanted</th>
          <th align="right">Gas Price</th>
          <th align="right">Fee</th>
          <th align="right">Cost</th>
          <th align="right">Profit</th>
          <th align="right">Margin</th>
        </tr><tr>
          <!-- <th colspan="2"></th> -->
          <th colspan="3" align="right">
            {thousands(data.map((d) => d.gasUsed).reduce((c, p) => c + p))}
          </th>
          <th align="right">
            {thousands(data.map((d) => d.gasWanted).reduce((c, p) => c + p))}
          </th>
          <th align="right">
            {cudos(
              (data.map((d) => d.gasPriceEstimate).reduce((c, p) => c + p) /
                BigInt(data.length)) *
                BigInt("1000000"),
              "µ"
            )}
          </th>
          <th align="right">
            {cudos(data.map((d) => d.fee).reduce((c, p) => c + p))}
          </th>
          <th align="right">
            {cudos(data.map((d) => d.cost).reduce((c, p) => c + p))}
          </th>
          <th align="right">
            {cudos(data.map((d) => d.profit).reduce((c, p) => c + p))}
          </th>
          <th align="right">
            {data.map((d) => d.margin).reduce((c, p) => c + p) /
              BigInt(data.length)}%
          </th>
        </tr></thead>
      {#each data as row}
        <tr>
          <td>{row.height}</td>
          <td>{row.hash}</td>
          <td align="right">{thousands(row.gasUsed)}</td>
          <td align="right">{thousands(row.gasWanted)}</td>
          <td align="right"
            >{cudos(row.gasPriceEstimate * BigInt(1000000), "µ")}</td>
          <td align="right">{cudos(row.fee)}</td>
          <td align="right">{cudos(row.cost)}</td>
          <td align="right">{cudos(row.profit)}</td>
          <td align="right">{row.margin}%</td>
        </tr>
        {#each row.tx.body.messages as msg}
          <tr>
            <td></td>
            <td>{msg.typeUrl}</td>
            <!-- {#await (async () => client.cudos?.registry.decode(msg))() then msg}
              <td colspan="8">
                <pre>{dump(msg)}</pre>
              </td>
            {:catch e}
              {e}
            {/await} -->
          </tr>
        {/each}
      {/each}
    </table>
  {:catch e}
    {e}
  {/await}
</main>
