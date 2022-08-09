<template>
  <v-dialog v-model="dialog" persistent max-width="320">
    <v-card>
      <v-card-title class="text-h5">
        {{ sysLanguage.logout.title }}
      </v-card-title>
      <v-card-text>{{ sysLanguage.logout.message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="neutral_color_sub4"
          depressed
          class="rounded-lg v-btn-confirm"
          @click="cancelLogout"
        >
          {{ sysLanguage.logout.cancelBtn }}
        </v-btn>
        <v-btn
          color="primary"
          depressed
          class="rounded-lg v-btn-confirm"
          @click="handleLogout"
        >
          {{ sysLanguage.logout.approveBtn }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { deleteCookie } from "@/helpers/customizeCookie"
import { mapGetters, mapState } from "vuex"
export default {
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    ...mapState({
      showLogoutPopup: (state) => state.showLogoutPopup,
    }),
    ...mapGetters({
      sysLanguage: "sysLanguage",
    }),
  },
  watch: {
    showLogoutPopup() {
      this.dialog = this.showLogoutPopup
    },
  },
  mounted() {},
  methods: {
    cancelLogout() {
      this.$store.commit("SET_LOGOUT_POPUP", false)
    },
    handleLogout() {
      deleteCookie("token")
      deleteCookie("auth._token.local")
      setTimeout(() => {
        this.$store.commit("SET_LOGOUT_USER")
        this.$store.commit("SET_LOGOUT_POPUP", false)
        window.location = process.env.VUE_APP_LOGIN_URL
        console.log("redirect to: " + process.env.VUE_APP_LOGIN_URL)
        location.reload()
      }, 100)
    },
  },
}
</script>

<style></style>
