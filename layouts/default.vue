<template>
  <v-app data-app>
    <div
      id="app"
      class="app-container p-maker"
      :class="routeName === 'Login' ? 'primary login-app' : 'app_bg'"
      @scroll="refScroll"
    >
      <Header v-if="isAuth" />
      <v-container class="py-0">
        <v-row class="main-board my-0 mt-3 no-wrap">
          <v-col v-if="isAuth" cols="2" class="pt-0 v-app__sidebar">
            <Sidebar />
          </v-col>
          <v-col
            :cols="!isAuth ? '12' : '10'"
            class="pt-0 pb-0 v-app__router-view"
          >
            <nuxt />
            <div v-if="isAuth" class="pt-0 v-app__sidebar pb-3">
              <RightBarSticky />
            </div>
          </v-col>
          <!-- <v-col cols="3" v-if="isAuth" class="pt-0 v-app__sidebar pb-3">
            <RightBarSticky />
          </v-col> -->
        </v-row>
      </v-container>
    </div>
    <Logout />
    <ListUserReadOnly />
    <FullPageView :on-show="showFullPage" />
    <div class="list-toastMsg">
      <p
        v-for="tm in toastMsg"
        :key="tm.uuid"
        class="toastMsg"
        :class="`toast-msg__${tm.type} snack_${tm.type}`"
      >
        <img
          v-if="tm.type === 'success'"
          height="32px"
          src="@/assets/images/toast-success.svg"
          alt="toast-success"
          class="toast-img-success"
        />
        <img
          v-if="tm.type === 'info'"
          height="32px"
          src="@/assets/images/toast-info.svg"
          alt="toast-info"
          class="toast-img-info"
        />
        <img
          v-if="tm.type === 'warning'"
          height="32px"
          src="@/assets/images/toast-warning.svg"
          alt="toast-warning"
          class="toast-img-warning"
        />
        <img
          v-if="tm.type === 'error'"
          height="32px"
          src="@/assets/images/toast-error.svg"
          alt="toast-error"
          class="toast-img-error"
        />

        {{ tm.msg }}
      </p>
    </div>
  </v-app>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Sidebar from '@/components/Layout/Sidebar.vue';
import RightBarSticky from '@/components/Layout/RightBarSticky.vue';
import FullPageView from '@/components/FullPageView.vue';

