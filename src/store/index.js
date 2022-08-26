import { createStore } from 'vuex';

// Create a new store instance.
const store = createStore({
  state() {
    return {
      notifications: [],
      id: 0,
      loading: false,
    };
  },
  mutations: {
    addNotification(state, payload) {
      state.notifications.push(payload.notification);
    },
    removeNotification(state, payload) {
      const index = state.notifications.findIndex(elem => elem.id === payload.id);
      if (index !== -1) state.notifications.splice(index, 1);
    },
    incrementId(state) {
      state.id += 1;
    },
    setLoading(state) {
      state.loading = !state.loading;
    },
  },
});

export default store;
