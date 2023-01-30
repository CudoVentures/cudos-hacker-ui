<script lang="ts">
  import { Link } from "svelte-navigator";

  export var to: string;
  export var section: boolean = false;

  function getProps(props: {
    location: any,
    href: string,
  }) {
    let newHref = `#${props.href}`
    const isPartiallyCurrent = (props.location.pathname + "/").startsWith(props.href + "/");
  	const isCurrent = props.href === props.location.pathname;
    if (!isCurrent && isPartiallyCurrent && section)
      return { "aria-current": "section", href: newHref  }
    return { href: newHref }
  }
</script>

<Link to="{to}" {getProps}><slot /></Link>
