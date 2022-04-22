<template>
  <v-container fluid fill-height>
    <v-layout row wrap max>
      <v-flex lg4 offset-lg4 md8 offset-md2 xs12>
        <v-card>
          <v-card-title class="primary">
            Вход в программу
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['id', 'token', 'page'],
    methods: {
      Login() {
        const app = this;
        const data = { external_id: app.id, external_token: app.token };
        app.$store.getters.axl.post('api/login/external', data)
          .then((response) => {
            app.$store.dispatch('UserLogin', { ...response.data, page: app.page });
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
          });
      },
    },
    mounted() {
      this.$store.dispatch('UserLogout');
      this.Login();
    },
  };
</script>
