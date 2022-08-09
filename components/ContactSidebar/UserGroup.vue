<template>
  <div class="each-group-card mb-1 pointer" @click="showDetailInfo">
    <RegularAvatarVue
      :size="48"
      :abbrName="group.name"
      :imageUrl="group.avatar ? group.avatar.url : returnDf()"
    />
    <div class="group-info-text">
      <p v-if="!group.hlName" class="user_full_name neutral--text">
        {{ group.name }}
      </p>
      <p
        v-if="group.hlName"
        class="user_full_name neutral--text"
        v-html="group.hlName"
      ></p>
      <p class="group_counter neutral_color_sub2--text">
        {{ group.users ? group.users.length : "0" }}
        {{ sysLanguage.groupContact.users }}
      </p>
    </div>
    <div class="group-action"></div>
  </div>
</template>

<script>
import RegularAvatarVue from "../User/RegularAvatar.vue"
import DefaultGroupAvatar from "@/assets/images/group-avatar.svg"
export default {
  props: {
    group: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: { RegularAvatarVue },
  methods: {
    showDetailInfo() {
      this.$store.commit("setSelectedUserGroup", this.group)
      this.$store.commit("setCurrentRightSideActive", 3)
    },
    returnDf() {
      return DefaultGroupAvatar
    },
  },
}
</script>

<style lang="scss" scoped>
.each-group-card {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding: 8px;
  &:hover {
    background-color: #f2f8fa;
  }
}
.group-info-text {
  padding-left: 8px;
  padding-right: 8px;
  .user_full_name {
    font-size: 16px;
    margin-bottom: 0px;
    line-height: 150%;
    letter-spacing: 0.005em;
    word-break: break-word;
    span {
      font-weight: 700 !important;
    }
  }
  .group_counter {
    font-size: 400;
    font-size: 12px;
    line-height: 150%;
    margin-bottom: 0;
  }
}
.group-action {
  margin-left: auto;
}
</style>
