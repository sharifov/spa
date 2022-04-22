export default {
  namespaced: true,
  state: {
    payments: [], // переводы баллов на карты или телефон.
  },
  getters: {
  },
  actions: {
    GetPayments({ commit, rootGetters }, id) {
      rootGetters.ax.post('profiles/api/payments/by-profile', { profile_id: id })
        .then((response) => {
          commit('SetPayments', response.data.payments);
        });
    },
  },
  mutations: {
    SetPayments(state, payments) {
      state.payments = payments;
    },
  },
};
