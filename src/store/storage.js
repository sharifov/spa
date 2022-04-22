import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';
import eps from './modules/eps';
import payments from './modules/payments';
import router from '../router';

Vue.use(Vuex);

const baseURL = process.env.NODE_ENV === 'production' ? 'https://api-iek.msforyou.ru' : 'https://api-iek-dev.msforyou.ru/';
// const xToken = 'hkbbMrMvIsjFKNX2CqizgFmhdUeGBu9-JUIkPFh_lt4kvgd13-gMBmlYlkC7tmXG';
const xToken = '5bb49e2828a9e';

const store = new Vuex.Store({
  plugins: [createPersistedState({ key: 'promo', ssr: false })],
  state: {
    loading: false,
    profile_id: null,
    token: null,
    user: null,
    userTransactions: [],
    paymentsInfo: {},
    settings: {},
  },
  mutations: {
    SetUser(state, payload) {
      state.user = payload;
    },
    SetSettings(state, payload) {
      state.settings = payload;
    },
    SetLogged(state, payload) {
      state.profile_id = payload.profile_id;
      state.token = payload.token;
    },
    SetLoading(state, payload) {
      state.loading = payload;
    },
    SetPaymentsSettings(state, payload) {
      state.paymentsInfo.methods = payload;
    },
    Logout(state) {
      state.profile_id = null;
      state.user = null;
      state.token = null;
    },
  },
  actions: {
    UnsetError() {
      Vue.notify({ group: 'error', clean: true });
    },
    UnsetInfo() {
      Vue.notify({ group: 'info', clean: true });
    },
    ShowInfo({ dispatch }, message) {
      dispatch('UnsetError');
      dispatch('UnsetInfo');
      dispatch('ShowInfoMessage', message);
    },
    ShowError({ dispatch }, message) {
      dispatch('UnsetError');
      dispatch('UnsetInfo');
      dispatch('ShowErrorMessage', message);
    },
    ShowErrorMessage({}, message) {
      const text = `<i class="v-icon v-icon--left material-icons mr-1" style="vertical-align:bottom">error_outline</i> ${message}`;
      Vue.notify({ group: 'error', type: 'error', text, duration: 60000 });
    },
    ShowInfoMessage({}, message) {
      const text = `<i class="v-icon v-icon--left material-icons mr-1" style="vertical-align:bottom">notifications</i> ${message}`;
      Vue.notify({ group: 'info', type: 'info', text, duration: 7000 });
    },
    HandleError({ dispatch }, error) {
      if (error.response) {
        // Error recieved from the server
        const { data } = error.response;
        let errors = [];
        if ('error' in data) {
          errors = [data.error];
        } else if ('errors' in data) {
          if (Array.isArray(data.errors)) {
            ({ errors } = data);
          } else {
            Object.keys(data.errors).forEach((k) => {
              errors.push(data.errors[k]);
            });
          }
        }
        // maximum show 2 errors
        if (errors.length > 2) {
          errors = errors.slice(0, 2);
        }
        errors.forEach((message) => {
          dispatch('ShowErrorMessage', message);
        });
      } else if (error.request) {
        // The request was made but no response was received
        dispatch('ShowErrorMessage', 'С вашим подключением не все так просто. Пожалуйста, проверьте доступ к интернету');
      } else {
        // Something happened in setting up the request that triggered an Error
        dispatch('ShowErrorMessage', 'Что-то пошло не так');
        console.log(error.config);
      }
    },
    GetSettings({ commit, getters }) {
      getters.ax.post('api/settings')
        .then((response) => {
          commit('SetSettings', response.data.settings);
        });
    },
    GetPaymentsSettings({ commit, state, getters }) {
      if (state.profile_id) {
        getters.ax.post('payments/api-v3/settings/view')
          .then((response) => {
            if (!!state.user && state.user.group) {
              const tempResponse = { ...response };
              /* eslint-disable max-len */
              const settingsArray = tempResponse.data.settings; // массив с типами платежей (телефон, карта и т.д.)

              for (let i = 0; i < settingsArray.length; i += 1) { // если юзера не доступен перевод с телефона
                if (!this.state.user.group.phone_show && settingsArray[i].type === 'phone') {
                  settingsArray.splice(i, 1); // то такой перевод мы убираем
                }
                if (!this.state.user.group.card_show && settingsArray[i].type === 'card') {
                  settingsArray.splice(i, 1); // то такой перевод мы убираем
                }
              }
              settingsArray.filter(item => item.enabled);
              commit('SetPaymentsSettings', settingsArray);
            }
          });
      }
    },
    GetProfile({ commit, state, getters, dispatch }, payload) {
      getters.ax.post('profiles/api/auth/get-profile', { profile_id: state.profile_id })
        .then((response) => {
          commit('SetUser', response.data.profile);
          dispatch('GetPaymentsSettings');

          // eslint-disable-next-line
          if (!!payload) {
            if (payload.page === 'orders') {
              router.push('/eps-orders');
            } else if (payload.page === 'catalog') {
              router.push('/eps');
            } else {
              router.push('/dashboard');
            }
          }
        });
    },
    UserLogin({ commit, dispatch }, payload) {
      commit('SetLogged', payload);
      dispatch('GetSettings');
      dispatch('GetProfile', payload);
      dispatch('ShowInfoMessage', 'Добро пожаловать!');
    },
    UserLogout({ commit, dispatch }) {
      commit('Logout');
      dispatch('eps/ClearCart');
      localStorage.clear();
      dispatch('GetSettings');
    },
    DownloadFile({ getters, dispatch }, info) {
      getters.axf.post(info.url, info.data).then((response) => {
        const blob = new Blob([response.data]);
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, info.filename);
        } else {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', info.filename);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        }
      }).catch((error) => {
        dispatch('HandleError', error);
      });
    },
  },
  getters: {
    ax(state) {
      const ax = axios.create({
        baseURL,
        timeout: 60000,
        headers: { 'Content-Type': 'application/json', 'X-Token': xToken },
      });
      ax.interceptors.request.use(
        (config) => {
          if (state.token !== undefined && state.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
          }
          return config;
        },
        error => Promise.reject(error),
      );
      return ax;
    },
    axl(state) {
      const ax = axios.create({
        baseURL,
        timeout: 60000,
        headers: { 'Content-Type': 'application/json', 'X-Token': xToken },
      });
      ax.interceptors.request.use(
        (config) => {
          if (state.token !== undefined && state.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
          }
          state.loading = true;
          return config;
        },
        error => Promise.reject(error),
      );
      ax.interceptors.response.use(
        (response) => {
          state.loading = false;
          Vue.notify({ group: 'error', clean: true });
          return response;
        },
        (error) => {
          state.loading = false;
          Vue.notify({ group: 'error', clean: true });
          return Promise.reject(error);
        },
      );
      return ax;
    },
    axf(state) {
      const ax = axios.create({
        baseURL,
        timeout: 60000,
        headers: { 'Content-Type': 'application/json', 'X-Token': xToken },
        responseType: 'blob',
      });
      ax.interceptors.request.use(
        (config) => {
          if (state.token !== undefined && state.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
          }
          state.loading = true;
          return config;
        },
        error => Promise.reject(error),
      );
      ax.interceptors.response.use(
        (response) => {
          state.loading = false;
          Vue.notify({ group: 'error', clean: true });
          return response;
        },
        (error) => {
          state.loading = false;
          Vue.notify({ group: 'error', clean: true });
          return Promise.reject(error);
        },
      );
      return ax;
    },
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return state.profile_id !== null && state.profile_id !== undefined
        && state.token !== null && state.token !== undefined;
    },
  },
  modules: {
    eps,
    payments,
  },
});

export default store;
