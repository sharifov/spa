<template>
  <v-container fluid fill-height class="enter-page">
    <v-layout row max class="content-centered">
      <v-flex lg10 offset-lg1 md12 sm12 xs12>
        <div class="enter-page--head">
          <div class="enter-page--logo">
            <img src="../assets/images/logo-big.png" alt="">
          </div>
          <div class="top-wrap">
            <div class="enter-page--title hide-xs">Получайте сертификаты прямо сейчас!</div>
            <div class="enter-page--rect">
              <img src="../assets/images/rect.png" alt="">
            </div>
          </div>
          <div class="enter-page--title show-xs">Получайте сертификаты прямо сейчас!</div>
        </div>

        <div class="enter-page--body">
          <div class="enter-page--background">
            <img src="../assets/images/main-img.jpg" alt="" class="hide-sm">
            <img src="../assets/images/main-img_mobile.jpg" alt="" class="show-sm">
          </div>

          <div class="enter-page--form">
            <form @submit.prevent="Login" autocomplete="off">
              <input style="display:none" type="text">
              <v-text-field
                      type="text"
                      label="Телефон"
                      id="login"
                      v-model="login"
                      placeholder=""
                      v-mask="'+7 (###) ###-####'"
                      autofocus required
                      :rules="loginRules"
              ></v-text-field>
              <input style="display:none" type="password">
              <v-text-field
                      label="Пароль"
                      v-model="password"
                      placeholder=""
                      required
                      :append-icon="hidePw ? 'visibility_off' : 'visibility'"
                      @click:append="hidePw = !hidePw"
                      :type="hidePw ? 'password' : 'text'"
                      counter
              ></v-text-field>
            </form>
            <div class="enter-page--buttons">
              <v-btn
                      color="#ffcc02"
                      type="submit"
                      :disabled="loading"
                      @click="Login"
                      class="iek-btn"
              >Войти</v-btn>

              <div class="reg-btn">
                <v-btn color="" to="/remind-password" class="custom-link">
                  Забыли пароль?
                </v-btn>
                <v-btn to="/register" class="custom-link register-link">
                  <i class="material-icons mr-1">verified_user</i>
                  <span>Зарегистрироваться</span>
                </v-btn>
              </div>

              <v-checkbox
                      v-model="selected"
                      label="Запомнить меня"
                      value="Запомнить меня"
                      color="#324b4c"
                      class="check-member"
              ></v-checkbox>
            </div>

          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        login: '',
        password: '',
        hidePw: true,
        selected: false,
        loginRules: [
          v => (!v.length || v.length >= 17) || 'Номер телефона заполнен не полностью',
        ],
      };
    },
    methods: {
      Login() {
        const app = this;
        app.$store.getters.axl.post('api/login', { login: app.login, password: app.password })
          .then((response) => {
            app.$store.dispatch('UserLogin', response.data);
            app.$router.push('/dashboard');
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
          });
      },
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      },
    },
  };
</script>
