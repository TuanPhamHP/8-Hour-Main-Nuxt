const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL;
const repo = (axios) => {
  return {
    getListData(payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/notifications`, {
          params: { ...payload }
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },
    getDetailData(id, payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/notifications/${id}`, {
          params: { ...payload }
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },
    updateRead(_id, _params) {
      return axios
        .post(`${VUE_APP_BASE_URL}/api/notifications/${_id}/read`, _params)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },
    updateReceived(_params = {}) {
      return axios
        .post(`${VUE_APP_BASE_URL}/api/notifications/receive`, _params)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    }
  };
};
export default repo;
