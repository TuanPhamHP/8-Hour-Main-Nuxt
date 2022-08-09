const VUE_APP_CHAT_URL = process.env.VUE_APP_CHAT_URL
const dtRepo = (axios) => {
  return {
    getListGroupChat(payload) {
      // delete axiosInstance.defaults.headers.common["Authorization"]
      return axios
        .get(`${VUE_APP_CHAT_URL}/groups.list?&count=1000`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    create(payload) {
      return axios
        .post(`api/airports`, payload)
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    update(id, payload) {
      return axios
        .put(`api/airports/${id}`, payload)
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    delete(id) {
      return axios
        .delete(`api/airports/${id}`)
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
  }
}
export default dtRepo
