<template>
  <v-dialog v-model="dialog" persistent max-width="420">
    <v-card>
      <v-card-title class="text-h5 dialog-confirm-title black--text px-3">
        {{ title }}
      </v-card-title>
      <v-card-text class="message-text neutral_color_sub1--text pb-2 pt-0 px-3">
        <p class="mb-0" v-html="message"></p>
        <div class="filter-input mb-3 mt-2" :class="text ? 'border-prim' : ''">
          <textarea
            v-model="text"
            type="text"
            :placeholder="sysLanguage.placeholder.reportComment"
            class="input-no-focus font-size-14"
            rows="6"
          >
          </textarea>
        </div>
      </v-card-text>

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
          @click="confirmAction(text)"
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
      text: "",
    }
  },
  computed: {},
  watch: {
    isVisible() {
      this.dialog = this.isVisible
      this.text = ""
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
    font-size: 14px;
    line-height: 20px;
    /* or 150% */

    letter-spacing: 0.005em;
  }
}
</style>
