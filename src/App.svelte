<script lang="ts">
  import _ from "underscore";
  import { reloads } from "@/lib/storage";
  import { Router, Link, Route } from "@/lib/controllers";
  import { Networks } from "@/lib/networks";
  import { Modal } from "svelte-simple-modal";

  import Page from "@/ui/Page.svelte";

  import Network from "@/pages/network/index.svelte";

  function reload() {
    reloads.update((n) => n + 1);
  }

  let network = "testnet";
</script>

{#key $reloads}
  <Modal classWindow="modal-window" classBg="modal-bg" classCloseButton="modal-close" classContent="modal-content" classWindowWrap="modal-wrap">
    <Router>
      <header>
        <nav id="crumbs"></nav>
        <div class="expand"></div>
        <div id="loading"></div>
      </header>
      <Route path="/" crumb="🏠">
        <Route path="/" let:params>
          <Page>
            <p>Welcome to the Cudos Web UI.</p>
            <h2>General</h2>
            <ul>
              <li><Link to="w">Wallet</Link></li>
            </ul>
            <h2>Networks</h2>
            <ul>
              {#each Object.entries(Networks) as [key, network]}
                <li><Link to="{`n/${key}`}">{network.name}</Link></li>
              {/each}
            </ul>
          </Page>
        </Route>
        <Route path="/n/:network/" let:params>
          <Network network="{params.network}" />
        </Route>
      </Route>
    </Router>
  </Modal>
{/key}

<style lang="scss">
  header {
    display: flex;
  }
  .expand {
    flex-grow: 1;
  }
  .modal {
    background: #f00;
  }
</style>
