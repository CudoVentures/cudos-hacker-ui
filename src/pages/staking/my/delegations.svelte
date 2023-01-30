<script lang="ts">
  import {
    cudos,
    dump,
    generator,
    loader,
    poll,
    procure,
    thousands,
  } from "@/lib/utils";
  import PropertyList from "@/ui/PropertyList.svelte";
  import Property from "@/ui/Property.svelte";
  import { Client } from "@/lib/client";
  import { sortBy } from "underscore";
  import {
    MsgDelegate,
    MsgUndelegate,
    MsgBeginRedelegate,
    MsgCreateValidator,
  } from "cosmjs-types/cosmos/staking/v1beta1/tx";
  import {
    DelegationResponse,
    RedelegationResponse,
    UnbondingDelegation,
    Validator,
  } from "cosmjs-types/cosmos/staking/v1beta1/staking";
  import { sum } from "lodash";
  import { Writable, writable } from "svelte/store";
  import Blart from "@/ui/Blart.svelte";

  export let client: Client;

  interface Data {
    validators: Validator[];
    delegations: DelegationResponse[];
    unbondings: UnbondingDelegation[];
    redelegations: RedelegationResponse[];
  }

  let data = generator(
    async function* () {
      let datum : Data = {
        validators: [],
        delegations: [],
        unbondings: [],
        redelegations: [],
      };
      await client.connect_keplr();
      yield datum;
      datum.delegations = await client.omni.staking
        .DelegatorDelegations({
          delegatorAddr: client.address!,
        })
        .then((v) => v.delegationResponses);
      yield datum;
      datum.validators = await client.omni.staking
        .Validators({ status: "" })
        .then((v) => v.validators);
      yield datum;
      datum.unbondings = await client.omni.staking
        .DelegatorUnbondingDelegations({
          delegatorAddr: client.address!,
        })
        .then((v) => v.unbondingResponses);
      let redelegations = [] as RedelegationResponse[];
      let promises = [] as Promise<unknown>[];
      for (const to of datum.delegations) {
        for (const from of datum.validators) {
          promises.push(
            client.omni.staking
              .Redelegations({
                delegatorAddr: client.address!,
                srcValidatorAddr: from.operatorAddress,
                dstValidatorAddr: to.delegation?.validatorAddress!,
              })
              .then((r) => redelegations.push(...r.redelegationResponses))
              .catch(() => {})
          );
        }
      }
      await Promise.all(promises);
      yield {
        ...datum,
        redelegations: redelegations,
      };
    }
  );

  let delegateForm = {
    validator: undefined as undefined | string,
    amount: undefined as undefined | string,
  };

  async function delegate() {
    console.log(delegateForm.amount);
    const msg = {
      typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
      value: MsgDelegate.fromPartial({
        delegatorAddress: client.address!,
        validatorAddress: delegateForm.validator,
        amount: { denom: "acudos", amount: delegateForm.amount },
      }),
    };
    client.signAndBroadcast(client.address!, [msg], "auto", "");
  }

  let undelegateForm = {
    validator: undefined as undefined | string,
    amount: undefined as undefined | string,
  };

  async function undelegate() {
    const msg = {
      typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
      value: MsgUndelegate.fromPartial({
        delegatorAddress: client.address!,
        validatorAddress: undelegateForm.validator,
        amount: { denom: "acudos", amount: undelegateForm.amount },
      }),
    };
    client.signAndBroadcast(client.address!, [msg], "auto", "");
  }

  let redelegateForm = {
    from: undefined as undefined | string,
    to: undefined as undefined | string,
    amount: undefined as undefined | string,
  };

  async function redelegate() {
    const msg = {
      typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
      value: MsgBeginRedelegate.fromPartial({
        delegatorAddress: client.address!,
        validatorSrcAddress: redelegateForm.from,
        validatorDstAddress: redelegateForm.to,
        amount: { denom: "acudos", amount: redelegateForm.amount },
      }),
    };
    client.signAndBroadcast(client.address!, [msg], "auto", "");
  }
</script>

