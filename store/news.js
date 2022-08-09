import api from '@/services';
const news = {
  state: () => ({
    detailNews: {},
    forceToReload: 0,
    listNews: [],
    prvScroll: 0,
    listSticker: []
  }),
  mutations: {
    setDetailNews(state, payload) {
      state.detailNews = { ...payload };
    },
    setListSticker(state, payload) {
      state.listSticker = [...payload];
    },
    setListNews(state, payload) {
      state.listNews = [...payload];
    },
    setPrvScroll(state, number) {
      state.prvScroll = number;
    },
    setForceToReload(state) {
      state.forceToReload += 1;
    }
  },
  actions: {
    async getListSticker({ commit }) {
      const res = await api.annoucement.getListSticker({ pagination: false });
      if (!res) {
        commit('toast/getError', this.sysLanguage.snackbar.getStickerFail);
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          commit('toast/getError', res.data.message);
          return;
        }
        commit('setListSticker', res.data.data.sticker_albums);
      } catch (error) {
        commit('toast/getError', `${error}`);
      }
    }
  }
};
export default news;
