<template>
  <v-navigation-drawer
    :mini-variant.sync="mini"
    absolute
    permanent
    right
    width="100%"
    :height="routeName === 'news' ? 'calc(100vh - 80px)' : 'calc(100vh - 80px)'"
    class="group-drawer box-shadow--mod-lighter contact-detail"
  >
    <template v-slot:prepend>
      <div class="group-detail__header-tab white">
        <div
          class="font-weight-medium header-tab-navigator text-left mb-0 w-100 py-1 neutral--text"
          style="font-size: 14px"
        >
          <v-btn icon class="mb-0" color="neutral" @click="fallBack">
            <v-icon size="18px"> mdi-arrow-left </v-icon>
          </v-btn>
          <div class="header-name">
            <span class="group-user-name neutral--text">{{
              selectedUserGroup.name
            }}</span>
            <span class="group-user-counter neutral_color_sub2--text"
              >{{
                selectedUserGroup.users ? selectedUserGroup.users.length : 0
              }}
              {{ sysLanguage.groupContact.users }}</span
            >
          </div>
          <div class="header-action">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="neutral_color_sub1"
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="goToDetail"
                >
                  <v-icon>mdi-pencil-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ sysLanguage.tooltip.edit }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="neutral_color_sub1"
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="showRemove"
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ sysLanguage.tooltip.remove }}</span>
            </v-tooltip>
          </div>
        </div>
        <div class="neutral_color_sub5" style="height: 1px"></div>
      </div>
      <div class="inner-info-body">
        <v-list
          v-if="listUserSelectedComputed && listUserSelectedComputed.length"
          dense
          class="px-0 w-100 pt-0 pb-2 list-users-selected"
        >
          <v-list-item
            v-for="user in listUserSelectedComputed"
            :key="user.id"
            class="px-0 list-contact__wr"
          >
            <UserCardBin
              :user="user"
              :userClick="toggleUser"
              :noAction="true"
            />
          </v-list-item>
        </v-list>
      </div>
    </template>
    <DialogConfirm
      :isVisible="showConfirmRemove"
      :cancelAction="cancelRemove"
      :confirmAction="confirmRemove"
      :cancelBtnText="sysLanguage.confirmDialog.cancelBtnTextNormal"
      :cancelBtnColor="'neutral_color_sub4'"
      :confirmBtnText="sysLanguage.confirmDialog.confirmBtnTextNormal"
      :title="sysLanguage.confirmDialog.removeGroupTitle"
      :message="sysLanguage.confirmDialog.removeGroupMsg"
      :loadingConfirmBtn="loadingRemove"
    />
  </v-navigation-drawer>
</template>

<script>
import UserCardBin from "@/components/ContactSidebar/UserCardBin.vue"
import DialogConfirm from "@/components/Dialog/DialogConfirm.vue"
import { mapState } from "vuex"
import api from "@/services"
export default {
  components: { UserCardBin, DialogConfirm },
  data() {
    return {
      showAddUserDialog: false,
      showConfirmRemove: false,
      loadingRemove: false,
      mini: false,
      panel: [],
      userGroup: null,
      groupName: "",
      listUserIds: [],
    }
  },
  computed: {
    ...mapState({
      listUsers: (state) => state.users.listUsers,
      sideBarContactMini: (state) => state.sideBarContactMini,
      selectedUserGroup: (state) => state.selectedUserGroup,
    }),
    listUserSelectedComputed() {
      return this.selectedUserGroup.users ? this.selectedUserGroup.users : []
    },
  },
  watch: {
    sideBarContactMini() {
      this.mini = this.sideBarContactMini
    },
    selectedUserGroup: {
      deep: true,
      handler() {
        if (this.selectedUserGroup && this.selectedUserGroup.id) {
          this.getDetailUserGroup()
        }
      },
    },
  },
  mounted() {
    console.log(this.selectedUserGroup)
    if (this.selectedUserGroup && this.selectedUserGroup.id) {
      this.getDetailUserGroup()
    }
  },
  methods: {
    showRemove() {
      this.showConfirmRemove = true
    },
    cancelRemove() {
      this.showConfirmRemove = false
    },
    async confirmRemove() {
      this.loadingRemove = true
      const res = await api.userGroup.delete(this.selectedUserGroup.id)
      this.loadingRemove = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.removeGroupFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          return
        }
        this.$store.dispatch("getListUserGroup")
        this.showConfirmRemove = false
        this.$store.commit(
          "toast/getSuccess",
          this.sysLanguage.snackbar.removeGroupSuccess,
        )

        this.fallBack()
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    async getDetailUserGroup() {
      if (this.panel) {
        return
      }
      const res = await api.userGroup.getDetailUserGroup(
        this.selectedUserGroup.id,
        {},
      )
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.getUserGroupFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          return
        }
        this.userGroup = res.data.data.user_group
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    fallBack() {
      this.$store.commit("setSelectedUserGroup", {})
      this.$store.commit("setCurrentRightSideTab", 1)
      this.$store.commit("setCurrentRightSideActive", 1)
    },
    goToDetail() {
      this.$store.commit("setSelectedUserGroup", this.selectedUserGroup)

      this.$store.commit("setCurrentRightSideActive", 5)
    },
    handleShowAdvanceFilter() {
      if (this.panel && this.panel.length) {
        this.panel = []
        return
      }
      this.panel = [0]
    },
    toggleUser(_user) {
      console.log(_user)
      if (this.listUserIds.includes(_user.id)) {
        this.listUserIds = this.listUserIds.filter((o) => o !== _user.id)
      } else {
        this.listUserIds.push(_user.id)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.contact-list {
  width: 100%;
}
.inner-info-body {
  flex-grow: 1;
  padding-top: 18px;
  padding-bottom: 8px;
  position: relative;
  height: calc(100% - 45px);
  .list-users-selected {
    max-height: calc(100% - 10px);
    overflow-y: scroll;
    padding-right: 0 !important;

    &::-webkit-scrollbar {
      width: 8px;
      border-radius: 4px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0);
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: rgba(136, 136, 136, 0);
      border-radius: 4px;
    }
    &:hover {
      /* Handle on hover */
      &::-webkit-scrollbar-thumb {
        background: rgba(136, 136, 136, 0.693);
      }
    }
  }
}
.group-detail__header-tab {
  .header-tab-navigator {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .header-name {
    display: flex;
    flex-flow: column;
    flex-grow: 1;
  }
}
.filter-wr {
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-add-group {
  border-radius: 8px;
  span {
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.0125em;
  }
}

.group-user-counter {
  letter-spacing: 0.004em;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
}
.group-user-name {
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  letter-spacing: 0.0015em;
}
.header-action {
  width: 72px;
  min-width: 72px;
}
</style>
<style lang="scss">
.group-drawer {
  border-radius: 8px;
  .v-navigation-drawer__prepend {
    height: 100%;
    display: flex;
    flex-flow: column;
  }
  .v-navigation-drawer__content {
    height: 0;
  }
}
</style>
