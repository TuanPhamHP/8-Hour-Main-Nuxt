import Vue from 'vue';
import Vuex from 'vuex';
import { deleteCookie, setCookie } from '@/helpers/customizeCookie.js';

import en from '@/plugins/locales/en.json';
import vi from '@/plugins/locales/vi.json';
Vue.use(Vuex);

export const state = () => ({
  socket: {
    isConnected: false,
    message: '',
    reconnectError: false,
    loggedInUser: {},
    isLogging: false,
    errorLogging: '',
    isReconnecting: false
  },
  auth: {
    isAuth: false,
    user: null,
    token: null
  },
  showLogoutPopup: false,
  sideBarAppMini: false,
  sideBarContactMini: false,
  listImagePreview: [],
  listUserReadOnly: [],
  selectedImgIndex: 0,
  currentRightSideActive: 1,
  currentRightSideTab: 0,
  selectedUser: {},
  selectedUserGroup: {},
  splitMark: '$#%8$H%',
  currentLanguage: 'vi' // vi | en
});

export const mutations = {
  setLang(state, payload) {
    state.currentLanguage = payload;
  },
  setCurrentRightSideTab(state, number) {
    state.currentRightSideTab = number;
  },
  setCurrentRightSideActive(state, number) {
    state.currentRightSideActive = number;
  },
  setSelectedUser(state, record) {
    state.selectedUser = record;
  },
  setSelectedUserGroup(state, record) {
    state.selectedUserGroup = record;
  },
  setListImagePreview(state, payload) {
    state.listImagePreview = payload;
  },
  setSelectedImgIndex(state, payload) {
    state.selectedImgIndex = payload;
  },
  SET_LISTUSER_READONLY_POPUP(state, payload) {
    state.listUserReadOnly = [...payload];
  },
  SET_USER_LOGGEDIN(state, payload) {
    state.auth = { ...payload };
  },
  SET_LOGOUT_USER(state) {
    deleteCookie('auth._token.local');
    deleteCookie('token');
    state.auth = { isAuth: false, user: null, token: null };
  },
  SET_LOGOUT_POPUP(state, payload) {
    state.showLogoutPopup = payload;
  },
  setCurrentToken(state, payload) {
    // localStorage.setItem("auth._token.local", payload)
    setCookie('token', payload, 30);
    state.currentToken = payload;
  },
  setSidebarMini(state, payload) {
    state.sideBarAppMini = payload;
  },
  setSidebarContactMini(state, payload) {
    state.sideBarContactMini = payload;
  },
  // SOCKET HANDLER
  SOCKET_ONOPEN(state, event) {
    Vue.prototype.$socket = event.currentTarget;
    state.socket.isConnected = true;
    if (state.socket.isReconnecting) {
      state.socket.isReconnecting = false;
    }
    Vue.prototype.$socket.send(
      JSON.stringify({
        msg: 'connect',
        version: '1',
        support: ['1']
      })
    );
  },
  SOCKET_ONCLOSE(state) {
    state.socket.isConnected = false;
  },
  SOCKET_ONERROR(state, event) {
    console.error(state, event);
  },
  // default handler called for all methods
  SOCKET_ONMESSAGE(state, message) {
    state.socket.message = message;
  },
  // mutations for reconnect methods
  SOCKET_RECONNECT(state, count) {
    state.socket.isReconnecting = true;
    console.info(state.socket, count, 'reconnect socket');
    if (count >= 3) {
      // window.location.href = '/';
    }
  },
  SOCKET_RECONNECT_ERROR(state) {
    state.socket.reconnectError = true;
  }
  //
};
export const getters = {
  isAuth: (state) => {
    return state.auth.isAuth;
  },
  userFromAuth: (state) => {
    if (!state.auth.user) {
      return {};
    }
    return state.auth.user;
  },
  userPermissions: (state) => {
    if (!state.auth.user) {
      return [];
    }
    return state.auth.user.application_access_permissions || [];
  },
  sysLanguage: (state) => {
    // languageObj
    if (state.currentLanguage === 'en') {
      return en;
    }
    return vi;
  }
};
export const actions = {};
