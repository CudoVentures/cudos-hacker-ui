import { ChangeAdminResult, DeliverTxResponse, ExecuteResult, InstantiateResult, MigrateResult, UploadResult } from "cudosjs"
import { writable, Writable } from "svelte/store"
import { object } from "underscore"

import TaskView from "./task.svelte"
import { Modal } from "./utils"

export { TaskView }

export type InResult = InstantiateResult | ChangeAdminResult | MigrateResult | ExecuteResult | DeliverTxResponse | UploadResult | MigrateResult
export type Result = InResult & {
  messages: { events: { type: string, data: Record<string, string> }[] }[]
}

export class Task {


  static get none() {
    return new Task().store
  }

  static "new"(m: Modal, p: Promise<InResult | void> | ((t: Task) => Promise<InResult | void>)) {
    return new Task(p).show(m)
  }

  #status: string | undefined

  public running: boolean
  public stopped: boolean
  public result: Result[]
  public error?: any
  public store: Writable<Task>
  public promise?: Promise<unknown>

  get status() {
    return this.#status
  }

  set status(status: string | undefined) {
    this.#status = status
    this.poke()
  }

  show(modal: Modal) {
    modal.open(TaskView, { store: this.store })
  }

  poke() {
    this.store.set(this)
  }

  then(f: () => Promise<InResult>) {
    this.promise?.then(f)
    return this
  }

  catch(f: () => Promise<InResult>) {
    this.promise?.catch(f)
    return this
  }

  post(r: InResult) {
    if ("logs" in r) {
      const messages = r.logs.map(l => ({ ...l, events: l.events.map(e => ({ ...e, data: object(e.attributes.map(v => [v.key, v.value])) })) }))
      this.result.push({ ...r, messages });
    } else if ("rawLog" in r) {
      const logs = JSON.parse(r.rawLog!)
      const messages = logs.map(l => ({ ...l, events: l.events.map(e => ({ ...e, data: object(e.attributes.map(v => [v.key, v.value])) })) }))
      this.result.push({ ...r, messages });
    }
  }

  private constructor(promise?: Promise<InResult | void> | ((t: Task) => Promise<InResult | void>)) {
    this.#status = "Processing"
    this.store = writable<Task>(this)
    this.result = []
    if (typeof promise === "function")
      promise = promise(this)
    this.promise = promise
    if (promise) {
      this.running = true
      this.stopped = false
      promise.then((result) => {
        this.status = "Finished"
        if (result)
          this.post(result)
        this.running = false
        this.stopped = true
        this.poke()
      }).catch((error) => {
        this.status = "Failed"
        this.error = error
        this.running = false
        this.stopped = true
        this.poke()
      })
    } else {
      this.running = false
      this.stopped = false
    }
  }

}
