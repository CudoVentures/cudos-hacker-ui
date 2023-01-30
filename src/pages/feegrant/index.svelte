<script lang="ts">
  import { Link, Route } from "@/lib/controllers";
  import { Client } from "@/lib/client";
  import Page from "@/ui/Page.svelte";
  import { Task } from "@/lib/task";
  import { useModal } from "@/lib/utils";
  import * as FeegrantTx from "cosmjs-types/cosmos/feegrant/v1beta1/tx";
  import { Grant, BasicAllowance } from "@/protos/cosmos/feegrant/v1beta1/feegrant";
  import { QueryAllowancesByGranterRequest } from "@/protos/cosmos/feegrant/v1beta1/query";
    import Await from "@/lib/await.svelte";

  export let client: Client;

  let modal = useModal();
  let grantee = "";

  function grant() {
    Task.new(modal, async () => {
      const msg = {
        typeUrl: "/cosmos.feegrant.v1beta1.MsgGrantAllowance",
        value: {
          grantee: grantee,
          granter: client.address!,
          allowance: {
            typeUrl: "/cosmos.feegrant.v1beta1.BasicAllowance",
            value: {},
          },
        },
      };
      return await client.signAndBroadcast(client.address!, [msg], "auto");
    });
  }

  const grantsFor = (grantee) => client.omni.feegrant.Allowances({ grantee });
  const grants = client.omni.feegrant.AllowancesByGranter({ granter: client.address! });
</script>

<Page title="Feegrant">
  <h1>Add grant</h1>
  <input bind:value="{grantee}" />
  <button on:click="{grant}">Grant</button>
  <h1>Grants for grantee</h1>
  <Await promise={grantsFor(grantee)} let:data>
    {JSON.stringify(data)}
  </Await>
</Page>
