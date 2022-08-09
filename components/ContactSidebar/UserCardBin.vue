<template>
  <div class="each-user-card mb-2 pointer">
    <RegularAvatarVue
      :size="48"
      :abbrName="user.name"
      :imageUrl="user.avatar ? user.avatar.url : ''"
    />
    <div class="user-info-text">
      <p v-if="!user.hlName" class="user_full_name neutral--text">
        {{ user.name }}
      </p>
      <p
        v-if="user.hlName"
        class="user_full_name neutral--text"
        v-html="user.hlName"
      ></p>
      <p class="user_position neutral_color_sub2--text">
        {{ user.position ? user.position.name : " --- " }}
      </p>
    </div>
    <div v-if="!noAction" class="user-action">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="neutral_color_sub1"
            icon
            v-bind="attrs"
            v-on="on"
            @click="userClick(user)"
          >
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
        </template>
        <span>Tooltip</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import RegularAvatarVue from "../User/RegularAvatar.vue"
export default {
  props: {
    user: {
      type: Object,
      default() {
        return {}
      },
    },
    userClick: {
      type: Function,
      default() {},
    },
    isCheck: {
      type: Boolean,
      default: false,
    },
    noAction: {
      type: Boolean,
      default: false,
    },
  },
  components: { RegularAvatarVue },
  methods: {
    showDetailInfo() {
      this.$store.commit("setSelectedUser", this.user)
      this.$store.commit("setCurrentRightSideActive", 2)
    },
  },
}
</script>

<style lang="scss" scoped>
.each-user-card {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding: 2px 2px 2px 8px;
  &:hover {
    background-color: #f2f8fa;
  }
}
.user-info-text {
  padding-left: 8px;
  padding-right: 8px;
  .user_full_name {
    font-size: 16px;
    margin-bottom: 0px;
    line-height: 150%;
    letter-spacing: 0.005em;
    span {
      font-weight: 700 !important;
    }
  }
  .user_position {
    font-size: 400;
    font-size: 12px;
    line-height: 150%;
    margin-bottom: 0;
  }
}
.user-action {
  margin-left: auto;
}
</style>