import Header from '@/components/Layout/Header';
import Logout from '@/components/Dialog/Logout';
import ListUserReadOnly from '@/components/Dialog/ListUserReadOnly';
export default {
  name: 'DefaultLayout',
  components: {
    Header,
    Logout,
    ListUserReadOnly,
    Sidebar,
    RightBarSticky,
    FullPageView
  },
  sockets: {
    connect() {
      console.log('socket connected');
    }
  },
  data() {
    return {
      refContainerScroll: 1
    };
  },
  computed: {
    ...mapState({
      toastMsg: (state) => state.toast.messages,
      listImagePreview: (state) => state.listImagePreview
    }),
    showFullPage() {
      return !!(this.listImagePreview && this.listImagePreview.length);
    },
    ...mapGetters({
      isAuth: 'isAuth'
    })
  },
  watch: {
    isAuth() {
      if (this.isAuth) {
        this.toggleLogin();
      }
    },
    toastMsg: {
      deep: true,
      handler() {
        setTimeout(() => {
          this.toastMsg.forEach((o) => {
            this.$store.commit('toast/remove', o);
          });
        }, 4000);
      }
    }
  },
  mounted() {
    this.handleTheme();
    this.syncFavicon();
    if (window) {
      window.addEventListener('online', () => {
        this.$store.commit('toast/getSuccess', 'Back to online');
      });
      window.addEventListener('offline', () => {
        this.$store.commit(
          'toast/getError',
          'Your internet connection is offline now'
        );
      });
    }
    if (this.isAuth) {
      this.toggleLogin();
    }
    // const token =
    //   "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvc2VjdXJlLWRldi52YW5ncGhhaXNpbmgudm5cL2FwaVwvYXV0aFwvY3VzdG9tZXJzXC9sb2dpbiIsImlhdCI6MTY0ODExMzMxMSwiZXhwIjoxNjUzMjk3MzExLCJuYmYiOjE2NDgxMTMzMTEsImp0aSI6IlI0SlFSUDJ0OU16Wk5lbUwiLCJzdWIiOjE5LCJwcnYiOiIwNzVhZWZjNjdlMWUxYjhjMzdiZDUyZWJkNjE4NWNjODQ4NDQzM2EyIn0.wcQcl3cSoO2-yjN0qhulxX2E4bN-TmftaX-0cMmwwqE"
    // const channel = this.$socket.emit("subscribe", {
    //   channel: `private-customer-${19}`,
    //   auth: {
    //     headers: {
    //       Authorization: token,
    //     },
    //   },
    // })

    // this.$socket.emit("subscribe", {
    //   channel: `price-standard-gold-live`,
    // })
    // // Thay đổi giá vàng standard
    // this.sockets.subscribe("App\\Events\\PriceStandardGoldEvent", (data) => {
    //   console.log(data)
    // })
  },
  methods: {
    handleTheme() {
      if (process.env.VUE_APP_CURRENT_THEME === 'TRUSTANA') {
        this.$vuetify.theme.themes.light = {
          ...this.$vuetify.theme.defaults.trust_ana
        };
      } else {
        this.$vuetify.theme.light = true;
      }
    },
    syncFavicon() {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = process.env.VUE_APP_FAVICON
        ? process.env.VUE_APP_FAVICON
        : '';
    },
    handleSyncTheme() {
      const iconURL1 = 'https://vn.tradingview.com/static/images/favicon.ico';
      return iconURL1;
    },
    toggleLogin() {
      this.$store.dispatch('users/getListContacts');
      this.$store.dispatch('users/getListUsers');
      this.$store.dispatch('users/getListCompanies');
      this.$store.dispatch('users/getListDepartments');
      this.$store.dispatch('users/getListPositions');
      this.$store.dispatch('users/getListUserGroup');
      this.$store.dispatch('news/getListSticker');
    },
    refScroll(e) {
      clearTimeout(this.refContainerScroll);
      this.refContainerScroll = setTimeout(() => {
        if (
          ['news', 'index'].includes(this.routeName) &&
          !this.$route.query.q
        ) {
          this.$store.commit('news/setPrvScroll', e.target.scrollTop);
        }
      }, 100);
    }
  }
};
</script>
<style>
@import url('@/assets/fonts/Roboto/stylesheet.css');
.font-utm_nokia {
  font-family: 'Roboto';
}
</style>
<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  .bg-transparent {
    background: transparent !important;
  }
}
body {
  background-color: var(--v-theme-primary) !important;
  scroll-behavior: smooth;
  width: calc(100vw - 0px);
  &::-webkit-scrollbar {
    width: 1px;
  }

  &::-webkit-scrollbar-track {
    background: #ffffff;
    border-radius: 0px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 0px;
    background: #000;
  }
  max-height: 100vh;
  /* overflow-x: hidden; */
  overflow: hidden;
  .v-app__router-view {
    flex-grow: 1;
    display: flex;
    gap: 24px;
    /* max-width: calc((100% * 10) / 12 - 340px); */
    /* flex-basis: calc((100% * 10) / 12 - 340px); */
  }
  *:not(i) {
    font-family: 'Roboto';
  }
  .input-no-focus {
    &:focus {
      border: none !important;
      outline: none !important;
    }
  }
  .font-weight-semibold {
    font-weight: 600 !important;
  }
}

