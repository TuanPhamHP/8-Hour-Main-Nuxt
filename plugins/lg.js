import Vue from "vue"
import en from "./locales/en.json"
import vi from "./locales/vi.json"

Vue.prototype.$lg = {
  en: en,
  vi: vi,
}
