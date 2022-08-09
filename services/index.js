import axios from "axios"
import user from "./user"
import annoucement from "./annoucement"
import chat from "./chat"
import noti from "./noti"
import users from "./users"
import userGroup from "./userGroup"

// const axiosInstance = axios.create()
// console.log(axiosInstance.defaults.headers.common)
const services = ((axios) => {
  return {
    user: user(axios),
    users: users(axios),
    userGroup: userGroup(axios),
    chat: chat(axios),
    noti: noti(axios),
    annoucement: annoucement(axios),
  }
})(axios)
export default services
