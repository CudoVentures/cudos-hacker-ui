import { ChangeAdminResult, Code, CodeDetails, Contract, ContractCodeHistoryEntry, CosmWasmClient, ExecuteResult, InstantiateOptions, InstantiateResult, JsonObject, MigrateResult, SigningCosmWasmClient, UploadResult } from "@cosmjs/cosmwasm-stargate";
import { EncodeObject, Registry } from "@cosmjs/proto-signing";
import { Account, Block, Coin, DeliverTxResponse, IndexedTx, SearchTxFilter, SearchTxQuery, SequenceResponse, SignerData, SigningStargateClient, StargateClient, StdFee } from "@cosmjs/stargate";
import { Network } from "./network";
import { OmniClient, omniClient } from "./omniclient";
import { Height } from "cosmjs-types/ibc/core/client/v1/client";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { Key } from "@keplr-wallet/types";
import { SigningCosmWasmClient as CudosSigningCosmWasmClient } from "cudosjs";

export class Client {

  public omni: OmniClient
  public registry!: Registry

  public constructor(
    public network: Network,
    public chainId: string,
    public stargate: StargateClient,
    public cosmwasm: CosmWasmClient,
    public key?: Key,
    public address?: string,
    public signingStargate?: SigningStargateClient,
    public signingCosmwasm?: SigningCosmWasmClient,
    public cudos?: CudosSigningCosmWasmClient,
  ) {
    this.omni = omniClient(this)
  }

  async getChainId() {
    return this.chainId
  }

  async broadcastTx(tx: Uint8Array, timeoutMs?: number, pollIntervalMs?: number): Promise<DeliverTxResponse> {
    return this.stargate.broadcastTx(tx, timeoutMs, pollIntervalMs)
  }

  async clearAdmin(senderAddress: string, contractAddress: string, fee: StdFee | "auto" | number, memo?: string): Promise<ChangeAdminResult> {
    if (!this.signingCosmwasm)
      throw "Need signing account";
    return this.signingCosmwasm.clearAdmin(senderAddress, contractAddress, fee, memo)
  }

  async delegateTokens(delegatorAddress: string, validatorAddress: string, amount: Coin, fee: StdFee | "auto" | number, memo?: string): Promise<DeliverTxResponse> {
    if (!this.signingCosmwasm)
      throw "Need signing account";
    return this.signingCosmwasm.delegateTokens(delegatorAddress, validatorAddress, amount, fee, memo)
  }

