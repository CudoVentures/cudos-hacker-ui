import { chains } from "chain-registry";
import { object } from "underscore";
import { Network } from "./network";

export const NativeNetworks: Record<string, Network> = {
  chain0: new Network({
    name: "Chain 0",
    gasPrice: {
      amount: "5000000000000",
      denom: "acudos",
    },
    urls: {
      rpc: "http://127.0.1.0:26657",
      rest: "http://127.0.1.0:1317",
      ws: "ws://127.0.1.0:26657/websocket",
    },
    addressPrefix: "cudos",
    contracts: {
    },
    features: [],
  }),
  chain1: new Network({
    name: "Chain 1",
    gasPrice: {
      amount: "5000000000000",
      denom: "acudos",
    },
    urls: {
      rpc: "http://127.0.1.1:26657",
      rest: "http://127.0.1.1:1317",
      ws: "ws://127.0.1.1:26657/websocket",
    },
    addressPrefix: "cudos",
    contracts: {
    },
    features: [],
  }),
  localnet: new Network({
    name: "Localnet",
    gasPrice: {
      amount: "5000000000000",
      denom: "acudos",
    },
    urls: {
      rpc: "http://127.0.0.1:26657",
      rest: "http://127.0.0.1:1317",
      ws: "ws://127.0.0.1:26657/websocket",
    },
    addressPrefix: "cudos",
    contracts: {
      compute: "cudos14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9strccpl",
    },
    features: ["compute", "exchange", "midas"],
  }),
  testnet: new Network({
    name: "Cudos Public Testnet",
    gasPrice: {
      amount: "5000000000000",
      denom: "acudos",
    },
    urls: {
      rpc: "https://sentry1.gcp-uscentral1.cudos.org:36657",
      rest: "https://sentry1.gcp-uscentral1.cudos.org:31317",
      ws: "wss://sentry1.gcp-uscentral1.cudos.org:36657/websocket",
    },
    addressPrefix: "cudos",
    contracts: {
      compute: "cudos1nzu5uq00dny8fjs83eerjfv8l9qnntd9h03ag9hcl9tpf9upr0fshnafnk",
    },
    features: ["compute"],
  }),
  mainnet: new Network({
    name: "Cudos Mainnet",
    gasPrice: {
      amount: "5000000000000",
      denom: "acudos",
    },
    urls: {
      rpc: "https://mainnet-full-node-02.hosts.cudos.org:36657",
      rest: "https://mainnet-full-node-02.hosts.cudos.org:31317",
      ws: "wss://mainnet-full-node-02.hosts.cudos.org:36657/websocket",
    },
    addressPrefix: "cudos",
    contracts: {
      compute: "cudos1ufs3tlq4umljk0qfe8k5ya0x6hpavn897u2cnf9k0en9jr7qarqq4qem3e"
    },
    features: ["compute"],
  }),
}

export const ForeignNetworks = object(chains.flatMap(c => {
  try {
    return [[c.chain_id, new Network({
      name: c.chain_name,
      gasPrice: {
        amount: String(c.fees?.fee_tokens[0].average_gas_price ?? ""),
        denom: c.fees?.fee_tokens[0].denom ?? "",
      },
      urls: {
        rpc: c.apis?.rpc[0].address ?? "",
        rest: c.apis?.rest[0].address ?? "",
        ws: "",
      },
      addressPrefix: c.bech32_prefix,
      contracts: {
      },
    })]]
  } catch (e) {
    return []
  }
}))

export const Networks = {
  ...NativeNetworks,
  ...ForeignNetworks,
}
