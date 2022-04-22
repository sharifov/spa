<template>
  <v-container fluid pa-0 style="height: 100%">
    <v-layout max row wrap>
      <v-flex xs12 class="title-page">
        <div class="title-background"></div>
        Ваш профиль
      </v-flex>
    </v-layout>

    <v-layout max row wrap class="profile">

      <v-flex xs12 py-4>
        <div class="profile--top">
          <div class="profile--avatar" @click="PickDocument">
            <v-icon class="profile--avatar-icon">edit</v-icon>
            <img v-if="document_api && document_api.url" :src="document_api.url" alt="avatar" class="profile--avatar-img">
            <img v-else :src="user.avatar_url" alt="avatar" class="profile--avatar-img">
          </div>
          <div class="profile--top-wrap">
            <div class="profile--name">{{user.full_name}}</div>
            <div class="profile--balance">
              Баланс:
              <b>{{user.balance}}</b>
            </div>
            <v-btn to="/profile-transactions" class="iek-btn transactions-btn auto-width">
              Движение баллов
            </v-btn>
          </div>
        </div>
      </v-flex>

      <v-flex lg10 offset-lg1 xs12>
        <v-layout row wrap>
          <v-flex sm12 class="profile--form pf-left">
            <div class="custom-title">Персональные данные</div>

            <form @submit.prevent="profileSubmit" autocomplete="off">
              <v-layout class="align-center justify-space-between">
                <v-flex sm3 xs4 class="pr-4">
                  <v-subheader class="nowrap">Фамилия <sup class="red--text">*</sup></v-subheader>
                </v-flex>
                <v-flex>
                  <v-text-field
                      type="text"
                      v-model="last_name"
                      :rules="[rules.required]"
                      required
                      id="lastName"
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row class="align-center">
                <v-flex sm3 xs4 class="pr-4">
                  <v-subheader class="nowrap">Имя <sup class="red--text">*</sup></v-subheader>
                </v-flex>
                <v-flex>
                  <v-text-field
                      type="text"
                      id="firstName"
                      v-model="first_name"
                      :rules="[rules.required]"
                      required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row class="align-center">
                <v-flex sm3 xs4 class="pr-4">
                  <v-subheader class="nowrap">Отчество <sup class="red--text">*</sup></v-subheader>
                </v-flex>
                <v-flex>
                  <v-text-field
                      type="text"
                      id="middleName"
                      v-model="middle_name"
                      :rules="[rules.required]"
                      required
                  ></v-text-field>
                    </v-flex>
              </v-layout>

              <v-layout row class="align-center">
                <v-flex sm3 xs4 class="pr-4">
                  <v-subheader class="nowrap">E-mail <sup class="red--text">*</sup></v-subheader>
                </v-flex>
                <v-flex>
                  <v-text-field
                      type="text"
                      v-model="email"
                      id="email"
                      :rules="[rules.required, rules.email]"
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row class="align-center">
                <v-flex sm3 xs4 class="pr-4">
                  <v-subheader class="nowrap">Телефон <sup class="red--text">*</sup></v-subheader>
                </v-flex>
                <v-flex>
                  <v-text-field
                      type="text"
                      v-model="phone"
                      v-mask="'+7 (###) ###-####'"
                      :rules="[rules.required, rules.phoneRules]"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-text-field style="display: none" @click='PickDocument' v-model='document_api.name'></v-text-field>
              <input type="file" style="display: none" ref="document" accept="image/*, application/pdf"
                     @change="OnDocument">
            </form>
          </v-flex>

          <div>
          <!--<v-flex md6 sm12 class="profile&#45;&#45;form">-->
            <!--<v-layout class="align-center justify-space-between">-->
              <!--<div class="custom-title">Данные анкеты НДФЛ</div>-->
              <!--<router-link to="/passport" class="block-chip">-->
                <!--<v-chip v-if="account" :class="`border-color-${account.status} sale-status bg-color-white`">-->
                  <!--{{account.status_label}}-->
                  <!--<span :class="`bg-color-${account.status} status-point`"></span>-->
                <!--</v-chip>-->
                <!--<v-chip v-else class="border-color-red sale-status bg-color-white">-->
                  <!--не заполнена-->
                  <!--<span class="bg-color-red status-point"></span>-->
                <!--</v-chip>-->
              <!--</router-link>-->
            <!--</v-layout>-->

            <!--<form @submit.prevent="profileSubmit" autocomplete="off">-->
              <!--<v-layout class="align-center justify-space-between">-->
                <!--<v-flex sm3 xs4 class="pr-4">-->
                  <!--<v-subheader class="nowrap">ИНН</v-subheader>-->
                <!--</v-flex>-->
                <!--<v-flex>-->
                  <!--<v-text-field-->
                          <!--type="text"-->
                  <!--&gt;</v-text-field>-->
                <!--</v-flex>-->
              <!--</v-layout>-->

              <!--<v-layout row class="align-center">-->
                <!--<v-flex sm3 xs4 class="pr-4">-->
                  <!--<v-subheader class="nowrap">Гражданство</v-subheader>-->
                <!--</v-flex>-->
                <!--<v-flex>-->
                  <!--<v-text-field-->
                          <!--type="text"-->
                  <!--&gt;</v-text-field>-->
                <!--</v-flex>-->
              <!--</v-layout>-->

              <!--<v-layout row class="align-center">-->
                <!--<v-flex sm3 xs4 class="pr-4">-->
                  <!--<v-subheader >Адрес <small>(регистрация)</small></v-subheader>-->
                <!--</v-flex>-->
                <!--<v-flex>-->
                  <!--<v-text-field-->
                          <!--type="text"-->
                  <!--&gt;</v-text-field>-->
                <!--</v-flex>-->
              <!--</v-layout>-->

              <!--<v-layout row class="align-center">-->
                <!--<v-flex sm3 xs4 class="pr-4">-->
                  <!--<v-subheader>Паспорт <small class="nowrap">(серия и номер)</small></v-subheader>-->
                <!--</v-flex>-->
                <!--<v-flex>-->
                  <!--<v-text-field-->
                          <!--type="text"-->
                  <!--&gt;</v-text-field>-->
                <!--</v-flex>-->
              <!--</v-layout>-->
            <!--</form>-->

            <!--<v-layout row wrap pt-3>-->
              <!--<v-flex xs6>-->
                <!--<v-layout class="align-center attach-block pr-4">-->
                  <!--<div class="attach-file">-->
                    <!--<v-flex class="icon-block">-->
                      <!--<v-subheader>-->
                        <!--<i class="material-icons">attach_file</i>-->
                      <!--</v-subheader>-->
                    <!--</v-flex>-->

                    <!--<v-flex>-->
                      <!--<v-text-field-->
                              <!--label="Разворот паспорта РФ"-->
                              <!--readonly-->
                      <!--&gt;</v-text-field>-->
                    <!--</v-flex>-->
                  <!--</div>-->
                  <!--<div class="attach-img">-->
                    <!--<input type="file" style="display: none" ref="document1" accept="image/*, application/pdf" >-->
                  <!--</div>-->
                <!--</v-layout>-->
              <!--</v-flex>-->

              <!--<v-flex xs6>-->
                <!--<v-layout class="align-center attach-block">-->
                  <!--<div class="attach-file">-->
                    <!--<v-flex class="icon-block">-->
                      <!--<v-subheader>-->
                        <!--<i class="material-icons">attach_file</i>-->
                      <!--</v-subheader>-->
                    <!--</v-flex>-->
                    <!--<v-text-field-->
                            <!--label="Страница регистрации"-->
                            <!--readonly-->
                    <!--&gt;</v-text-field>-->
                  <!--</div>-->

                  <!--<div class="attach-img">-->
                    <!--<input type="file" style="display: none" ref="document2" accept="image/*,application/pdf">-->
                  <!--</div>-->
                <!--</v-layout>-->

              <!--</v-flex>-->
            <!--</v-layout>-->
          <!--</v-flex>-->
          </div>
        </v-layout>

        <div>
        <!--<v-flex lg8 offset-lg2 md10 offset-md1 xs12>-->
          <!--<v-checkbox color="#ffcc02" class="rules-checkbox">-->
            <!--<template v-slot:label>-->
              <!--<small>-->
                <!--Я ознакомлен c <a href="">Правилами программы</a> и соглашаюсь с обработкой моих персональных данных-->
              <!--</small>-->
            <!--</template>-->
          <!--</v-checkbox>-->
        <!--</v-flex>-->
        </div>

        <v-flex sm6 offset-sm3 xs12 class="display-flex justify-center">
        <v-btn class="iek-btn" type="submit" :disabled="loading || !isEnabled" @click="profileSubmit">
          Сохранить
        </v-btn>
      </v-flex>

      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  export default {
    data() {
      return {
        last_name: '',
        first_name: '',
        middle_name: '',
        email: '',
        phone: '',
        document_api: { file: '', url: '', name: '' },
        rules: {
          required: value => !!value || 'Поле должно быть заполнено',
          email: value => pattern.test(value) || 'Поле E-mail заполнено с ошибками',
          phoneRules: value => !!value && (value.replace(/[^+0-9]/g, '').length === 12 || 'Номер телефона введён не полностью'),
        },
      };
    },
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
      account() {
        return this.$store.state.user.account;
      },
      isEnabled() {
        return !!this.last_name
            && !!this.first_name
            && !!this.middle_name
            && !!this.email
            && !!this.phone
            && this.phone.replace(/[^+0-9]/g, '').length === 12;
      },
    },
    methods: {
      profileSubmit() {
        const app = this;
        if (this.isEnabled && this.isAuthenticated) {
          const profile = {
            profile_id: app.user.profile_id,
            last_name: app.last_name,
            first_name: app.first_name,
            middle_name: app.middle_name,
            email: app.email,
            phone: app.user.phone_mobile,
          };
          app.$store.getters.axl.post('profiles/api/auth/profile-edit', profile)
            .then(() => {
              app.$store.dispatch('ShowInfo', 'Ваш профиль был успешно обновлён');
              this.$router.push('/');
            })
            .catch((error) => {
              app.$store.dispatch('HandleError', error);
            });
        } else {
          console.log('minus');
        }
      },
      PickDocument() {
        this.$refs.document.click();
      },
      OnDocument(e) {
        this.OnFilePicked(e);
      },
      OnFilePicked(e) {
        const app = this;
        const { files } = e.target;
        if (files[0] !== undefined) {
          const [file] = files;
          if (file.name.lastIndexOf('.') <= 0) {
            return;
          }
          app.document_api.name = file.name;
          const fr = new FileReader();
          fr.readAsDataURL(file);
          fr.addEventListener('load', () => {
            app.document_api.url = fr.result;
            console.log(fr);
            this.SetPhoto({
              name: file.name,
              url: fr.result,
            });
            app.$store.dispatch('GetProfile');
            app.$forceUpdate();
          });
        } else {
          app.app.document_api = { file: '', url: '', name: '' };
        }
      },
      SetPhoto(file) {
        const app = this;
        const fileNameArr = file.name.split('.');
        const data = {
          type: fileNameArr[fileNameArr.length - 1],
          image: file.url,
          id: app.user.profile_id,
        };
        this.$store.getters.axl.post('profiles/api/auth/load-avatar', data);
      },
    },
    mounted() {
      if (this.isAuthenticated) {
        this.$store.dispatch('eps/GetOrders', this.user.profile_id);
        this.last_name = this.$store.state.user.last_name;
        this.first_name = this.$store.state.user.first_name;
        this.middle_name = this.$store.state.user.middle_name;
        this.email = this.$store.state.user.email;
        this.phone = this.$store.state.user.phone_mobile;
      }
    },
  };
</script>

<style>

</style>
