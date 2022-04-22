import Vue from 'vue';
import Router from 'vue-router';

const routerOptions = [
  { path: '/', component: 'Index', meta: { requiresGuest: true } },
  { path: '/login', component: 'Login', meta: { requiresGuest: true } },
  { path: '/login-external/:id/:token', component: 'LoginExternal', props: true },
  { path: '/login-external/:id/:token/:page', component: 'LoginExternal', props: true },
  { path: '/register', component: 'RegisterExistingByPhone', meta: { requiresGuest: true } },
  { path: '/remind-password', component: 'RemindPassword', meta: { requiresGuest: true } },
  { path: '/dashboard', component: 'Dashboard', meta: { requiresAuth: true } },
  { path: '/eps', component: 'EpsCards', meta: { requiresAuth: true } },
  { path: '/eps/:type', component: 'EpsCard', props: true, meta: { requiresAuth: true } },
  { path: '/eps-cart', component: 'EpsCart', meta: { requiresAuth: true } },
  { path: '/eps-orders', component: 'EpsOrders', meta: { requiresAuth: true } },
  { path: '/passport', component: 'ProfilePassport', meta: { requiresAuth: true } },
  { path: '/profile-edit', component: 'ProfileEdit', meta: { requiresAuth: true } },
  { path: '/profile-transactions', component: 'ProfileTransactions', meta: { requiresAuth: true } },
  { path: '/feedback', component: 'Feedback' },
  { path: '*', component: 'NotFound' },
];

const routes = routerOptions.map(route => ({
  ...route,
  component: () => import(`@/components/${route.component}.vue`),
}));

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  Vue.notify({ group: 'error', clean: true });
  const { requiresGuest, requiresAuth } = to.meta;
  let isAuthenticated = false;
  const storage = localStorage.getItem('promo');

  if (storage !== null) {
    const { token } = JSON.parse(storage);
    if (token !== undefined && token !== null) {
      isAuthenticated = true;
    }
  }

  if (requiresGuest && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }

  if (requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
