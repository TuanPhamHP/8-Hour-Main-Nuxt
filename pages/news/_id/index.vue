<template>
  <v-container class="page-container p-0">
    <NewsDetailContainer />
  </v-container>
</template>

<script>
import NewsDetailContainer from '@/components/Container/NewsDetailContainer.vue';
export default {
  name: 'NewsDetail',
  components: { NewsDetailContainer },
  transition: {
    name: 'slide-fade',
    mode: 'out-in'
  }
};
</script>
