<template>
  <v-container fluid fill-height>
    <v-layout row wrap max>
      <v-flex lg6 offset-lg3 md8 offset-md2 xs12>
        <v-card>
          <v-card-title class="primary">
            Вход в программу
          </v-card-title>
          <v-card-text>
            <form @submit.prevent="Login" autocomplete="off">
              <input style="display:none" type="text">
              <v-text-field type="text" label="Номер телефона" id="login" v-model="login" placeholder=""
                            v-mask="'+7 (###) ###-####'" autofocus required
                            :rules="loginRules"></v-text-field>
              <input style="display:none" type="password">
              <v-text-field label="Пароль" v-model="password" placeholder="" required
                            :append-icon="hidePw ? 'visibility_off' : 'visibility'"
                            @click:append="hidePw = !hidePw"
                            :type="hidePw ? 'password' : 'text'"
                            counter></v-text-field>
            </form>
          </v-card-text>
          <v-card-actions class="pa-3 justify-space-between">
            <v-btn color="primary--btn" type="submit" :disabled="loading" @click="Login">Войти</v-btn>
            <v-btn color="primary--btn" to="/remind-password">Забыли пароль</v-btn>
          </v-card-actions>
        </v-card>
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
