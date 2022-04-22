<template>
  <v-container fluid fill-height pa-0>
    <v-layout max row wrap>
      <v-flex :class="`${isAuthenticated ? '' : 'md8 offset-md2'} xs12`">
        <div class="top-page pb-5">
          <div class="top-page--logo" v-if="!isAuthenticated">
            <img src="../assets/images/logo-big.png" alt="" class="logo-image">
          </div>
          <div class="top-page--title">
            <img src="../assets/images/rect.png" alt="" class="logo-rect">
            Обратная связь
          </div>
        </div>
      </v-flex>

      <v-flex xs12 class="md8 offset-md2">
        <v-form @submit.prevent="onSubmit || !valid" autocomplete="off" ref="form" validation v-model="valid">
          <v-text-field
              type="text"
              label="Имя"
              id="firstName"
              v-model="name"
              :autofocus="!isAuthenticated"
              required
              :rules="[rules.required]"
          ></v-text-field>

          <v-text-field
              type="text"
              label="E-mail"
              id="email"
              v-model="email"
              :rules="[rules.required, rules.email]"
          ></v-text-field>

          <v-text-field
              v-if="isAuthenticated"
              label="Номер телефона"
              id="regPhone"
              v-model="user.phone_mobile"
              placeholder=""
              v-mask="'+7 (###) ###-####'"
              required
              :rules="[rules.required, rules.phone]"
          ></v-text-field>

          <v-text-field
              v-else
              label="Номер телефона"
              id="regPhone"
              v-model="phone"
              placeholder=""
              v-mask="'+7 (###) ###-####'"
              required
              :rules="[rules.required, rules.phone]"
          ></v-text-field>

          <v-textarea
              type="text"
              label="Сообщение"
              id="message"
              v-model="message"
              required
              :rules="[rules.required]"
              :autofocus="isAuthenticated"
          ></v-textarea>

          <v-btn class="iek-btn" type="submit" :loading="loading" :disabled="!valid || loading"
                 @click="onSubmit">Отправить
          </v-btn>
        </v-form>


      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  const mailCheck = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  export default {
    data: () => ({
      valid: true,
      name: '',
      email: '',
      phone: '',
      message: '',
      rules: {
        required: v => !!v || 'Поле должно быть заполнено',
        email: v => mailCheck.test(v) || 'Поле E-mail заполнено с ошибками',
        phone: v => !!v && ((!v.length || v.length >= 17) || 'Номер телефона заполнен не полностью'),
      },
    }),

    computed: {
      user() {
        return this.$store.state.user;
      },
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },
      loading() {
        return this.$store.state.loading;
      },
    },
    methods: {
      onSubmit() {
        const app = this;
        if (this.$refs.form.validate()) {
          const feedSend = {
            name: app.name,
            email: app.email,
            phone_mobile_local: app.phone,
            content: app.message,
          };
          if (this.isAuthenticated) {
            feedSend.profile_id = app.user.profile_id;
          }
          app.$store.getters.axl.post('feedback/api/feedback/feedback', feedSend)
            .then(() => {
              app.$store.dispatch('ShowInfo', 'Сообщение отправлено');
              app.message = 'Отправлено';
              app.$router.push('/');
            })
            .catch((error) => {
              app.$store.dispatch('HandleError', error);
            });
        } else {
          console.log('minus');
        }
      },
    },
    mounted() {
      setTimeout(() => {
        if (this.isAuthenticated && this.user.profile_id) {
          this.$store.dispatch('eps/GetOrders', this.user.profile_id);
          this.name = this.$store.state.user.full_name;
          this.email = this.$store.state.user.email;
          this.phone = this.$store.state.user.phone_mobile;
        }
      }, 300);
    },
  };
</script>
