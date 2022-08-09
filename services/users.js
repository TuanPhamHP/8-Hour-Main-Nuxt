const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL;
const repo = (axios) => {
  return {
    getListContacts(payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/staff/contacts`, {
          params: { ...payload }
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },
    getListUsers(payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/staff/users`, {
          params: { ...payload }
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },
    getDetailUser(id, payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/staff/users/${id}`, {
          params: { ...payload }
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },
    getListCompanies(payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/staff/companies`, {
          params: { ...payload }
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },
    getListDepartments(payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/staff/departments`, {
          params: { ...payload }
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },
    getListPositions(payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/staff/positions`, {
          params: { ...payload }
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
