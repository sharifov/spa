<template>
  <v-container fluid fill-height>
    <v-layout row wrap max>

      <v-flex lg4 offset-lg4 md8 offset-md2 xs12>
        <v-card>
          <v-card-title class="primary">
            <v-icon @click="Back">arrow_back</v-icon>
            Сменить пароль
          </v-card-title>
          <v-card-text class="pt-4">
            <div v-show="!sentCode && !token">
              <input style="display:none" type="text">
              <v-text-field
                type="text"
                label="Номер телефона"
                id="remindPhone"
                v-model="user.phone"
                placeholder=""
                v-mask="'+7 (###) ###-####'"
                autofocus
                required
                :rules="phoneRules"
              ></v-text-field>
              <v-card-actions class="pa-0 justify-space-between">
                <v-btn color="primary--btn" :disabled="loading" @click="SendCode">Отправить код</v-btn>
              </v-card-actions>
            </div>

            <h3 v-show="sentCode || token">{{user.phone}}</h3>

            <div v-show="sentCode && !token">
              <input style="display:none" type="number">

              <v-text-field
                id="remindCode"
                label="Проверочный код"
                v-mask="'#####'"
                v-model="code"
                placeholder=""
                required
                :rules="codeRules"
                type="number"
              ></v-text-field>

              <v-card-actions class="pa-0 justify-space-between">
                <v-btn color="primary--btn" :disabled="loading" @click="CheckCode">Проверить код</v-btn>
              </v-card-actions>
            </div>

            <div v-show="token">
              <form @submit.prevent="Remind" autocomplete="off">
                <input style="display:none" type="password">

                <!--type="password"-->

                <v-text-field
                  :append-icon="hidePw ? 'visibility_off' : 'visibility'"
                  @click:append="hidePw = !hidePw"
                  counter
                  id="remindPassword"
                  label="Пароль"
                  placeholder=""
                  required
                  :rules="passwordRules"
                  :type="hidePw ? 'password' : 'text'"
                  v-model="user.password"
                ></v-text-field>

                <!--type="password"-->

                <v-text-field
                  :append-icon="hidePw ? 'visibility_off' : 'visibility'"
                  @click:append="hidePw = !hidePw"
                  counter
                  label="Пароль"
                  placeholder=""
                  required
                  :rules="[comparePasswords]"
                  :type="hidePw ? 'password' : 'text'"
                  v-model="user.passwordConfirm"
                ></v-text-field>

                <v-card-actions class="pa-0 justify-space-between">
                  <v-btn color="primary--btn" type="submit" :disabled="loading">Задать пароль</v-btn>
                </v-card-actions>
              </form>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        user: {
          phone: '',
          password: '',
          passwordConfirm: '',
        },
        type: 'sms_profile',
        code: '',
        sentCode: false,
        token: null,
        hidePw: true,
        phoneRules: [
          v => (!v.length || v.length >= 17) || 'Номер телефона заполнен не полностью',
        ],
        codeRules: [
          v => !!v || 'Укажите проверочный код',
        ],
        passwordRules: [
          v => !!v || 'Укажите пароль',
        ],
      };
    },
    computed: {
      comparePasswords() {
        return this.user.password === this.user.passwordConfirm ? true : 'Пароли не совпадают';
      },
      loading() {
        return this.$store.state.loading;
      },
    },
    created() {
      this.Focus('remindPhone');
    },
    methods: {
      Focus(id) {
        this.$nextTick(() => {
          document.getElementById(id).focus();
        });
      },
      Reset() {
        this.user = {
          phone: '',
          password: '',
          passwordConfirm: '',
        };
        this.sentCode = false;
        this.code = '';
        this.token = null;
        this.Focus('remindPhone');
      },
      Back() {
        this.Reset();
        this.$router.push('/login');
      },
      SendCode() {
        const app = this;
        app.$store.getters.axl.post('api/token/get-sms', { phone: app.user.phone, type: app.type })
          .then(() => {
            app.sentCode = true;
            app.Focus('remindCode');
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
            app.Focus('remindPhone');
          });
      },
      CheckCode() {
        const app = this;
        app.$store.getters.axl.post('api/token/check-sms', { phone: app.user.phone, type: app.type, code: app.code })
          .then((response) => {
            app.token = response.data.token;
            app.Focus('regLastName');
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
            app.Focus('regCode');
          });
      },
      Remind() {
        const app = this;
        const formData = app.user;
        formData.token = app.token;

        app.$store.getters.axl.post('api/remind', formData)
          .then((response) => {
            app.Reset();
            app.$store.dispatch('ShowInfo', response.data.msg);
            app.$router.push('/login');
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
          });
      },
    },
  };
</script>