  async execute(senderAddress: string, contractAddress: string, msg: Record<string, unknown>, fee: StdFee | "auto" | number, memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> {
    if (!this.signingCosmwasm)
      throw "Need signing account";
    return this.signingCosmwasm.execute(senderAddress, contractAddress, msg, fee, memo, funds)
  }

  async getAccount(searchAddress: string): Promise<Account | null> {
    return this.stargate.getAccount(searchAddress)
  }

  async getAllBalances(address: string): Promise<readonly Coin[]> {
    return this.stargate.getAllBalances(address)
  }

  async getBalance(address: string, searchDenom: string): Promise<Coin> {
    return this.stargate.getBalance(address, searchDenom)
  }

  async getBalanceStaked(address: string): Promise<Coin | null> {
    return this.stargate.getBalanceStaked(address)
  }

  async getBlock(height?: number): Promise<Block> {
    return this.stargate.getBlock(height)
  }

  async getCodeDetails(codeId: number): Promise<CodeDetails> {
    return this.cosmwasm.getCodeDetails(codeId)
  }

  async getCodes(): Promise<readonly Code[]> {
    return this.cosmwasm.getCodes()
  }

  async getContract(address: string): Promise<Contract> {
    return this.cosmwasm.getContract(address)
  }

  async getContractCodeHistory(address: string): Promise<readonly ContractCodeHistoryEntry[]> {
    return this.cosmwasm.getContractCodeHistory(address)
  }

  async getContracts(codeId: number): Promise<readonly string[]> {
    return this.cosmwasm.getContracts(codeId)
  }

  async getDelegation(delegatorAddress: string, validatorAddress: string): Promise<Coin | null> {
    return this.stargate.getDelegation(delegatorAddress, validatorAddress)
  }

  async getHeight(): Promise<number> {
    return this.stargate.getHeight()
  }

  async getSequence(address: string): Promise<SequenceResponse> {
    return this.stargate.getSequence(address)
  }

  async getTx(id: string): Promise<IndexedTx> {
    const tx = await this.stargate.getTx(id)
    if (!tx)
      throw `not found: getTx(${id})`
    return tx;
  }

  async instantiate(senderAddress: string, codeId: number, msg: Record<string, unknown>, label: string, fee: StdFee | "auto" | number, options?: InstantiateOptions): Promise<InstantiateResult> {
    if (!this.signingCosmwasm)
      throw "Need signing account";
    return this.signingCosmwasm.instantiate(senderAddress, codeId, msg, label, fee, options)
  }

  async migrate(senderAddress: string, contractAddress: string, codeId: number, migrateMsg: Record<string, unknown>, fee: StdFee | "auto" | number, memo?: string): Promise<MigrateResult> {
    if (!this.signingCosmwasm)
      throw "Need signing account";
    return this.signingCosmwasm.migrate(senderAddress, contractAddress, codeId, migrateMsg, fee, memo)
  }

  async queryContractRaw(address: string, key: Uint8Array): Promise<Uint8Array | null> {
    return this.cosmwasm.queryContractRaw(address, key)
  }

  async queryContractSmart(address: string, queryMsg: Record<string, unknown>): Promise<JsonObject> {
    return this.cosmwasm.queryContractSmart(address, queryMsg)
  }

  async searchTx(query: SearchTxQuery, filter?: SearchTxFilter): Promise<readonly IndexedTx[]> {
    return this.stargate.searchTx(query, filter)
  }

  async sendIbcTokens(senderAddress: string, recipientAddress: string, transferAmount: Coin, sourcePort: string, sourceChannel: string, timeoutHeight: Height | undefined, timeoutTimestamp: number | undefined, fee: StdFee | "auto" | number, memo?: string): Promise<DeliverTxResponse> {
    if (!this.signingStargate)
      throw "Need signing account";
    return this.signingStargate.sendIbcTokens(senderAddress, recipientAddress, transferAmount, sourcePort, sourceChannel, timeoutHeight, timeoutTimestamp, fee, memo)
  }

  async sendTokens(senderAddress: string, recipientAddress: string, amount: readonly Coin[], fee: StdFee | "auto" | number, memo?: string): Promise<DeliverTxResponse> {
    if (!this.signingCosmwasm)
      throw "Need signing account";
    return this.signingCosmwasm.sendTokens(senderAddress, recipientAddress, amount, fee, memo)
  }

  async sign(signerAddress: string, messages: readonly EncodeObject[], fee: StdFee, memo: string, explicitSignerData?: SignerData): Promise<TxRaw> {
    if (!this.signingCosmwasm)
      throw "Need signing account";
    return this.signingCosmwasm.sign(signerAddress, messages, fee, memo, explicitSignerData)
  }

  async signAndBroadcast(signerAddress: string, messages: readonly EncodeObject[], fee: StdFee | "auto" | number, memo?: string): Promise<DeliverTxResponse> {
    if (!this.signingCosmwasm)
      throw "Need signing account";
    return this.signingCosmwasm.signAndBroadcast(signerAddress, messages, fee, memo)
  }

  async simulate(signerAddress: string, messages: readonly EncodeObject[], memo: string | undefined): Promise<number> {
    if (!this.signingCosmwasm)
      throw "Need signing account";
    return this.signingCosmwasm.simulate(signerAddress, messages, memo)
  }

  async undelegateTokens(delegatorAddress: string, validatorAddress: string, amount: Coin, fee: StdFee | "auto" | number, memo?: string): Promise<DeliverTxResponse> {
    if (!this.signingCosmwasm)
      throw "Need signing account";
    return this.signingCosmwasm.undelegateTokens(delegatorAddress, validatorAddress, amount, fee, memo)
  }

  async updateAdmin(senderAddress: string, contractAddress: string, newAdmin: string, fee: StdFee | "auto" | number, memo?: string): Promise<ChangeAdminResult> {
    if (!this.signingCosmwasm)
      throw "Need signing account";
    return this.signingCosmwasm.updateAdmin(senderAddress, contractAddress, newAdmin, fee, memo)
  }

  async upload(senderAddress: string, wasmCode: Uint8Array, fee: StdFee | "auto" | number, memo?: string): Promise<UploadResult> {
    if (!this.signingCosmwasm)
      throw "Need signing account";
    return this.signingCosmwasm.upload(senderAddress, wasmCode, fee, memo)
  }

  async withdrawRewards(delegatorAddress: string, validatorAddress: string, fee: StdFee | "auto" | number, memo?: string): Promise<DeliverTxResponse> {
    if (!this.signingCosmwasm)
      throw "Need signing account";
    return this.signingCosmwasm.withdrawRewards(delegatorAddress, validatorAddress, fee, memo)
  }

  // async getCodes() { return this.cosmwasm.getCodes() }
  // async getContracts(codeId: number) { return this.cosmwasm.getContracts(codeId) }
  // async getAllBalances(address: string) { return this.stargate.getAllBalances(address) }

  forceGetQueryClient() {
    return (this.stargate as any).forceGetQueryClient()
  }

  get tendermint() {
    // return this.stargate.forceGetTmClient
    return (this.stargate as any).forceGetTmClient() as Tendermint34Client
  }

  get keplr_rejected() {
    return localStorage.getItem(`keplr_rejected:${this.chainId}`)
  }

  set keplr_rejected(rejected: any) {
    if (rejected)
      localStorage.setItem(`keplr_rejected:${this.chainId}`, "1")
    else
      localStorage.removeItem(`keplr_rejected:${this.chainId}`)
  }

  async connect_keplr(force = false) {
    if (force)
      this.keplr_rejected = false
    if (this.keplr_rejected)
      throw "User rejected it"
    if (!window.keplr)
      throw "Keplr not found";
    const chainConfiguration = {
      chainId: await this.getChainId(),
      chainName: this.network.name,
      rpc: this.network.urls.rpc,
      rest: this.network.urls.rest,
      stakeCurrency: {
        coinDecimals: 18,
        coinDenom: "CUDOS",
        coinMinimalDenom: "acudos",
      },
      bip44: {
        coinType: 118,
      },
      bech32Config: {
        bech32PrefixAccAddr: "cudos",
        bech32PrefixAccPub: "cudospub",
        bech32PrefixValAddr: "cudosvaloper",
        bech32PrefixValPub: "cudosvaloperpub",
        bech32PrefixConsAddr: "cudosvalcons",
        bech32PrefixConsPub: "cudosvalconspub",
      },
      currencies: [
        {
          coinDenom: "CUDOS",
          coinMinimalDenom: "acudos",
          coinDecimals: 18,
        },
      ],
      feeCurrencies: [
        {
          coinDenom: "CUDOS",
          coinMinimalDenom: "acudos",
          coinDecimals: 18,
          gasPriceStep: {
            low: Number(0),
            average: Number(this.network.gasPrice.amount) * 1.3,
            high: Number(this.network.gasPrice.amount) * 2,
          },
        },
      ],
      features: ["cosmwasm"],
      coinType: 118,
    }
    try {
      await window.keplr.experimentalSuggestChain(chainConfiguration);
      await window.keplr.enable(chainConfiguration.chainId);
      window.keplr.getKey(chainConfiguration.chainId);
    } catch (e) {
      console.log("Keplr rejected")
      this.keplr_rejected = true
      throw e
    }
  }

}
