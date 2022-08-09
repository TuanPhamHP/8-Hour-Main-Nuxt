<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <v-card>
      <v-card-title class="text-h5">
        {{ sysLanguage.logout.title }}
      </v-card-title>
      <v-card-text>{{ sysLanguage.logout.message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="cancelLogout">
          {{ sysLanguage.logout.cancelBtn }}
        </v-btn>
        <v-btn color="green darken-1" text @click="dialog = false">
          {{ sysLanguage.logout.approveBtn }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
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
      console.log("hey")
      this.dialog = this.showLogoutPopup
    },
  },
  mounted() {},
  methods: {
    cancelLogout() {
      this.$store.commit("SET_LOGOUT_POPUP", false)
    },
  },
}
</script>

<style></style>
