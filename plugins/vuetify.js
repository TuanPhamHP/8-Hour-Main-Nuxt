import Vue from "vue"
import Vuetify from "vuetify"
import "vuetify/dist/vuetify.min.css"

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        app_bg: "#F5F6FA",
        app_bg_navbar: "#fff",
        navbar_bg: "#ffffff",
        news_bg: "#ffffff",
        primary: "#006C99", // #E53935
        primary_light: "#3389AD", // #E53935
        primary_light_o1: "#cce2eb", // #E53935
        primary_color_sub1: "#FF3333",
        primary_color_sub2: "#CC0000",
        primary_color_sub3: "#800000",
        primary_color_sub4: "#A60001",
        primary_color_sub5: "#FF6666",
        primary_color_sub6: "#FF9999",
        primary_color_sub7: "#FFCCCC",
        primary_color_sub8: "#FFF2F2",
        secondary_text: "#282828",
        secondary_text_color_sub1: "#5A5A5A",
        secondary_text_color_sub2: "#080808",
        secondary: "#E4A025",
        secondary_color_sub1: "#ECBC66",
        secondary_color_sub2: "#B6801E",
        neutral: "#1A1A1A",
        neutral_color_sub1: "#4D4D4D",
        neutral_color_sub2: "#808080",
        neutral_color_sub3: "#B3B3B3",
        neutral_color_sub4: "#E6E6E6",
        neutral_color_sub5: "#F2F2F2",
        semantic_accent: "#00A3FF",
        semantic_warning: "#FE9705",
        semantic_error: "#D11313",
        semantic_info: "#0569FF",
        semantic_success: "#3AC430",
        sidebar_ico_active_color: "#fff",
        warningRed: "#D11313",
        news_block_bg: "#FAFAFA",
        highlight: "#006C99",
        black: "#000",
        snack_success: "#4CAF50",
        snack_info: "#2196F3",
        snack_warning: "#FB8C00",
        snack_error: "#FF5252",
      },
    },
  },
})
export default vuetify
Vue.use(Vuetify)
