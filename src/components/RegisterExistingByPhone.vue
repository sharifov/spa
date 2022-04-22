<template>
  <v-container fluid fill-height class="pa-0">
    <v-layout row wrap max class="registration">

      <v-flex lg8 offset-lg2  md8 offset-md2 sm10 offset-sm1 xs12>
        <div class="top-page">
          <div class="top-page--logo">
            <img src="../assets/images/logo-big.png" alt="" class="logo-image">
          </div>
          <div class="top-page--title">
            <img src="../assets/images/rect.png" alt="" class="logo-rect">
            Регистрация
          </div>
          <div class="centered back-btn" v-show="sentCode || token" @click="Reset">
            <v-icon title="Сбросить форму">arrow_back</v-icon>
            <span class="ml-2">Назад</span>
          </div>
        </div>

        <div v-show="!sentCode && !token">
          <div class="phone-spacer"></div>
          <input style="display:none" type="text">
          <v-text-field
                  type="text"
                  label="Номер телефона"
                  id="regPhone"
                  v-model="user.phone"
                  placeholder=""
                  v-mask="'+7 (###) ###-####'"
                  autofocus
                  required
                  :rules="phoneRules"
          ></v-text-field>
          <v-btn class="iek-btn" :disabled="loading || !validStep1" @click="SendCode">Получить код</v-btn>
        </div>

        <div class="phone-big centered" v-show="sentCode || token">{{user.phone}}</div>
        <div v-show="sentCode && !token">
          <input style="display:none" type="number">
          <v-text-field
                  :type="hidePw ? 'password' : 'text'"
                  :append-icon="hidePw ? 'visibility_off' : 'visibility'"
                  @click:append="hidePw = !hidePw"
                  label="Введите код из SMS"
                  id="regCode"
                  v-model="code"
                  placeholder=""
                  v-mask="'#####'"
                  required
                  :rules="codeRules"
          ></v-text-field>
          <div class="button-wrap">
            <v-btn class="iek-btn" :disabled="loading || !validStep2" @click="CheckCode">Отправить код</v-btn>
            <div class="button-wrap-text">
              <span>Введите в поле код, полученный Вами в СМС-сообщении.</span>
              <router-link to="/feedback">Не пришёл код?</router-link>
            </div>
          </div>
        </div>

        <div v-show="token">
          <v-form autocomplete="off" validation v-model="valid">
            <input style="display:none" type="text">
            <input style="display:none" type="email">
            <input style="display:none" type="password">
            <v-layout row wrap col-2>
              <v-flex sm6 xs12>
                <v-text-field type="text" label="Фамилия *" id="regLastName" class="req-input" v-model="user.last_name"
                              required :rules="[rules.text]"></v-text-field>
              </v-flex>
              <v-flex sm6 xs12>
                <v-text-field type="text" label="Имя *" class="req-input" v-model="user.first_name"
                              required :rules="[rules.text]"></v-text-field>
              </v-flex>
              <v-flex sm6 xs12>
                <v-text-field type="text" label="Отчество *" class="req-input" v-model="user.middle_name" required :rules="[rules.text]"></v-text-field>
              </v-flex>
              <v-flex sm6 xs12>
                <v-text-field type="email" label="E-mail адрес *" class="req-input" v-model="user.email" required :rules="[rules.email]"></v-text-field>
              </v-flex>
              <v-flex sm6 xs12>
                <v-text-field label="Пароль *" v-model="user.password" required class="req-input"
                              :append-icon="hidePw ? 'visibility_off' : 'visibility'"
                              @click:append="hidePw = !hidePw" :type="hidePw ? 'password' : 'text'" counter
                              :rules="[rules.password]"></v-text-field>
              </v-flex>
              <v-flex sm6 xs12>
                <v-text-field label="Повтор пароля *" v-model="user.passwordConfirm" required class="req-input"
                              :append-icon="hidePw ? 'visibility_off' : 'visibility'"
                              @click:append="hidePw = !hidePw" :type="hidePw ? 'password' : 'text'" counter
                              :rules="[comparePasswords]"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12>* - поле, обязательное для заполнения</v-flex>
              <v-flex xs12 sm12>
                <v-checkbox label="Согласие на обработку персональных данных" readonly v-model="user.checkedPers"
                            @click="dialogPers = true"></v-checkbox>
              </v-flex>
            </v-layout>

            <v-btn class="iek-btn" @click="Register" :disabled="!validStep3">Регистрация</v-btn>

          </v-form>
        </div>

      </v-flex>

      <v-dialog v-model="dialogPers" width="500" v-if="pagePers">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title v-html="pagePers.title"></v-card-title>
          <v-card-text v-html="pagePers.content"></v-card-text>
          <v-divider></v-divider>
          <div class="modal-button">
            <v-btn class="iek-btn" @click="dialogPers = false; user.checkedPers = false">Отклонить</v-btn>
            <v-btn class="iek-btn" @click="approvePers">Принять</v-btn>
          </div>
        </v-card>
      </v-dialog>

    </v-layout>
  </v-container>
