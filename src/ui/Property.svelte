<script lang="ts">
  export var label : String | undefined = undefined;
  export var value : any = undefined;
</script>

<div class="row">
  <div class="label">{label ? label : ""}</div>
  <div class="value"><slot>{value}</slot></div>
</div>

<style>
  .row {
    display: flex;
  }
  .label {
    width: 10rem;
    font-weight: bold;
  }
</style>
