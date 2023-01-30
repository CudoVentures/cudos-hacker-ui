import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";

import { QueryClientImpl as AuthQueryClientImpl } from "cosmjs-types/cosmos/auth/v1beta1/query"
import { QueryClientImpl as AuthzQueryClientImpl } from "cosmjs-types/cosmos/authz/v1beta1/query"
import { QueryClientImpl as BankQueryClientImpl } from "cosmjs-types/cosmos/bank/v1beta1/query"
import { ReflectionServiceClientImpl as ReflectionQueryClientImpl } from "cosmjs-types/cosmos/base/reflection/v1beta1/reflection"
import { ServiceClientImpl as TendermintQueryClientImpl } from "cosmjs-types/cosmos/base/tendermint/v1beta1/query"
import { QueryClientImpl as DistributionQueryClientImpl } from "cosmjs-types/cosmos/distribution/v1beta1/query"
import { QueryClientImpl as EvidenceQueryClientImpl } from "cosmjs-types/cosmos/evidence/v1beta1/query"
import { QueryClientImpl as FeegrantQueryClientImpl } from "cosmjs-types/cosmos/feegrant/v1beta1/query"
import { QueryClientImpl as GovQueryClientImpl } from "cosmjs-types/cosmos/gov/v1beta1/query"
import { QueryClientImpl as MintQueryClientImpl } from "cosmjs-types/cosmos/mint/v1beta1/query"
import { QueryClientImpl as ParamsQueryClientImpl } from "cosmjs-types/cosmos/params/v1beta1/query"
import { QueryClientImpl as SlashingQueryClientImpl } from "cosmjs-types/cosmos/slashing/v1beta1/query"
import { QueryClientImpl as StakingQueryClientImpl } from "cosmjs-types/cosmos/staking/v1beta1/query"
import { QueryClientImpl as UpgradeQueryClientImpl } from "cosmjs-types/cosmos/upgrade/v1beta1/query"
import { QueryClientImpl as IbcTransferQueryClientImpl } from "cosmjs-types/ibc/applications/transfer/v1/query"
import { QueryClientImpl as IbcChannelQueryClientImpl } from "cosmjs-types/ibc/core/channel/v1/query"
import { QueryClientImpl as IbcClientQueryClientImpl } from "cosmjs-types/ibc/core/client/v1/query"
import { QueryClientImpl as IbcConnectionQueryClientImpl } from "cosmjs-types/ibc/core/connection/v1/query"
import { QueryClientImpl as WasmQueryClientImpl } from "cosmjs-types/cosmwasm/wasm/v1/query"
import { Client } from "./client";
import { GravityQueryClient } from "cudosjs/build/stargate/modules/gravity/clients/queryClient";

export { BaseAccount, ModuleAccount } from 'cosmjs-types/cosmos/auth/v1beta1/auth.js';
export { PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';

export interface OmniClient {
  auth: AuthQueryClientImpl
  authz: AuthzQueryClientImpl
  bank: BankQueryClientImpl
  distribution: DistributionQueryClientImpl
  evidence: EvidenceQueryClientImpl
  feegrant: FeegrantQueryClientImpl
  gov: GovQueryClientImpl
  mint: MintQueryClientImpl
  params: ParamsQueryClientImpl
  slashing: SlashingQueryClientImpl
  staking: StakingQueryClientImpl
  upgrade: UpgradeQueryClientImpl
  tm: TendermintQueryClientImpl
  reflect: ReflectionQueryClientImpl
  ibc: {
    transfer: IbcTransferQueryClientImpl
    channel: IbcChannelQueryClientImpl
    client: IbcClientQueryClientImpl
    connection: IbcConnectionQueryClientImpl
  }
  wasm: WasmQueryClientImpl
  gravity: GravityQueryClient,
}

export function omniClient(client: Client): OmniClient {
  let querier = client.forceGetQueryClient();
  let rpc = createProtobufRpcClient(querier)
  return {
    auth: new AuthQueryClientImpl(rpc),
    authz: new AuthzQueryClientImpl(rpc),
    bank: new BankQueryClientImpl(rpc),
    distribution: new DistributionQueryClientImpl(rpc),
    evidence: new EvidenceQueryClientImpl(rpc),
    feegrant: new FeegrantQueryClientImpl(rpc),
    gov: new GovQueryClientImpl(rpc),
    mint: new MintQueryClientImpl(rpc),
    params: new ParamsQueryClientImpl(rpc),
    slashing: new SlashingQueryClientImpl(rpc),
    staking: new StakingQueryClientImpl(rpc),
    upgrade: new UpgradeQueryClientImpl(rpc),
    tm: new TendermintQueryClientImpl(rpc),
    reflect: new ReflectionQueryClientImpl(rpc),
    ibc: {
      transfer: new IbcTransferQueryClientImpl(rpc),
      channel: new IbcChannelQueryClientImpl(rpc),
      client: new IbcClientQueryClientImpl(rpc),
      connection: new IbcConnectionQueryClientImpl(rpc),
    },
    wasm: new WasmQueryClientImpl(rpc),
    gravity: new GravityQueryClient(client.tendermint),
  }
}
