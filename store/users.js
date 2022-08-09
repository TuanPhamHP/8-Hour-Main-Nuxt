import api from "@/services"
const users = {
  state: () => ({
    listContacts: [],
    listUsers: [],
    listUserGroup: [],
    companies: [],
    departments: [],
    positions: [],
  }),
  mutations: {
    "users/setListUsers"(state, payload) {
      state.listUsers = [...payload]
    },
    "users/setListContacts"(state, payload) {
      state.listContacts = [...payload]
    },
    "users/setListUserGroup"(state, payload) {
      state.listUserGroup = [...payload]
    },
    "users/setListCompanies"(state, payload) {
      state.companies = [...payload]
    },
    "users/setListDepartments"(state, payload) {
      state.departments = [...payload]
    },
    "users/setListPositions"(state, payload) {
      state.positions = [...payload]
    },
  },
  actions: {
    async getListContacts({ commit }) {
      const res = await api.users.getListContacts({ pagination: false })
      if (!res) {
        commit("toast/getError", this.sysLanguage.snackbar.getUsersFail)
        return
      }
      try {
        if (res.status && res.status >= 400) {
          commit("toast/getError", res.data.message)
          return
        }
        commit("users/setListContacts", res.data.data.users)
      } catch (error) {
        commit("toast/getError", `${error}`)
      }
    },
    async getListUsers({ commit }) {
      const res = await api.users.getListUsers({ pagination: false })
      if (!res) {
        commit("toast/getError", this.sysLanguage.snackbar.getUsersFail)
        return
      }
      try {
        if (res.status && res.status >= 400) {
          commit("toast/getError", res.data.message)
          return
        }
        commit("users/setListUsers", res.data.data.users)
      } catch (error) {
        commit("toast/getError", `${error}`)
      }
    },
    async getListUserGroup({ commit }) {
      const res = await api.userGroup.getListUserGroup({ pagination: false })
      if (!res) {
        commit("toast/getError", this.sysLanguage.snackbar.getUserGroupFail)
        return
      }
      try {
        if (res.status && res.status >= 400) {
          commit("toast/getError", res.data.message)
          return
        }
        commit("users/setListUserGroup", res.data.data.user_groups)
      } catch (error) {
        commit("toast/getError", `${error}`)
      }
    },
    async getListCompanies({ commit }) {
      const res = await api.users.getListCompanies({ pagination: false })
      if (!res) {
        commit("toast/getError", this.sysLanguage.snackbar.getCompaniesFail)
        return
      }
      try {
        if (res.status && res.status >= 400) {
          commit("toast/getError", res.data.message)
          return
        }
        commit("users/setListCompanies", res.data.data.companies)
      } catch (error) {
        commit("toast/getError", `${error}`)
      }
    },
    async getListDepartments({ commit }) {
      const res = await api.users.getListDepartments({ pagination: false })
      if (!res) {
        commit("toast/getError", this.sysLanguage.snackbar.getDepartmentsFail)
        return
      }
      try {
        if (res.status && res.status >= 400) {
          commit("toast/getError", res.data.message)
          return
        }
        commit("users/setListDepartments", res.data.data.departments)
      } catch (error) {
        commit("toast/getError", `${error}`)
      }
    },
    async getListPositions({ commit }) {
      const res = await api.users.getListPositions({ pagination: false })
      if (!res) {
        commit("toast/getError", this.sysLanguage.snackbar.getPositionsFail)
        return
      }
      try {
        if (res.status && res.status >= 400) {
          commit("toast/getError", res.data.message)
          return
        }
        commit("users/setListPositions", res.data.data.positions)
      } catch (error) {
        commit("toast/getError", `${error}`)
      }
    },
  },
}
export default users
