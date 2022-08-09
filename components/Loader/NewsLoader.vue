<template>
  <div class="v-skeleton-loader__table-tfoot-start mb-4">
    <v-skeleton-loader
      class="box-shadow--mod white"
      type="card-heading, list-item-three-line, image, divider,list-item-three-line,table-tfoot"
    ></v-skeleton-loader>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.v-skeleton-loader__table-tfoot-start {
  .v-skeleton-loader__table-tfoot {
    justify-content: flex-start !important;
  }
}
</style>
