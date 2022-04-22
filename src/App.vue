<template>
  <v-app>
    <v-content>
      <v-container fluid>

        <v-navigation-drawer v-model="sidebar" app temporary class="left-menu__list">
          <v-list class="profile-link" v-if="user">
            <v-list-tile avatar to="/profile-edit">
              <v-list-tile-content>
                <v-list-tile-title class="avatar-wrap">
                  <div class="user-avatar">
                    <img :src="user.avatar_url" alt="avatar">
                  </div>
                  <div class="profile-link--data">
                    <div class="profile-link--bonus">Баланс: <span class="bonus-number">{{user.balance}}</span></div>
                  </div>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <div class="profile-link--name">{{user.full_name}}</div>
            </v-list-tile>
            <v-divider></v-divider>
          </v-list>

          <v-list>
            <v-list-tile v-if="epsCartLength" to="/eps-cart">
              <v-list-tile-action class="menu-icon">
                <v-icon>shopping_cart</v-icon>
              </v-list-tile-action>
              <v-list-tile-content class="left-menu__cart">Корзина <span class="badge">{{epsCartLength}}</span></v-list-tile-content>
            </v-list-tile>

            <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.path">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>{{ item.mobileTitle ? item.mobileTitle : item.title }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile v-if="isAuthenticated" @click="UserLogout">
              <v-list-tile-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>Выход</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-navigation-drawer>



        <v-toolbar
                v-if="isAuthenticated"
                app
                dense
                text-md-center id="header"
                class="elevation-0"
        >
          <span class="show-xs">
            <v-toolbar-side-icon class="menu-btn" large @click="sidebar = !sidebar"></v-toolbar-side-icon>
          </span>
          <v-toolbar-title>
            <router-link :to="isAuthenticated ? '/dashboard' : '/'" tag="span" class="logo-wraper">
              <img src="@/assets/images/logo.png" id="nav-logo"/>
            </router-link>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <span v-if="epsCartLength" class="hidden-md-and-up">
            <v-btn icon to="/eps-cart" class="menu-link cart my-1">
              <v-badge right color="#fbcb30" v-if="epsCartLength">
                <span slot="badge">{{epsCartLength}}</span>
              </v-badge>
              <v-icon class="icon-menu">shopping_cart</v-icon>
            </v-btn>
          </span>

          <v-toolbar-items class="hidden-xs-only" id="menu-top">
            <router-link v-for="item in menuItems" :key="item.title" :to="item.path" class="menu-link">
              <v-icon class="icon-menu">{{ item.icon }}</v-icon>
              <span class="title-menu">{{ item.title }}</span>
            </router-link>

            <template v-if="isAuthenticated && user">
              <router-link
                v-if="!!userGroup && epsCartLength"
                to="/eps-cart"
                class="menu-link cart"
                v-tooltip.bottom="'Сертификаты в корзине на сумму: ' +
                  ((!!userGroup && !!+userGroup.certificates_price_coefficient) ?
                  (epsCartSummary * userGroup.certificates_price_coefficient) :
                  epsCartSummary)"
              >
                <v-badge right color="#fbcb30" v-if="epsCartLength">
                  <span slot="badge">{{epsCartLength}}</span>
                </v-badge>
                <v-icon class="icon-menu">shopping_cart</v-icon>
              </router-link>

              <router-link to="/profile-edit" class="menu-link">
                <v-icon class="icon-menu">person</v-icon>
                <span class="title-menu" v-html="user.full_name"></span>
              </router-link>

              <router-link to="/profile-transactions" class="menu-link">
                <span class="title-menu">{{user.balance}} баллов</span>
              </router-link>

              <div to="/" @click="UserLogout" class="menu-link">
                <v-icon class="icon-menu">exit_to_app</v-icon>
              </div>
            </template>

          </v-toolbar-items>
          <img v-show="loading" src="@/assets/images/loader.gif" id="loader-gif"/>
        </v-toolbar>

        <transition name="fade" mode="out-in">
          <router-view class="view"></router-view>
        </transition>

        <notifications group="error" position="bottom center" width="500px" animation-type="velocity"/>
        <notifications group="info" position="bottom center" width="500px" animation-type="velocity"/>

      </v-container>
    </v-content>

    <v-footer id="footer" app height="auto" absolute>
      <v-layout max>
        <v-flex :class="`footer-wrap ${isAuthenticated ? '' : 'lg10 offset-lg1'}`">
          <img class="hide-xs" src="@/assets/images/logo_ms.png"/>
          <span class="hide-xs">© ООО "Лоялти сервис"</span>
          <v-btn to="/feedback" icon class="footer-support">
            <i class="material-icons support-icon">contact_support</i>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>


<script>
  export default {
    data() {
      return {
        sidebar: false,
        name: '',
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      },
      userGroup() {
        const tempUser = !!this.user;
        return tempUser ? this.$store.state.user.group : null;
      },
      paymentsInfo() {
        return this.$store.state.paymentsInfo.methods;
      },
      userAvatar() {
        return this.$store.state.user.full_name.split(' ').map(x => x[0]).join('');
      },
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },
      loading() {
        return this.$store.state.loading;
      },
      epsCartLength() {
        return this.$store.state.eps.cartLength;
      },
      epsCartSummary() {
        return this.$store.state.eps.cartSummary;
      },
      menuItems() {
        const menuItemsArray = [];

        if (this.isAuthenticated) {
          !!this.userGroup && menuItemsArray.push({ title: 'Заказы', path: '/eps-orders', icon: 'shopping_basket' });

          if (!!this.userGroup && ((!!this.paymentsInfo && this.paymentsInfo.length)
            || (!!this.userGroup.certificates_show))
          ) {
            menuItemsArray.push({ title: 'Призы', path: '/eps', icon: 'card_giftcard' });
          }
          // { title: 'Личный кабинет', path: '/dashboard', icon: 'home' },
          // { title: 'Обратная связь', path: '/feedback', icon: 'feedback' },
          return menuItemsArray;
        }

        menuItemsArray.push({ title: null, path: '/', icon: 'home', mobileTitle: 'Главная страница' });
        menuItemsArray.push({ title: 'Обратная связь', path: '/feedback', icon: 'feedback' });
        menuItemsArray.push({ title: 'Регистрация', path: '/register', icon: 'verified_user' });
        menuItemsArray.push({ title: 'Войти', path: '/login', icon: 'exit_to_app' });

        return menuItemsArray;
      },
    },
    methods: {
      UserLogout() {
        this.$store.dispatch('UserLogout');
        this.$router.push('/');
      },
    },
    created() {
      this.$store.commit('SetLoading', false);
    },
    mounted() {
      if (this.isAuthenticated) {
        this.$store.dispatch('GetProfile');
      }
    },
  };
</script>
