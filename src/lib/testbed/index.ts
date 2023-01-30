import { Chain, Entity } from "./chain"
import _, { uniqueId } from "underscore"
import YAML from "yaml"

async function main() {

  const chain = new Chain("test")
  const code = chain.upload("test.wasm")
  const address = uniqueId()

  chain.entities[address] = new Entity().deposit(1000, "cr")

  const contract = await chain.instantiate(code, address, {
    admins: [address]
  })

  console.log(await chain.query(contract.address, "list_runtimes"))

  chain.execute(contract.address, address, {
    type: "add_function",
    id: "hello",
    runtime: "nodejs16",
    source: "Qmb424EWqBHASta7ZdHiRD9nytTXve3ZBRmJX8TSUum7Gm"
  })

  console.log(await chain.query(contract.address, "list_functions"))

  // const config = JSON.parse(chain.query_raw(contract.address, "config")!)
  // const result = await chain.execute(contract.address, address, { reconfigure: { config } })

  // console.log(YAML.stringify(result))
  console.log(YAML.stringify(chain))

}

// main()
