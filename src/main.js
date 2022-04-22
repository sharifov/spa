import velocity from 'velocity-animate';
import Notifications from 'vue-notification';
import Vue from 'vue';
import Vuetify from 'vuetify';
import Tooltip from 'vue-directive-tooltip';
import VueTheMask from 'vue-the-mask';
import router from './router';
import 'vuetify/dist/vuetify.min.css';
import store from './store/storage';
import App from './App.vue';
import './assets/directives';
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css';
import './assets/sass/main.scss';
// eslint-disable-next-line
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Vuetify);
Vue.use(Tooltip);
Vue.use(VueTheMask);
Vue.use(ElementUI);
Vue.use(Notifications, { velocity });
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    this.$store.commit('SetLoading', false);
  },
}).$mount('#app');
