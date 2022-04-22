<template>
  <v-container fluid fill-height pa-0>
    <v-layout max row wrap col-2>

      <v-flex xs12 lg8 :class="form.comments.length > 0 ? '' : 'offset-lg2 pa-0'">
        <v-card>
          <v-card-title class="primary">Налоговая анкета</v-card-title>
          <v-card-text>
            <div class="mb-4">
              Для заказа подарка необходимо заполнить все поля. Это нужно, чтобы мы заплатили за
              Вас налог на доходы физических лиц в соответствии с законодательством Российской Федерации
            </div>

            <form @submit.prevent="SavePassport" autocomplete="off">
              <v-layout row wrap col-2>
                <v-flex sm6 xs12>
                  <v-text-field type="text" label="Фамилия" v-model="form.last_name" placeholder=""
                                required></v-text-field>
                </v-flex>
                <v-flex sm6 xs12>
                  <v-text-field type="text" label="Имя" v-model="form.first_name" :value="form.first_name"
                                placeholder="" required></v-text-field>
                </v-flex>
                <v-flex sm6 xs12>
                  <v-text-field type="text" label="Отчество" v-model="form.middle_name" placeholder=""></v-text-field>
                </v-flex>
                <v-flex sm6 xs12>
                  <v-text-field type="text" label="Дата рождения (дд.мм.гггг)" v-model="form.birthday_on_local"
                                placeholder="14.01.1987" v-mask="'##.##.####'"></v-text-field>
                </v-flex>
                <v-flex sm6 xs12>
                  <v-text-field type="text" label="Серия и номер паспорта" v-model="form.document_series_and_number"
                                placeholder="1234 567890" v-mask="'#### ######'"></v-text-field>
                </v-flex>
                <v-flex sm6 xs12>
                  <v-text-field type="text" label="Идентификационный номер налогоплательщика" v-model="form.inn"
                                placeholder="ИНН" v-mask="'############'"></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12>
                  <div class="v-input v-text-field theme--light">
                    <div class="v-input__control">
                      <div class="v-input__slot">
                        <div class="v-text-field__slot">
                          <label aria-hidden="true" class="v-label v-label--active theme--light"
                                 style="left: 0px; right: auto; position: absolute;">Адрес места жительства в РФ</label>

                          <el-autocomplete v-model="form.address" :fetch-suggestions="AutocompleteSearch"
                                           @select="AutocompleteSelect" placeholder="Москва, Тверской б-р, д 9"
                                           :trigger-on-focus="false" id="form-address"></el-autocomplete>
                        </div>
                      </div>
                      <div class="v-text-field__details">
                        <div class="v-messages theme--light">
                          <div class="v-messages__wrapper"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-flex>

                <v-flex xs12 mt-0 v-if="form && form.address_data" id="address-suggestion">
                  <div class="adress-table">
                    <div class="at-wrap">
                      <div class="atw-title">Почтовый индекс</div>
                      <div class="atw-data">{{form.address_data.postal_code}}</div>
                    </div>
                    <div class="at-wrap">
                      <div class="atw-title">Код региона</div>
                      <div class="atw-data">{{form.address_data.region_kladr_id}}</div>
                    </div>
                    <div class="at-wrap">
                      <div class="atw-title">Регион</div>
                      <div class="atw-data">{{form.address_data.region_with_type}}</div>
                    </div>
                    <div class="at-wrap">
                      <div class="atw-title">Город</div>
                      <div class="atw-data">{{form.address_data.city_with_type}}</div>
                    </div>
                    <div class="at-wrap">
                      <div class="atw-title">Улица</div>
                      <div class="atw-data">{{form.address_data.street_with_type}}</div>
                    </div>
                    <div class="at-wrap">
                      <div class="atw-title">Номер дома</div>
                      <div class="atw-data">{{form.address_data.house}}</div>
                    </div>
                    <div class="at-wrap">
                      <div class="atw-title">Корпус</div>
                      <div class="atw-data">{{form.address_data.block}}</div>
                    </div>
                    <div class="at-wrap">
                      <div class="atw-title">Номер квартиры</div>
                      <div class="atw-data">{{form.address_data.flat}}</div>
                    </div>
                  </div>
                </v-flex>
              </v-layout>

              <v-layout row wrap col-2 class="taxes-documents">
                <v-flex sm6 xs12 v-if="form && form.document1_api" class="mt-2">
                  <div v-if="('url' in form.document1_api
                  && form.document1_api.url
                  && form.document1_api.url.indexOf('/pdf;') !== -1)
				          || ('file' in form.document1_api
				          && form.document1_api.file
				          && form.document1_api.file.indexOf('/pdf;') !== -1)">
                  <span style="color:darkred">
                    <v-icon style="color:darkred">insert_drive_file</v-icon> PDF
                  </span>
                  </div>
                  <div v-else>
                    <img v-if=" 'url' in form.document1_api || 'file' in form.document1_api"
                         :src=" 'url' in form.document1_api ? form.document1_api.url : form.document1_api.file"/>
                  </div>
                  <v-text-field label="Разворот паспорта" @click='PickDocument1' v-model='form.document1_api.name'
                                prepend-icon='attach_file' readonly></v-text-field>
                  <input type="file" style="display: none" ref="document1" accept="image/*, application/pdf"
                         @change="OnDocument1">
                </v-flex>
                <v-flex sm6 xs12 v-if="form && form.document2_api" class="mt-2">
                  <div v-if="('url' in form.document2_api
                  && form.document2_api.url
                  && form.document2_api.url.indexOf('/pdf;') !== -1)
				          || ('file' in form.document2_api
				          && form.document2_api.file
				          && form.document2_api.file.indexOf('/pdf;') !== -1)">
                  <span>
                    <v-icon>insert_drive_file</v-icon> PDF
                  </span>
                  </div>
                  <div v-else>
                    <img v-if=" 'url' in form.document2_api || 'file' in form.document2_api"
                         :src=" 'url' in form.document2_api ? form.document2_api.url : form.document2_api.file"/>
                  </div>
                  <v-text-field label="Страница регистрации" @click='PickDocument2' v-model='form.document2_api.name'
                                prepend-icon='attach_file' readonly></v-text-field>
                  <input type="file" style="display: none" ref="document2" accept="image/*,application/pdf"
                         @change="OnDocument2">
                </v-flex>
              </v-layout>

              <v-card-actions class="pa-0 justify-space-between">
                <v-btn to="/dashboard" class="primary--btn">
                  <v-icon>keyboard_arrow_left</v-icon>
                  Назад
                </v-btn>
                <v-btn
                  color="primary--btn"
                  type="submit"
                  :disabled="loading || (!!account && account.status !== 'redo')"
                >Отправить</v-btn>
              </v-card-actions>

            </form>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex lg4 xs12 v-show="form.comments.length > 0">
        <v-card-title class="primary">История анкеты и комментарии</v-card-title>
        <v-card>
          <div v-for="comment in form.comments" class="taxes-comments pa-2">
            <div class="taxes-time">{{comment.created_at}}</div>
            <div>
              {{comment.note}}
              <span v-show="comment.comment && comment.comment.length > 0">с комментарием:</span>
            </div>
            <div v-show="comment.comment && comment.comment.length > 0" v-html="comment.comment"
                 class="taxes-note"></div>
          </div>
        </v-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        form: {
          last_name: '',
          first_name: '',
          middle_name: '',
          birthday_on_local: '',
          document_series_and_number: '',
          inn: '',
          address: '',
          address_data: null,
          status: '',
          status_label: '',
          comments: [],
          document1_api: { file: '', url: '', name: '' },
          document2_api: { file: '', url: '', name: '' },
        },
        suggestions: [],
        suggestions_items: [],
      };
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      },
      user() {
        return this.$store.state.user;
      },
      account() {
        return this.$store.state.user.account;
      },
    },
    mounted() {
      this.$store.dispatch('GetProfile');
      this.LoadPassport();
    },
    methods: {
      LoadPassport() {
        const app = this;
        app.$store.getters.ax.post('taxes/api/ndfl/ndfl-info', { profile_id: app.user.profile_id })
          .then((res) => {
            if (res.data.form) {
              delete res.data.form.document1;
              delete res.data.form.document2;
              app.form = res.data.form;
            } else {
              app.LoadFromUser();
            }
          });
      },
      LoadFromUser() {
        this.form.last_name = this.user.last_name;
        this.form.first_name = this.user.first_name;
        this.form.middle_name = this.user.middle_name;
        this.form.birthday_on_local = this.user.birthday_on;
      },
      AutocompleteSearch(queryString, cb) {
        if (!queryString) return;
        const app = this;
        const info = { count: 20, query: queryString };
        const config = {
          headers: {
            Accept: 'application/json, text/javascript, */*; q=0.01',
            Authorization: 'Token 7a77efb8ab6dae6e380c7e438b85360185660f34',
            'Content-Type': 'application/json',
          },
        };

        axios.post('https://dadata.ru/api/v2/suggest/address', info, config)
          .then((res) => {
            app.suggestions = res.data.suggestions;
            cb(app.suggestions);
          });
      },
      AutocompleteSelect(item) {
        this.suggestions.forEach((sug) => {
          if (sug.value === item.value) {
            this.form.address_data = sug.data;
            document.getElementById('form-address').focus();
          }
        });
      },
      PickDocument1() {
        this.$refs.document1.click();
      },
      PickDocument2() {
        this.$refs.document2.click();
      },
      OnDocument1(e) {
        this.OnFilePicked(e, 1);
      },
      OnDocument2(e) {
        this.OnFilePicked(e, 2);
      },
      OnFilePicked(e, docNumber) {
        const app = this;
        const { files } = e.target;
        if (files[0] !== undefined) {
          const [file] = files;
          if (file.name.lastIndexOf('.') <= 0) {
            return;
          }
          if (docNumber === 1) {
            app.form.document1_api.name = file.name;
          } else {
            app.form.document2_api.name = file.name;
          }
          const fr = new FileReader();
          fr.readAsDataURL(file);
          fr.addEventListener('load', () => {
            if (docNumber === 1) {
              app.form.document1_api.file = null;
              app.form.document1_api.url = fr.result;
            } else {
              app.form.document2_api.file = null;
              app.form.document2_api.url = fr.result;
            }
            app.$forceUpdate();
          });
        } else {
          docNumber === 1
            ? app.app.form.document1_api = { file: '', url: '', name: '' }
            : app.app.form.document2_api = { file: '', url: '', name: '' };
        }
      },
      SavePassport() {
        const app = this;
        const data = app.form;
        data.profile_id = app.user.profile_id;

        app.$store.getters.axl.post('taxes/api/ndfl/save-passport', data)
          .then(() => {
            app.$store.dispatch('ShowInfo', 'Анкета отправлена!');
            app.$store.dispatch('GetProfile');
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
          });
      },
    },
  };
</script>

<style scoped>
  #address-suggestion {
    margin-top:  -10px;
    font-size:   13px;
    line-height: 16px;
  }
  #address-suggestion table td:first-child {
    padding-right: 15px;
    color:         gray;
  }
  #address-suggestion table td:last-child {
    color: #333;
  }
  .taxes-comments{
    border-bottom: 1px solid #fff;
  }
  .taxes-comments:nth-child(odd) {
    background-color: rgba(0,0,0,0.03);
  }
  .taxes-comments:nth-child(even) {
    background-color: rgba(0,0,0,0.07);
  }
  .taxes-time {
    font-size: 12px;
    color:     #888;
  }
  .taxes-note {
    font-size:   16px;
    color:       darkred;
    font-style:  italic;
    font-weight: bold;
  }
  .taxes-documents img {
    max-height: 150px;
    max-width:  100%;
  }
</style>
