<template>
  <div class="right-side-sticky-btn" style="position: relative">
    <!-- CONTACT = 1 -->
    <Contact v-if="currentRightSideActive === 1" />
    <!-- USER INFO = 2 -->
    <UserInfoSidebar v-if="currentRightSideActive === 2" />
    <!-- USER GROUP INFO = 3 -->
    <UserGroupInfo v-if="currentRightSideActive === 3" />
    <!-- USER GROUP CREATE = 4 -->
    <UserGroupCreate v-if="currentRightSideActive === 4" />
    <!-- USER GROUP UPDATE = 5 -->
    <UserGroupUpdate v-if="currentRightSideActive === 5" />
  </div>
</template>

<script>
import { mapState } from "vuex"
import Contact from "./Contact.vue"
import UserInfoSidebar from "./UserInfoSidebar.vue"
import UserGroupCreate from "./UserGroupCreate.vue"
import UserGroupUpdate from "./UserGroupUpdate.vue"
import UserGroupInfo from "./UserGroupInfo.vue"
export default {
  components: {
    Contact,
    UserInfoSidebar,
    UserGroupCreate,
    UserGroupUpdate,
    UserGroupInfo,
  },
  computed: {
    ...mapState({
      currentRightSideActive: (state) => state.currentRightSideActive,
    }),
    currentPathActive() {
      return this.$route.name
    },
  },
}
</script>

<style lang="scss">
.right-side-sticky-btn {
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: flex-end;
  .feature-trigger-rs-btn {
    min-width: 48px !important;
    width: 48px !important;
    height: 48px !important;
    border-radius: 8px !important;
  }
}
</style>
