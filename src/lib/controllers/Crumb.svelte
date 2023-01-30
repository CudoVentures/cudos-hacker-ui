<script lang="ts">
  import { portal } from "svelte-portal";
  import Link from "./Link.svelte";
  export let target = "#crumbs";
</script>

<li use:portal="{target}"><Link to=""><slot /></Link></li>
