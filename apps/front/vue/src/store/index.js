import { createStore } from 'vuex';

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')),
    token: JSON.parse(localStorage.getItem('token')),
  },
  getters: {},
  mutations: {
    SET_TOKEN(state, token) {
      // eslint-disable-next-line no-param-reassign
      state.token = token;
      localStorage.setItem('token', JSON.stringify(token));
    },
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
  },
  actions: {
    setToken({ commit }, token) {
      commit('SET_TOKEN', token);
    },
    setUser({ commit }, user) {
      commit('SET_USER', user);
    },
  },
  modules: {},
});
