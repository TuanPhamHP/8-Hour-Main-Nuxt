<template>
  <v-dialog v-model="dialog" max-width="480">
    <v-card>
      <v-card-text
        class="px-3 py-1 d-flex justify-space-between align-center w-100 neutral--text"
        style="font-weight: 600"
      >
        {{ sysLanguage.reaction.listLiked }}
        <v-btn icon depressed dense>
          <v-icon size="20px" color="neutral_color_sub2" @click="closeModal"
            >mdi-close</v-icon
          >
        </v-btn>
      </v-card-text>
      <div class="divivder neutral_color_sub5"></div>
      <div class="list-user-wr scroll-y-mod_big">
        <div v-for="user in listUserReadOnly" :key="user.id" class="each-user">
          <RegularAvatar
            :image-url="user.avatar ? user.avatar.url : ''"
            :size="48"
            :abbrName="user.name"
          />
          <span class="user-name neutral--text font-weight-regular">{{
            user.name
          }}</span>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import RegularAvatar from "@/components/User/RegularAvatar.vue"
import { mapGetters, mapState } from "vuex"
export default {
  components: { RegularAvatar },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    ...mapState({
      listUserReadOnly: (state) => state.listUserReadOnly,
    }),
    ...mapGetters({
      sysLanguage: "sysLanguage",
    }),
  },
  watch: {
    listUserReadOnly() {
      this.dialog = !!(this.listUserReadOnly && this.listUserReadOnly.length)
    },
  },
  mounted() {},
  methods: {
    closeModal() {
      this.$store.commit("SET_LISTUSER_READONLY_POPUP", [])
    },
  },
}
</script>

<style lang="scss" scoped>
.list-user-wr {
  padding: 8px 0;
  max-height: 400px;
  overflow-y: scroll;
  .each-user {
    padding: 4px 8px;
    /* margin-bottom: 4px; */
    display: flex;
    align-items: center;
    gap: 8px;
    &:hover {
      background-color: rgba(113, 113, 113, 0.149);
    }
  }
}
</style>
