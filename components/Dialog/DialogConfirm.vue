<template>
  <v-dialog v-model="dialog" persistent max-width="360">
    <v-card>
      <v-card-title class="text-h5 dialog-confirm-title black--text">
        {{ title }}
      </v-card-title>
      <v-card-text class="message-text neutral_color_sub1--text py-5">{{
        message
      }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :color="cancelBtnColor"
          class="rounded-lg v-btn-confirm"
          depressed
          @click="cancelAction"
          :disabled="loadingConfirmBtn"
        >
          {{ cancelBtnText }}
        </v-btn>
        <v-btn
          :color="confirmBtnColor"
          class="rounded-lg v-btn-confirm"
          depressed
          @click="confirmAction"
          :loading="loadingConfirmBtn"
          :disabled="disabledConfirmBtn"
        >
          {{ confirmBtnText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    disabledConfirmBtn: {
      type: Boolean,
      default: false,
    },
    loadingConfirmBtn: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Title",
    },
    message: {
      type: String,
      default: "Message",
    },
    cancelBtnText: {
      type: String,
      default: "Cancel",
    },
    cancelBtnColor: {
      type: String,
      default: "primary",
    },
    cancelAction: {
      type: Function,
      default() {},
    },

    confirmBtnText: {
      type: String,
      default: "Confirm",
    },
    confirmBtnColor: {
      type: String,
      default: "primary",
    },
    confirmAction: {
      type: Function,
      default() {},
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {},
  watch: {
    isVisible() {
      this.dialog = this.isVisible
    },
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="scss">
.v-btn-confirm {
  padding-left: 16px !important ;
  padding-right: 16px !important ;

  letter-spacing: 0.0125em !important;
}
body {
  .v-dialog > .v-card > .v-card__title {
    &.dialog-confirm-title {
      font-weight: 500;
      font-size: 14px !important;
      line-height: 22px;
      letter-spacing: 0.001em;
    }
  }
  .message-text {
    font-size: 16px;
    line-height: 24px;
    /* or 150% */

    letter-spacing: 0.005em;
  }
}
</style>
