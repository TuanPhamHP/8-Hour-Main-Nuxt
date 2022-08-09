// import Store from './toast';
let uuid = 0;
class ToastMessage {
  constructor(type, msg, duration) {
    this.type = type;
    this.msg = msg;
    this.duration = duration || 1000;
    this.uuid = uuid++;
    this.timer = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove() {
    // Store.commit('remove', this);
  }
}
const toast = {
  state: () => ({
    messages: []
  }),
  mutations: {
    push(state, msg) {
      // console.log(msg)
      state.messages.push(msg);
    },
    remove(state, msg) {
      const index = state.messages.findIndex((o) => o.uuid === msg.uuid);
      state.messages.splice(index, 1);
    },
    getInfo(state, message, duration) {
      state.messages.push(new ToastMessage('info', message, duration));
    },
    getSuccess(state, message, duration) {
      // Store.commit('push', new ToastMessage('success', message, duration));
      state.messages.push(new ToastMessage('success', message, duration));
    },
    getError(state, message, duration) {
      // store.commit('push', new ToastMessage('error', message, duration));
      state.messages.push(new ToastMessage('error', message, duration));
    },
    getWarning(state, message, duration) {
      state.messages.push(new ToastMessage('warning', message, duration));
      // Store.commit('push', new ToastMessage('warning', message, duration));
    }
  },
  actions: {},
  getters: {}
};
export default toast;