</template>

<script>
  const mailCheck = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  export default {
    data() {
      return {
        user: {
          phone: '',
          first_name: '',
          last_name: '',
          middle_name: '',
          email: '',
          password: '',
          passwordConfirm: '',
          checkedPers: false,
        },
        valid: false,
        pageRules: null,
        pagePers: null,
        dialogPers: false,
        type: 'sms_profile_unregistered',
        code: '',
        sentCode: false,
        token: null,
        hidePw: true,
        rules: {
          phone: v => (!v.length || v.length >= 17) || 'Номер телефона заполнен не полностью',
          password: v => !!v || 'Укажите пароль',
          text: v => !!v || 'Поле должно быть заполнено',
          email: v => mailCheck.test(v) || 'Поле E-mail заполнено с ошибками',
        },
        phoneRules: [
          v => (!v.length || v.length >= 17) || 'Номер телефона заполнен не полностью',
        ],
        codeRules: [
          v => !!v || 'Укажите проверочный код',
        ],
      };
    },
    computed: {
      comparePasswords() {
        return this.user.password === this.user.passwordConfirm ? true : 'Пароли не совпадают';
      },
      validStep1() {
        return this.user.phone.length >= 17;
      },
      validStep2() {
        return this.code.length === 5;
      },
      validStep3() {
        return !!(this.user.first_name && this.user.last_name && this.user.middle_name
          && this.user.email && this.user.password && this.user.checkedPers
          && this.user.passwordConfirm && (this.comparePasswords === true));
      },
      loading() {
        return this.$store.state.loading;
      },
    },
    mounted() {
      this.Focus('regPhone');
    },
    methods: {
      approvePers() {
        this.dialogPers = false;
        this.user.checkedPers = true;
        const reqElements = document.querySelectorAll('.req-input');

        for (let i = 0; i < reqElements.length; i += 1) {
          const inputVal = reqElements[i].getElementsByTagName('input')[0].value;
          if (!inputVal) {
            reqElements[i].classList.add('error--text');
            reqElements[i].getElementsByTagName('label')[0].classList.add('error--text');
            reqElements[i].querySelector('.v-messages').classList.add('error--text');
          }
        }
      },
      LoadRegInfo() {
        const app = this;
        app.$store.getters.ax.post('profiles/api/register/info', { phone: app.user.phone })
          .then((response) => {
            app.pagePers = response.data.pagePers;
            const { profile } = response.data;
            if (profile) {
              app.user.first_name = profile.first_name;
              app.user.last_name = profile.last_name;
              app.user.middle_name = profile.middle_name;
              app.user.email = profile.email;
            }
          });
      },
      Focus(id) {
        this.$nextTick(() => {
          document.getElementById(id).focus();
        });
      },
      Reset() {
        this.user = {
          phone: '',
          first_name: '',
          last_name: '',
          middle_name: '',
          email: '',
          password: '',
          passwordConfirm: '',
          checkedRules: false,
          checkedPers: false,
        };
        this.sentCode = false;
        this.code = '';
        this.token = null;
        this.dialogRules = false;
        this.dialogPers = false;
        this.Focus('regPhone');
      },
      SendCode() {
        const app = this;
        app.$store.getters.axl.post('api/token/get-sms', { phone: app.user.phone, type: app.type })
          .then(() => {
            app.sentCode = true;
            app.Focus('regCode');
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
            app.Focus('regPhone');
          });
      },
      CheckCode() {
        const app = this;
        app.$store.getters.axl.post('api/token/check-sms', { phone: app.user.phone, type: app.type, code: app.code })
          .then((response) => {
            app.token = response.data.token;
            app.Focus('regLastName');
            app.LoadRegInfo();
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
            app.Focus('regCode');
          });
      },
      Register() {
        const app = this;
        const formData = app.user;
        formData.token = app.token;

        app.$store.getters.axl.post('profiles/api/register', formData)
          .then((response) => {
            app.$store.commit('SetLogged', response.data);
            app.Reset();
            app.$store.dispatch('ShowInfo', 'Добро пожаловать в программу!');
            app.$router.push('/dashboard');
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
          });
      },
    },
  };
</script>
