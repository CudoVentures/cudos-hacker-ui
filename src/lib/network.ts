import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { Coin, DirectSecp256k1HdWallet, OfflineDirectSigner, Registry } from "@cosmjs/proto-signing"
import { GasPrice, SigningStargateClient, StargateClient } from "@cosmjs/stargate"
import { Client } from "./client"
import * as cudosjs from "cudosjs"
import { Decimal } from "cudosjs"
import { ClientState } from "@/protos/ibc/lightclients/tendermint/v1/tendermint"

export class Network {

  name: string

  gasPrice: Coin

  addressPrefix: string

  urls: {
    rpc: string,
    ws: string,
    rest: string
  }

  contracts: {
    compute?: string
    exchange?: string
  }

  features?: ("compute" | "exchange" | "midas")[] = []

  #client: Client | undefined = undefined

  has (feature: string) {
    return this.features?.includes(feature as any)
  }

  constructor(args: Pick<Network, "name" | "gasPrice" | "addressPrefix" | "urls" | "contracts" | "features">) {
    this.name = args.name
    this.gasPrice = args.gasPrice
    this.addressPrefix = args.addressPrefix
    this.urls = args.urls
    this.contracts = args.contracts
    this.features = args.features
  }
  
  async client(): Promise<Client> {
    if (!this.#client) {
      const chainId = await (await this.stargate()).getChainId()
      const client = new Client(
        this,
        chainId,
        await this.stargate(),
        await this.cosmwasm(),
      )
      if (window.keplr) {
        try {
          await window.keplr.enable(chainId)
          let signer = window.keplr.getOfflineSigner(chainId)
          client.key = (await window.keplr.getKey(chainId))
          client.address = client.key.bech32Address
          client.signingStargate = await this.stargate(signer)
          client.signingCosmwasm = await this.cosmwasm(signer)
          client.registry = client.signingCosmwasm.registry
          client.cudos = await cudosjs.SigningCosmWasmClient.connectWithSigner(this.urls.rpc, signer, this.clientOptions)
        } catch (e) {
        }
      }
      client.registry ||= new Registry()
      client.registry.register("/ibc.lightclients.tendermint.v1.ClientState", ClientState)
      this.#client = client
    }
    return this.#client
  }

  get clientOptions () {
    return { gasPrice: new GasPrice(Decimal.fromAtomics(this.gasPrice.amount, 0), this.gasPrice.denom) }
  }

  async stargate(): Promise<StargateClient>
  async stargate(signer: OfflineDirectSigner): Promise<SigningStargateClient>

  async stargate(signer?: OfflineDirectSigner) {
    if (signer)
      return SigningStargateClient.connectWithSigner(this.urls.rpc, signer, this.clientOptions);
    else
      return StargateClient.connect(this.urls.rpc);
  }

  async cosmwasm(): Promise<CosmWasmClient>
  async cosmwasm(signer: OfflineDirectSigner): Promise<SigningCosmWasmClient>

  async cosmwasm(signer?: OfflineDirectSigner) {
    if (signer)
      return await SigningCosmWasmClient.connectWithSigner(this.urls.rpc, signer, this.clientOptions);
    else
      return CosmWasmClient.connect(this.urls.rpc);
  }

}
