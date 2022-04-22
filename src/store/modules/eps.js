import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    cards: [], // Список всех карт ЭПС, доступных для заказа.
    card: {}, // Выбранная электронная карта для детального просмотра.
    orders: [], // Заказы ЭПС.
    cart: {},
    cartLength: 0,
    cartSummary: 0,
  },
  getters: {
    cartItems(state) {
      const items = [];
      Object.keys(state.cart).forEach((cardType) => {
        Object.keys(state.cart[cardType]).forEach((nominal) => {
          if (nominal !== 'card' && state.cart[cardType][nominal]) {
            const qty = parseInt(state.cart[cardType][nominal], 10);
            for (let i = 0; i < state.cards.length; i += 1) {
              if (state.cards[i].type === cardType) {
                const card = state.cards[i];
                for (let j = 0; j < card.nominals_text.length; j += 1) {
                  if (card.nominals_text[j].price === parseInt(nominal, 10)) {
                    items.push({
                      card: cardType,
                      nominal: card.nominals_text[j].nominal,
                      qty,
                    });
                  }
                }
              }
            }
          }
        });
      });
      return items;
    },
  },
  actions: {
    GetOrders({ commit, rootGetters }, id) {
      rootGetters.ax.post('profiles/api/cards/orders', { profile_id: id })
        .then((response) => {
          commit('SetOrders', response.data.orders);
        });
    },
    GetCard({ state, commit }, type) {
      const card = state.cards.find(item => item.type === type);
      commit('SetCard', card);
    },
    AddToCart({ commit, dispatch }, card) {
      if (card.nominal === undefined || !card.nominal) {
        return;
      }
      commit('AddToCart', card);
      dispatch('CountCart');
    },
    ChangeQty({ commit, dispatch }, payload) {
      commit('ChangeQty', payload);
      dispatch('CountCart');
    },
    RemoveCard({ commit, dispatch }, payload) {
      commit('RemoveCard', payload);
      dispatch('CountCart');
    },
    CountCart({ state, commit }) {
      let cartSummary = 0;
      let cartLength = 0;
      Object.keys(state.cart).forEach((cardType) => {
        Object.keys(state.cart[cardType]).forEach((nominal) => {
          if (nominal !== 'card' && state.cart[cardType][nominal]) {
            const qty = parseInt(state.cart[cardType][nominal], 10);
            cartLength = parseInt(cartLength, 10) + qty;
            cartSummary = parseInt(cartSummary, 10) + qty * nominal;
          }
        });
      });
      commit('SetCartLength', cartLength);
      commit('SetCartSummary', cartSummary);
    },
    ClearCart({ commit }) {
      commit('ClearCart');
    },
  },
  mutations: {
    RemoveCard(state, payload) {
      Vue.delete(state.cart[payload.cardType], payload.nominal);
    },
    ChangeQty(state, payload) {
      Vue.set(state.cart[payload.cardType], payload.nominal, payload.qty);
    },
    AddToCart(state, card) {
      const nominal = `${card.nominal}`;
      const { qty } = card;
      if (state.cart[card.type]) {
        if (state.cart[card.type][nominal]) {
          Vue.set(state.cart[card.type], nominal, +state.cart[card.type][nominal] + +qty);
        } else {
          Vue.set(state.cart[card.type], nominal, qty);
        }
      } else {
        Vue.set(state.cart, card.type, { card });
        Vue.set(state.cart[card.type], nominal, qty);
      }
      if (!state.cart[card.type].card) {
        Vue.set(state.cart[card.type], 'card', card);
      }
    },
    ClearCart(state) {
      state.cart = {};
      state.cartLength = 0;
      state.cartSummary = 0;
    },
    SetCartLength(state, length) {
      state.cartLength = length;
    },
    SetCartSummary(state, summary) {
      state.cartSummary = summary;
    },
    SetCards(state, cards) {
      state.cards = cards;
    },
    SetOrders(state, orders) {
      state.orders = orders;
    },
    SetCard(state, card) {
      state.card = card;
    },
  },
};
