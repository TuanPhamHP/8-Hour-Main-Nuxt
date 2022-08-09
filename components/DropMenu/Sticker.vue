<template>
  <v-menu
    transition="slide-y-transition"
    nudge-bottom="0"
    offset-overflow
    top
    left
    :close-on-content-click="localValue"
    :v-model="localValue"
  >
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <slot></slot>
      </div>
    </template>
    <v-tabs v-model="tab" background-color="white" color="primary" grow>
      <v-tab v-for="item in listSticker" :key="item.name">
        {{ item.name }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in listSticker" :key="item.name">
        <div class="list-sticker app-scroll">
          <v-row class="mx-0">
            <v-col
              cols="4"
              class="each-sticker"
              v-for="sticker in item.stickers"
              :key="sticker"
              @click="onSubmit(sticker)"
            >
              <v-img
                lazy-src="https://picsum.photos/id/11/10/6"
                max-height="150"
                max-width="100%"
                :src="sticker"
              ></v-img>
            </v-col>
          </v-row>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'stickerList',
  data() {
    return {
      tab: null,
      localValue: false
    };
  },
  computed: {
    ...mapState({
      listSticker: (state) => state.news.listSticker
    })
  },
  methods: {
    onSubmit(_sticker) {
      console.log(_sticker);
      this.localValue = true;
      setTimeout(() => {
        this.localValue = false;
      }, 100);
    }
  }
};
</script>

<style lang="scss">
.each-sticker {
  cursor: pointer;
  &:hover {
    background-color: rgba(226, 242, 255, 0.512);
  }
}
.list-sticker {
  max-width: 320px;
  min-height: 320px;
  max-height: 320px;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