.list-toastMsg {
  position: fixed;
  z-index: 99999;
  bottom: 10px;
  left: 32px;
  .toastMsg {
    text-align: center;
    color: #fff;
    font-weight: 400;
    font-size: 14px;
    padding: 4px 16px;
    border-radius: 4px;
    min-width: 326px;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    transform: translateY(10px);
    opacity: 0;
    animation: showUp 0.3s 0.1s linear forwards;
  }
  .toast-msg {
    &__error {
      background-color: #f3271cc5;
    }
    &__success {
      background-color: #005b889f;
    }
  }
}
@keyframes showUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  20% {
    opacity: 1;
    transform: translateY(3px);
  }
  60% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.main-board {
  /* padding: 0px 32px !important; */
  /* height: calc(100vh - 70px);
  overflow-y: scroll;
  overflow-x: hidden; */
}
/* VUETIFY OVERWRITE */
.page-container {
  /* min-height: 100vh; */
  width: calc(100% - 340px) !important;
}
.m-0 {
  margin: 0 !important;
}
.p-0 {
  padding: 0 !important;
}
.h-100 {
  height: 100% !important;
}
.w-100 {
  width: 100% !important;
}
.flex-no-wrap {
  flex-wrap: nowrap !important;
}
.v-btn-normalize {
  text-transform: none !important;
  letter-spacing: 0.0025em !important;
  height: auto !important;
}
.v-btn-text-left {
  justify-content: flex-start !important;
  text-align: left !important;
}
.v-tab-normalize {
  text-transform: none !important;
  letter-spacing: 0.0025em !important;
  height: auto !important;
}
.v-texarea-normalize {
  .v-input__slot {
    &::before,
    &::after {
      display: none !important;
    }
  }
}
.v-btn-n-focus {
  &:focus:before {
    opacity: 0 !important;
  }
}
.no-box-shadow {
  box-shadow: none !important;
}
.capitalize {
  text-transform: capitalize !important;
}
.scroll-y-mod_big {
  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 4px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0);
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: rgba(136, 136, 136, 0);
    border-radius: 4px;
  }
  &:hover {
    /* Handle on hover */
    &::-webkit-scrollbar-thumb {
      background: rgba(136, 136, 136, 0.693);
    }
  }
}
.app-scroll {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #e6e6e6;
    border-radius: 0px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 0px;
    background: rgb(96, 96, 96);
  }
}
.v-autocomplete-form__mod {
  border: 1px solid #f2f2f2;
  border-radius: 8px !important;
  input::placeholder {
    color: #808080 !important;
    font-weight: 400;
    font-size: 14px !important;
  }
  input {
    font-weight: 400;
    font-size: 14px !important;
  }
  &.v-select--is-menu-active {
    background-color: #f2f8fa !important;
    .v-input__slot {
      background-color: #f2f8fa !important;
    }
  }

  &.v-input--is-label-active {
    .v-input__append-inner:nth-child(3) {
      display: none;
    }
  }
}
.no-before {
  &::before {
    display: none !important;
  }
}
.box-shadow--mod {
  box-shadow: 0px 1px 3px 0px #0000000a, 0px 1px 1px 0px #00000014,
    0px 2px 1px -1px #0000001f, 0px 4px 1px -1px #0000001f !important;
}
.box-shadow--mod-lighter {
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.12),
    0px 1px 1px rgba(0, 0, 0, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.04) !important;
}
@media only screen and (min-width: 960px) {
  .container {
    /* width: 100% !important; */
    max-width: 100% !important;
  }
}
@media only screen and (min-width: 1240px) {
  .container {
    max-width: 1200px !important;
  }
}
@media only screen and (min-width: 1560px) {
  .container {
    max-width: 1440px !important;
  }
}
@media only screen and (min-width: 1904px) {
  .container {
    max-width: 1580px !important;
  }
}
.limit-line-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.limit-line-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  line-clamp: 1;
  -webkit-box-orient: vertical;
}
.v-app__sidebar {
  position: sticky;
  top: 72px;
  height: fit-content;
  .right-side-sticky-btn {
    min-width: 332px;
    width: 332px;
  }
}
.no-wrap {
  flex-wrap: nowrap !important;
}
.pointer {
  cursor: pointer;
}
div.divivder {
  height: 1px;
  width: 100%;
}
.content-wrap-relative {
  position: relative;
}
.v-btn.btn-load-absolute {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}
body .v-application .font-weight-regular {
  font-weight: 400 !important;
}
[contentEditable='true']:empty:before {
  content: attr(data-text);
  height: 32px;
  line-height: 32px;
  color: #b3b3b3;
  font-weight: 300 !important;
}
.border-prim {
  border-color: #006c99 !important;
}
.app-container {
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  scroll-behavior: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #e6e6e6;
    border-radius: 0px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 0px;
    background: rgb(96, 96, 96);
  }
  .disabled-btn {
    pointer-events: none;
  }
}
</style>
