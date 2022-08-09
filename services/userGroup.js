const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL;
const repo = (axios) => {
  return {
    getListUserGroup(payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/user-groups`, {
          params: { ...payload }
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },
    getDetailUserGroup(id, payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/user-groups/${id}`, {
          params: { ...payload }
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },
    update(id, payload) {
      return axios
        .put(`${VUE_APP_BASE_URL}/api/user-groups/${id}`, payload)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },
    create(payload) {
      return axios
        .post(`${VUE_APP_BASE_URL}/api/user-groups`, payload)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },
    delete(_id) {
      return axios({
        method: 'DELETE',
        url: `${VUE_APP_BASE_URL}/api/user-groups/${_id}`
      })
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
