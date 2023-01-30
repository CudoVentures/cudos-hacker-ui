<script lang="ts">
  import { Client } from "@/lib/client";
  import { getContext, setContext } from "svelte";
  import { Readable, Writable, writable } from "svelte/store";
  import * as storage from "@/lib/storage";

  export let client: Client;

  storage.client.set(client);
 
</script>

<slot />
