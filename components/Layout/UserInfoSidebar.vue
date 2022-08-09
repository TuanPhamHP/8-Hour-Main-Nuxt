<template>
  <v-navigation-drawer
    :mini-variant.sync="mini"
    absolute
    permanent
    right
    width="100%"
    :height="routeName === 'news' ? 'calc(100vh - 80px)' : 'calc(100vh - 80px)'"
    class="contact-drawer box-shadow--mod-lighter contact-detail"
  >
    <template v-slot:prepend>
      <div class="contact-detail__header-tab primary">
        <p
          class="font-weight-medium header-tab-navigator text-left mb-0 w-100 py-1 white--text"
          style="font-size: 14px"
        >
          <v-btn icon class="mb-0" color="white" @click="fallBack">
            <v-icon size="18px"> mdi-arrow-left </v-icon>
          </v-btn>
          {{ sysLanguage.contact.detailHeader }}
        </p>
        <div class="primary_light" style="height: 1px"></div>
        <div class="inner-info">
          <RegularAvatarVue
            :size="84"
            :backgroundColor="'neutral_color_sub2'"
            :abbrName="selectedUser.name"
            :imageUrl="selectedUser.avatar ? selectedUser.avatar.url : ''"
          />
          <p class="user-name white--text text-center mb-0">
            {{ selectedUser.name }}
          </p>
          <p class="user-id white--text text-center mb-0">
            ID: {{ selectedUser.code }}
          </p>
        </div>
      </div>
      <div class="inner-info-body">
        <div
          class="inner-tab-title neutral_color_sub5 neutral_color_sub2--text px-2 py-2"
        >
          {{ sysLanguage.contact.detailBody }}
        </div>
        <div class="each-inner-info px-2">
          <span class="neutral_color_sub2--text info-label">
            {{ sysLanguage.contact.detailCompany }}</span
          >
          <span class="neutral--text text-right">{{
            selectedUser.company ? selectedUser.company.name : ""
          }}</span>
        </div>
        <div class="each-inner-info px-2">
          <span class="neutral_color_sub2--text info-label">
            {{ sysLanguage.contact.detailDepartment }}</span
          >
          <span class="neutral--text text-right">{{
            selectedUser.position
              ? selectedUser.position.department
                ? selectedUser.position.department.name
                : ""
              : ""
          }}</span>
        </div>
        <div class="each-inner-info px-2">
          <span class="neutral_color_sub2--text info-label">
            {{ sysLanguage.contact.detailPosition }}</span
          >
          <span class="neutral--text text-right">{{
            selectedUser.position ? selectedUser.position.name : ""
          }}</span>
        </div>
        <!-- <div class="each-inner-info px-2">
          <span class="neutral_color_sub2--text info-label">
            {{ sysLanguage.contact.detailManager }}</span
          >
          <span class="neutral--text text-right">{{ "" }}</span>
        </div> -->
        <div class="each-inner-info px-2">
          <span class="neutral_color_sub2--text info-label">
            {{ sysLanguage.contact.detailEmail }}</span
          >
          <span class="neutral--text text-right">{{ selectedUser.email }}</span>
        </div>
        <div class="each-inner-info px-2">
          <span class="neutral_color_sub2--text info-label">
            {{ sysLanguage.contact.detailPhone }}</span
          >
          <span class="neutral--text text-right">{{ selectedUser.phone }}</span>
        </div>
        <!-- <div class="each-inner-info px-2">
          <span class="neutral_color_sub2--text info-label">
            {{ sysLanguage.contact.detailAddress }}</span
          >
          <span class="neutral--text text-right">{{
            selectedUser.address
          }}</span>
        </div> -->
        <!-- <div class="each-inner-info px-2">
          <span class="neutral_color_sub2--text info-label">
            {{ sysLanguage.contact.detailDOB }}</span
          >
          <span class="neutral--text text-right">{{
            selectedUser.birth_day
          }}</span>
        </div> -->
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import RegularAvatarVue from "../User/RegularAvatar.vue"
import { mapState } from "vuex"
import api from "@/services"
export default {
  components: { RegularAvatarVue },
  data() {
    return {
      mini: false,
      panel: [],
      user: null,
    }
  },
  computed: {
    ...mapState({
      sideBarContactMini: (state) => state.sideBarContactMini,
      selectedUser: (state) => state.selectedUser,
    }),
    userComputed() {
      return this.user ?? this.selectedUser
    },
  },
  watch: {
    sideBarContactMini() {
      this.mini = this.sideBarContactMini
    },
    selectedUser: {
      deep: true,
      handler() {
        if (this.selectedUser && this.selectedUser.id) {
          this.getDetailUsers()
        }
      },
    },
  },
  mounted() {
    if (this.selectedUser && this.selectedUser.id) {
      this.getDetailUsers()
    }
  },
  methods: {
    async getDetailUsers() {
      const res = await api.users.getDetailUser(this.selectedUser.id, {})
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.getUsersFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          return
        }
        this.user = res.data.data.user
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    fallBack() {
      this.$store.commit("setSelectedUser", {})

      this.$store.commit("setCurrentRightSideTab", 0)
      this.$store.commit("setCurrentRightSideActive", 1)
    },

    handleShowAdvanceFilter() {
      if (this.panel && this.panel.length) {
        this.panel = []
        return
      }
      this.panel = [0]
    },
  },
}
</script>

<style lang="scss" scoped>
.contact-list {
  width: 100%;
}
.each-inner-info {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f2f2f2;
  .info-label {
    width: 130px;
    min-width: 130px;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
  }
  .info-desc {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: right;
    letter-spacing: 0.0025em;
  }
}
.contact-detail__header-tab {
  .header-tab-navigator {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .inner-info {
    padding: 26px 0;
    display: flex;
    flex-flow: column;
    align-items: center;
  }
  .user-name {
    margin-top: 4px;
    font-weight: 500;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.0025em;
  }
  .user-id {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.004em;
  }
}
.filter-wr {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
<style lang="scss">
.font-size-14 {
  font-size: 14px !important;
}
.contact-drawer {
  border-radius: 8px;
}
</style>
