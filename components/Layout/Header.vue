<template>
  <v-app-bar color="app_bg_navbar" dense light class="app-navbar__wr">
    <v-container>
      <v-row class="mx-0">
        <!-- <v-btn icon>
          <v-icon color="neutral_color_sub2" @click="toggleSidebarApp"
            >mdi-menu</v-icon
          >
        </v-btn> -->
        <img :src="headerLogo" alt="header-logo" class="pl-3" height="48px" />
        <v-spacer></v-spacer>

        <!-- <v-btn icon class="mx-3" @click="triggerSnackBar">
          <v-icon>mdi-gesture-tap-button</v-icon>
        </v-btn> -->
        <!-- <v-btn icon class="mx-3">
          <v-icon>mdi-dots-grid</v-icon>
        </v-btn> -->
        <!-- <v-btn icon class="mx-3" @click="toggleSidebarContactApp">
          <v-icon>mdi-contacts-outline</v-icon>
        </v-btn> -->
        <Notification />

        <v-menu left bottom transition="slide-y-transition" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              v-bind="attrs"
              v-on="on"
              text
              color="neutral"
              class="v-btn-normalize v-btn-n-focus capitalize pr-0"
            >
              <RegularAvatar
                :size="40"
                :abbrName="userFromAuth.name"
                :imageUrl="userFromAuth.avatar ? userFromAuth.avatar.url : ''"
                :ext-class="'mr-2'"
              />
              {{ userFromAuth.name }}
              <v-icon class="ml-3">mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list class="pb-0">
            <v-list-item @click="() => {}">
              <v-list-item-title color="neutral" class="font-weight-regular">
                <v-icon color="neutral" class="mr-2"
                  >mdi-account-circle-outline</v-icon
                >

                <span class="neutral--text">{{
                  sysLanguage.header.userAccount
                }}</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="() => {}">
              <v-list-item-title color="neutral" class="font-weight-regular">
                <v-icon color="neutral" class="mr-2"
                  >mdi-swap-horizontal</v-icon
                >
                <span class="neutral--text">{{
                  sysLanguage.header.syncData
                }}</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="() => {}">
              <v-list-item-title color="neutral" class="font-weight-regular">
                <v-icon color="neutral" class="mr-2">mdi-update</v-icon>
                <span class="neutral--text">{{
                  sysLanguage.header.update
                }}</span>
              </v-list-item-title>
            </v-list-item>
            <!-- <v-list-item @click="onLogout">
          <v-list-item-title color="neutral" class="font-weight-regular">
            <v-icon color="neutral" class="mr-2">mdi-web</v-icon>
            <span class="neutral--text">{{ sysLanguage.header.language }}</span>
          </v-list-item-title>
        </v-list-item> -->
            <v-list-item @click="onLogout">
              <v-list-item-title color="neutral" class="font-weight-regular">
                <v-icon color="semantic_error" class="mr-2">mdi-logout</v-icon>
                <span class="semantic_error--text">{{
                  sysLanguage.header.logout
                }}</span>
              </v-list-item-title>
            </v-list-item>

            <v-list-item class="neutral">
              <v-list-item-title class="font-weight-regular">
                <span class="white--text"
                  >{{ sysLanguage.header.appVersion }}: 1.0.0</span
                >
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import RegularAvatar from "@/components/User/RegularAvatar"
import Notification from "@/components/Layout/Notification"
import { mapGetters, mapState } from "vuex"
export default {
  components: { RegularAvatar, Notification },
  computed: {
    ...mapState({
      sidebarMini: (state) => state.sideBarAppMini,
      sideBarContactMini: (state) => state.sideBarContactMini,
    }),
    ...mapGetters({
      userFromAuth: "userFromAuth",
      sysLanguage: "sysLanguage",
    }),
    headerLogo() {
      return process.env.VUE_APP_HEADER_LOGO
    },
  },
  data() {
    return {
      messages: "9+",
    }
  },
  mounted() {},
  methods: {
    triggerSnackBar() {
      this.$store.commit("toast/getError", "Your snackbar just triggered now")
      this.$store.commit("toast/getInfo", "Your snackbar just triggered now")
      this.$store.commit("toast/getSuccess", "Your snackbar just triggered now")
      this.$store.commit("toast/getWarning", "Your snackbar just triggered now")
    },
    toggleSidebarApp() {
      this.$store.commit("setSidebarMini", !this.sidebarMini)
    },
    toggleSidebarContactApp() {
      this.$store.commit("setSidebarContactMini", !this.sideBarContactMini)
    },
    onLogout() {
      this.$store.commit("SET_LOGOUT_POPUP", true)
    },
  },
}
</script>

<style lang="scss">
.app-navbar__wr {
  position: sticky !important;
  top: 0 !important;
  z-index: 5 !important;
  /* background-color: var(--v-theme-light-app_bg_navbar) !important; */
}
@media only screen and (min-width: 768px) {
  .app-navbar__wr {
    height: 56px !important;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12),
      0px 4px 5px rgba(0, 0, 0, 0.08), 0px 1px 10px rgba(0, 0, 0, 0.04) !important;
    .v-toolbar__content {
      height: 56px !important;
      padding-left: 32px !important;
      padding-right: 32px !important;
    }
  }
}
</style>
