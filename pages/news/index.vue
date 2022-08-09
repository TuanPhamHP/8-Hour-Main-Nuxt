<template>
  <v-container class="page-container p-0">
    <NewsFeedContainer />
  </v-container>
</template>

<script>
import NewsFeedContainer from '@/components/Container/NewsFeedContainer.vue';
export default {
  name: 'NewsPage',
  components: { NewsFeedContainer },
  transition: {
    name: 'slide-fade',
    mode: 'out-in'
  }
};
</script>
