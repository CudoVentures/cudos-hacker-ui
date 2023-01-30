<script lang="ts">
  import _ from "underscore";
  import { reloads } from "@/lib/storage";
  import { Router, Route, Link } from "@/lib/controllers";
  import { Networks } from "@/lib/networks";
  import { Client } from "@/lib/client";
  import { dump } from "@/lib/utils";
  import { decodeTxRaw } from "@cosmjs/proto-signing";

  export var client: Client;
</script>