<main>
  <Blart data="{$data}" let:data>
    <h2>Delegations</h2>
    <table>
      <tr>
        <th>Validator</th>
        <th>Amount</th>
        <th>Redelegating</th>
        <th>Unbonding</th>
        <th>Select</th>
      </tr>
      {#each data.delegations as delegation}
        <tr>
          <td>{delegation.delegation?.validatorAddress}</td>
          <td>{delegation.balance?.amount}</td>
          <td>
            {sum(
              data.redelegations
                .filter(
                  (r) =>
                    r.redelegation?.validatorDstAddress ==
                    delegation.delegation?.validatorAddress
                )
                .map((r) => {
                  return sum(r.entries.map((e) => BigInt(e.balance)));
                })
            )}
          </td>
          <td>
            {sum(
              data.unbondings
                .filter(
                  (r) =>
                    r.validatorAddress ==
                    delegation.delegation?.validatorAddress
                )
                .map((r) => {
                  return sum(r.entries.map((e) => BigInt(e.balance)));
                })
            )}
          </td>
          <td>
            <button
              on:click="{() => {
                redelegateForm.from = undelegateForm.validator =
                  delegation.delegation?.validatorAddress;
                redelegateForm.amount = undelegateForm.amount =
                  delegation.balance?.amount;
              }}">Select</button>
          </td>
        </tr>
      {/each}
    </table>
    <h2>Redelegations in progress</h2>
    <table>
      <tr>
        <th>From</th>
        <th>To</th>
        <th>Amount</th>
        <th>Height</th>
        <th>Completes at</th>
      </tr>
      {#each data.redelegations as redelegation}
        {#each redelegation.entries as entry}
          <tr>
            <td>{redelegation.redelegation?.validatorSrcAddress}</td>
            <td>{redelegation.redelegation?.validatorDstAddress}</td>
            <td>{entry.balance}</td>
            <td>{thousands(entry.redelegationEntry?.creationHeight || 0)}</td>
            <td
              >{new Date(
                Number(entry.redelegationEntry?.completionTime?.seconds || 0) *
                  1000
              ).toISOString()}</td>
          </tr>
        {/each}
      {/each}
    </table>
    <h2>Undelegations in progress</h2>
    <table>
      <tr>
        <th>Validator</th>
        <th>Amount</th>
        <th>Height</th>
        <th>Completes at</th>
      </tr>
      {#each data.unbondings as unbonding}
        {#each unbonding.entries as entry}
          <tr>
            <td>{unbonding.validatorAddress}</td>
            <td>{entry.balance}</td>
            <td>{thousands(entry.creationHeight)}</td>
            <td
              >{new Date(
                Number(entry.completionTime?.seconds) * 1000
              ).toISOString()}</td>
          </tr>
        {/each}
      {/each}
    </table>
    <h2>Delegate</h2>
    <PropertyList>
      <Property label="Amount">
        <input bind:value="{delegateForm.amount}" /> acudos
      </Property>
      <Property label="To">
        <select bind:value="{delegateForm.validator}">
          {#each data.validators as validator}
            <option value="{validator.operatorAddress}">
              {validator.description?.moniker} ({validator.operatorAddress})
            </option>
          {/each}
        </select>
      </Property>
      <Property>
        <button on:click="{() => delegate()}">Delegate</button>
      </Property>
    </PropertyList>
    <h2>Undelegate</h2>
    <PropertyList>
      <Property label="Amount">
        <input bind:value="{undelegateForm.amount}" /> acudos
      </Property>
      <Property label="To">
        <select bind:value="{undelegateForm.validator}">
          {#each data.validators as validator}
            <option value="{validator.operatorAddress}">
              {validator.description?.moniker} ({validator.operatorAddress})
            </option>
          {/each}
        </select>
      </Property>
      <Property>
        <button on:click="{() => undelegate()}">Undelegate</button>
      </Property>
    </PropertyList>
    <h2>Redelegate</h2>
    <PropertyList>
      <Property label="Amount">
        <input bind:value="{redelegateForm.amount}" /> acudos
      </Property>
      <Property label="From">
        <select bind:value="{redelegateForm.from}">
          {#each data.validators as validator}
            <option value="{validator.operatorAddress}">
              {validator.description?.moniker} ({validator.operatorAddress})
            </option>
          {/each}
        </select>
      </Property>
      <Property label="To">
        <select bind:value="{redelegateForm.to}">
          {#each data.validators as validator}
            <option value="{validator.operatorAddress}">
              {validator.description?.moniker} ({validator.operatorAddress})
            </option>
          {/each}
        </select>
      </Property>
      <Property>
        <button on:click="{() => redelegate()}">Redelegate</button>
      </Property>
    </PropertyList>
  </Blart>
</main>
