import Vue from "vue"
import services from "./services"
import Axios from "axios"
Vue.prototype.$api = services(Axios)
