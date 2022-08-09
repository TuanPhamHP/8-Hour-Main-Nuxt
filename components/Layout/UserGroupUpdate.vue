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
        <p
          class="font-weight-medium header-tab-navigator text-left mb-0 w-100 py-1 neutral--text"
          style="font-size: 14px"
        >
          <v-btn icon class="mb-0" color="neutral" @click="fallBack">
            <v-icon size="18px"> mdi-arrow-left </v-icon>
          </v-btn>
          {{ sysLanguage.title.updateGroupTitle }}
        </p>
        <div class="neutral_color_sub5" style="height: 1px"></div>
      </div>
      <div class="inner-info-body">
        <div class="px-2 py-2">
          <div
            class="filter-input mb-3"
            :class="groupName ? 'border-prim' : ''"
          >
            <input
              v-model="groupName"
              type="text"
              :placeholder="sysLanguage.placeholder.groupName"
              class="input-no-focus font-size-14"
            />
          </div>
          <span
            class="small-charactor-count neutral_color_sub3--text"
            :class="
              groupName.length === limitGroupNameLength
                ? 'reach-max semantic_error--text'
                : ''
            "
          >
            {{ groupName.length }}/{{ limitGroupNameLength }}
          </span>
          <v-btn
            color="primary"
            text
            height="48px"
            class="primary_light primary_light-opacity btn-add-group w-100"
            @click="onAddUser"
          >
            <v-icon color="primary" class="mr-2">mdi-plus</v-icon>
            {{ sysLanguage.button.addNewUser }}
          </v-btn>
        </div>
        <div class="neutral_color_sub5" style="height: 1px"></div>
        <v-list
          v-if="listUserIds && listUserIds.length"
          dense
          class="px-2 pt-0 pb-2 list-users-selected"
        >
          <p class="user-counter white pt-2">
            {{ sysLanguage.title.userCounter }} ({{
              listUserSelectedComputed.length
            }})
          </p>
          <v-list-item
            v-for="user in listUserSelectedComputed"
            :key="user.id"
            class="px-0 list-contact__wr"
          >
            <UserCardBin :user="user" :userClick="toggleUser" />
          </v-list-item>
        </v-list>
        <div class="btn-group sticky-bottom py-2 px-3 news_block_bg">
          <v-btn
            @click="fallBack"
            :color="'neutral_color_sub4 neutral_color_sub2--text'"
            class="rounded-lg v-btn-confirm"
            depressed
            :disabled="loadingBtn"
          >
            {{ sysLanguage.button.cancel }}
          </v-btn>
          <v-btn
            :color="'primary'"
            class="rounded-lg v-btn-confirm"
            depressed
            :disabled="!ableToUpdate"
            :loading="loadingBtn"
            @click="onUpdate"
          >
            {{ sysLanguage.button.update }}
          </v-btn>
        </div>
      </div>
    </template>
    <DialogAddUser
      :isVisible="showAddUserDialog"
      :confirmAction="addUser"
      :cancelAction="closeAddUserDialog"
      :usersDefaultIds="listUserIds"
    />
  </v-navigation-drawer>
</template>

<script>
import DialogAddUser from "@/components/Dialog/DialogAddUser.vue"
import UserCardBin from "@/components/ContactSidebar/UserCardBin.vue"
import { mapState } from "vuex"
import api from "@/services"
export default {
  components: { DialogAddUser, UserCardBin },
  data() {
    return {
      showAddUserDialog: false,
      mini: false,
      panel: [],
      user: null,
      groupName: "",
      listUserIds: [],
      loadingBtn: false,
      limitGroupNameLength: 60,
    }
  },
  computed: {
    ...mapState({
      listUsers: (state) => state.users.listUsers,
      sideBarContactMini: (state) => state.sideBarContactMini,
      selectedUser: (state) => state.selectedUser,
      selectedUserGroup: (state) => state.selectedUserGroup,
    }),
    listUserSelectedComputed() {
      return this.listUsers.filter((o) => this.listUserIds.includes(o.id))
    },
    ableToUpdate() {
      return (
        this.groupName.trim() && this.listUserIds && this.listUserIds.length
      )
    },
  },
  watch: {
    sideBarContactMini() {
      this.mini = this.sideBarContactMini
    },
    groupName() {
      if (this.groupName.length > this.limitGroupNameLength) {
        this.groupName = this.groupName.slice(0, this.limitGroupNameLength)
      }
    },
  },
  mounted() {
    if (this.selectedUserGroup && this.selectedUserGroup.id) {
      this.groupName = this.selectedUserGroup.name
      this.listUserIds = this.selectedUserGroup.users
        ? this.selectedUserGroup.users.map((o) => o.id)
        : []
    }
  },
  methods: {
    onAddUser() {
      this.showAddUserDialog = true
    },
    closeAddUserDialog() {
      this.showAddUserDialog = false
    },
    addUser(_users) {
      this.listUserIds = [..._users]
      this.closeAddUserDialog()
    },
    async getDetailUsers() {
      if (this.panel) {
        return
      }
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
    async onUpdate() {
      const body = {
        name: this.groupName,
        user_ids: [...this.listUserIds],
      }
      this.loadingBtn = true
      const res = await api.userGroup.update(this.selectedUserGroup.id, body)
      this.loadingBtn = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.updateUserGroupFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          return
        }
        this.$store.commit(
          "toast/getSuccess",
          this.sysLanguage.snackbar.updateUserGroupSuccess,
        )
        this.$store.dispatch("getListUserGroup")

        this.fallBack()
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    fallBack() {
      this.$store.commit("setSelectedUserGroup", {})
      this.$store.commit("setCurrentRightSideTab", 1)
      this.$store.commit("setCurrentRightSideActive", 1)
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
  padding-bottom: 58px;
  position: relative;
  height: calc(100% - 45px);
  .list-users-selected {
    max-height: calc(100% - 120px);
    overflow-y: scroll;
    .user-counter {
      position: sticky;
      top: 0;
      z-index: 2;
    }
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
.sticky-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
<style lang="scss">
.group-drawer {
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
