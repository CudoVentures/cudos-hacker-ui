import { createHashHistory } from "@svelte-navigator/history";
import type { NavigationAction, NavigatorHistory } from "svelte-navigator";
import type { Unlisten } from "svelte-navigator/types/NavigatorHistory";
import type RawLocation from "svelte-navigator/types/RawLocation";

export class RouterHistory implements NavigatorHistory {

  constructor(public history = createHashHistory<any>()) {
  }

  get location() {
    return {
      ...this.history.location,
      _key: this.history.location.key
    }
  }

  listen(listener: ({ location, action, }: { location: RawLocation; action: NavigationAction; }) => void): Unlisten {
    return this.history.subscribe((hu) => {
      return listener({ ...hu, location: { ...hu.location, _key: hu.location.key } })
    })
  }

  get navigate() {
    const that = this
    return function (url: string | number, state?: any) {
      if (typeof url === "string")
        that.history.push(url, state)
      else
        that.history.go(url)
    }
  }

  // get location() {
  //   return this.history.location
  // }

  // get navigate() {
  //   return this.#navigate.bind(this)
  // }

  // listen(subscriber: any) {
  //   this.history.subscribe(subscriber)
  // }

  // #navigate(url: string, state?: any) {
  //   this.history.push(url, state)
  // }

}
