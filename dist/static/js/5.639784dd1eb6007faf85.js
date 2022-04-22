(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{JdNj:function(n,t,e){var a=e("gGLi");"string"==typeof a&&(a=[[n.i,a,""]]),a.locals&&(n.exports=a.locals),(0,e("SZ7m").default)("3a7c3470",a,!0,{})},gGLi:function(n,t,e){(n.exports=e("I1BE")(!0)).push([n.i,"\n#address-suggestion[data-v-30d1e602] {\n  margin-top:  -10px;\n  font-size:   13px;\n  line-height: 16px;\n}\n#address-suggestion table td[data-v-30d1e602]:first-child {\n  padding-right: 15px;\n  color:         gray;\n}\n#address-suggestion table td[data-v-30d1e602]:last-child {\n  color: #333;\n}\n.taxes-comments[data-v-30d1e602]{\n  border-bottom: 1px solid #fff;\n}\n.taxes-comments[data-v-30d1e602]:nth-child(odd) {\n  background-color: rgba(0,0,0,0.03);\n}\n.taxes-comments[data-v-30d1e602]:nth-child(even) {\n  background-color: rgba(0,0,0,0.07);\n}\n.taxes-time[data-v-30d1e602] {\n  font-size: 12px;\n  color:     #888;\n}\n.taxes-note[data-v-30d1e602] {\n  font-size:   16px;\n  color:       darkred;\n  font-style:  italic;\n  font-weight: bold;\n}\n.taxes-documents img[data-v-30d1e602] {\n  max-height: 150px;\n  max-width:  100%;\n}\n","",{version:3,sources:["C:/wamp/www/iek/spa/src/components/C:/wamp/www/iek/spa/src/components/src/components/ProfilePassport.vue","C:/wamp/www/iek/spa/src/components/ProfilePassport.vue"],names:[],mappings:";AAwUA;EACA,mBAAA;EACA,kBAAA;EACA,kBAAA;CCCA;ADCA;EACA,oBAAA;EACA,oBAAA;CCCA;ADCA;EACA,YAAA;CCCA;ADCA;EACA,8BAAA;CCCA;ADCA;EACA,mCAAA;CCCA;ADCA;EACA,mCAAA;CCCA;ADCA;EACA,gBAAA;EACA,gBAAA;CCCA;ADCA;EACA,kBAAA;EACA,qBAAA;EACA,oBAAA;EACA,kBAAA;CCCA;ADCA;EACA,kBAAA;EACA,iBAAA;CCCA",file:"ProfilePassport.vue?vue&type=style&index=0&id=30d1e602&scoped=true&lang=css&",sourcesContent:['<template>\n  <v-container fluid fill-height pa-0>\n    <v-layout max row wrap col-2>\n\n      <v-flex xs12 lg8 :class="form.comments.length > 0 ? \'\' : \'offset-lg2 pa-0\'">\n        <v-card>\n          <v-card-title class="primary">Налоговая анкета</v-card-title>\n          <v-card-text>\n            <div class="mb-4">\n              Для заказа подарка необходимо заполнить все поля. Это нужно, чтобы мы заплатили за\n              Вас налог на доходы физических лиц в соответствии с законодательством Российской Федерации\n            </div>\n\n            <form @submit.prevent="SavePassport" autocomplete="off">\n              <v-layout row wrap col-2>\n                <v-flex sm6 xs12>\n                  <v-text-field type="text" label="Фамилия" v-model="form.last_name" placeholder=""\n                                required></v-text-field>\n                </v-flex>\n                <v-flex sm6 xs12>\n                  <v-text-field type="text" label="Имя" v-model="form.first_name" :value="form.first_name"\n                                placeholder="" required></v-text-field>\n                </v-flex>\n                <v-flex sm6 xs12>\n                  <v-text-field type="text" label="Отчество" v-model="form.middle_name" placeholder=""></v-text-field>\n                </v-flex>\n                <v-flex sm6 xs12>\n                  <v-text-field type="text" label="Дата рождения (дд.мм.гггг)" v-model="form.birthday_on_local"\n                                placeholder="14.01.1987" v-mask="\'##.##.####\'"></v-text-field>\n                </v-flex>\n                <v-flex sm6 xs12>\n                  <v-text-field type="text" label="Серия и номер паспорта" v-model="form.document_series_and_number"\n                                placeholder="1234 567890" v-mask="\'#### ######\'"></v-text-field>\n                </v-flex>\n                <v-flex sm6 xs12>\n                  <v-text-field type="text" label="Идентификационный номер налогоплательщика" v-model="form.inn"\n                                placeholder="ИНН" v-mask="\'############\'"></v-text-field>\n                </v-flex>\n              </v-layout>\n\n              <v-layout row wrap>\n                <v-flex xs12>\n                  <div class="v-input v-text-field theme--light">\n                    <div class="v-input__control">\n                      <div class="v-input__slot">\n                        <div class="v-text-field__slot">\n                          <label aria-hidden="true" class="v-label v-label--active theme--light"\n                                 style="left: 0px; right: auto; position: absolute;">Адрес места жительства в РФ</label>\n\n                          <el-autocomplete v-model="form.address" :fetch-suggestions="AutocompleteSearch"\n                                           @select="AutocompleteSelect" placeholder="Москва, Тверской б-р, д 9"\n                                           :trigger-on-focus="false" id="form-address"></el-autocomplete>\n                        </div>\n                      </div>\n                      <div class="v-text-field__details">\n                        <div class="v-messages theme--light">\n                          <div class="v-messages__wrapper"></div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </v-flex>\n\n                <v-flex xs12 mt-0 v-if="form && form.address_data" id="address-suggestion">\n                  <div class="adress-table">\n                    <div class="at-wrap">\n                      <div class="atw-title">Почтовый индекс</div>\n                      <div class="atw-data">{{form.address_data.postal_code}}</div>\n                    </div>\n                    <div class="at-wrap">\n                      <div class="atw-title">Код региона</div>\n                      <div class="atw-data">{{form.address_data.region_kladr_id}}</div>\n                    </div>\n                    <div class="at-wrap">\n                      <div class="atw-title">Регион</div>\n                      <div class="atw-data">{{form.address_data.region_with_type}}</div>\n                    </div>\n                    <div class="at-wrap">\n                      <div class="atw-title">Город</div>\n                      <div class="atw-data">{{form.address_data.city_with_type}}</div>\n                    </div>\n                    <div class="at-wrap">\n                      <div class="atw-title">Улица</div>\n                      <div class="atw-data">{{form.address_data.street_with_type}}</div>\n                    </div>\n                    <div class="at-wrap">\n                      <div class="atw-title">Номер дома</div>\n                      <div class="atw-data">{{form.address_data.house}}</div>\n                    </div>\n                    <div class="at-wrap">\n                      <div class="atw-title">Корпус</div>\n                      <div class="atw-data">{{form.address_data.block}}</div>\n                    </div>\n                    <div class="at-wrap">\n                      <div class="atw-title">Номер квартиры</div>\n                      <div class="atw-data">{{form.address_data.flat}}</div>\n                    </div>\n                  </div>\n                </v-flex>\n              </v-layout>\n\n              <v-layout row wrap col-2 class="taxes-documents">\n                <v-flex sm6 xs12 v-if="form && form.document1_api" class="mt-2">\n                  <div v-if="(\'url\' in form.document1_api\n                  && form.document1_api.url\n                  && form.document1_api.url.indexOf(\'/pdf;\') !== -1)\n\t\t\t\t          || (\'file\' in form.document1_api\n\t\t\t\t          && form.document1_api.file\n\t\t\t\t          && form.document1_api.file.indexOf(\'/pdf;\') !== -1)">\n                  <span style="color:darkred">\n                    <v-icon style="color:darkred">insert_drive_file</v-icon> PDF\n                  </span>\n                  </div>\n                  <div v-else>\n                    <img v-if=" \'url\' in form.document1_api || \'file\' in form.document1_api"\n                         :src=" \'url\' in form.document1_api ? form.document1_api.url : form.document1_api.file"/>\n                  </div>\n                  <v-text-field label="Разворот паспорта" @click=\'PickDocument1\' v-model=\'form.document1_api.name\'\n                                prepend-icon=\'attach_file\' readonly></v-text-field>\n                  <input type="file" style="display: none" ref="document1" accept="image/*, application/pdf"\n                         @change="OnDocument1">\n                </v-flex>\n                <v-flex sm6 xs12 v-if="form && form.document2_api" class="mt-2">\n                  <div v-if="(\'url\' in form.document2_api\n                  && form.document2_api.url\n                  && form.document2_api.url.indexOf(\'/pdf;\') !== -1)\n\t\t\t\t          || (\'file\' in form.document2_api\n\t\t\t\t          && form.document2_api.file\n\t\t\t\t          && form.document2_api.file.indexOf(\'/pdf;\') !== -1)">\n                  <span>\n                    <v-icon>insert_drive_file</v-icon> PDF\n                  </span>\n                  </div>\n                  <div v-else>\n                    <img v-if=" \'url\' in form.document2_api || \'file\' in form.document2_api"\n                         :src=" \'url\' in form.document2_api ? form.document2_api.url : form.document2_api.file"/>\n                  </div>\n                  <v-text-field label="Страница регистрации" @click=\'PickDocument2\' v-model=\'form.document2_api.name\'\n                                prepend-icon=\'attach_file\' readonly></v-text-field>\n                  <input type="file" style="display: none" ref="document2" accept="image/*,application/pdf"\n                         @change="OnDocument2">\n                </v-flex>\n              </v-layout>\n\n              <v-card-actions class="pa-0 justify-space-between">\n                <v-btn to="/dashboard" class="primary--btn">\n                  <v-icon>keyboard_arrow_left</v-icon>\n                  Назад\n                </v-btn>\n                <v-btn\n                  color="primary--btn"\n                  type="submit"\n                  :disabled="loading || (!!account && account.status !== \'redo\')"\n                >Отправить</v-btn>\n              </v-card-actions>\n\n            </form>\n          </v-card-text>\n        </v-card>\n      </v-flex>\n\n      <v-flex lg4 xs12 v-show="form.comments.length > 0">\n        <v-card-title class="primary">История анкеты и комментарии</v-card-title>\n        <v-card>\n          <div v-for="comment in form.comments" class="taxes-comments pa-2">\n            <div class="taxes-time">{{comment.created_at}}</div>\n            <div>\n              {{comment.note}}\n              <span v-show="comment.comment && comment.comment.length > 0">с комментарием:</span>\n            </div>\n            <div v-show="comment.comment && comment.comment.length > 0" v-html="comment.comment"\n                 class="taxes-note"></div>\n          </div>\n        </v-card>\n      </v-flex>\n\n    </v-layout>\n  </v-container>\n</template>\n\n<script>\n  import axios from \'axios\';\n\n  export default {\n    data() {\n      return {\n        form: {\n          last_name: \'\',\n          first_name: \'\',\n          middle_name: \'\',\n          birthday_on_local: \'\',\n          document_series_and_number: \'\',\n          inn: \'\',\n          address: \'\',\n          address_data: null,\n          status: \'\',\n          status_label: \'\',\n          comments: [],\n          document1_api: { file: \'\', url: \'\', name: \'\' },\n          document2_api: { file: \'\', url: \'\', name: \'\' },\n        },\n        suggestions: [],\n        suggestions_items: [],\n      };\n    },\n    computed: {\n      loading() {\n        return this.$store.state.loading;\n      },\n      user() {\n        return this.$store.state.user;\n      },\n      account() {\n        return this.$store.state.user.account;\n      },\n    },\n    mounted() {\n      this.$store.dispatch(\'GetProfile\');\n      this.LoadPassport();\n    },\n    methods: {\n      LoadPassport() {\n        const app = this;\n        app.$store.getters.ax.post(\'taxes/api/ndfl/ndfl-info\', { profile_id: app.user.profile_id })\n          .then((res) => {\n            if (res.data.form) {\n              delete res.data.form.document1;\n              delete res.data.form.document2;\n              app.form = res.data.form;\n            } else {\n              app.LoadFromUser();\n            }\n          });\n      },\n      LoadFromUser() {\n        this.form.last_name = this.user.last_name;\n        this.form.first_name = this.user.first_name;\n        this.form.middle_name = this.user.middle_name;\n        this.form.birthday_on_local = this.user.birthday_on;\n      },\n      AutocompleteSearch(queryString, cb) {\n        if (!queryString) return;\n        const app = this;\n        const info = { count: 20, query: queryString };\n        const config = {\n          headers: {\n            Accept: \'application/json, text/javascript, */*; q=0.01\',\n            Authorization: \'Token 7a77efb8ab6dae6e380c7e438b85360185660f34\',\n            \'Content-Type\': \'application/json\',\n          },\n        };\n\n        axios.post(\'https://dadata.ru/api/v2/suggest/address\', info, config)\n          .then((res) => {\n            app.suggestions = res.data.suggestions;\n            cb(app.suggestions);\n          });\n      },\n      AutocompleteSelect(item) {\n        this.suggestions.forEach((sug) => {\n          if (sug.value === item.value) {\n            this.form.address_data = sug.data;\n            document.getElementById(\'form-address\').focus();\n          }\n        });\n      },\n      PickDocument1() {\n        this.$refs.document1.click();\n      },\n      PickDocument2() {\n        this.$refs.document2.click();\n      },\n      OnDocument1(e) {\n        this.OnFilePicked(e, 1);\n      },\n      OnDocument2(e) {\n        this.OnFilePicked(e, 2);\n      },\n      OnFilePicked(e, docNumber) {\n        const app = this;\n        const { files } = e.target;\n        if (files[0] !== undefined) {\n          const [file] = files;\n          if (file.name.lastIndexOf(\'.\') <= 0) {\n            return;\n          }\n          if (docNumber === 1) {\n            app.form.document1_api.name = file.name;\n          } else {\n            app.form.document2_api.name = file.name;\n          }\n          const fr = new FileReader();\n          fr.readAsDataURL(file);\n          fr.addEventListener(\'load\', () => {\n            if (docNumber === 1) {\n              app.form.document1_api.file = null;\n              app.form.document1_api.url = fr.result;\n            } else {\n              app.form.document2_api.file = null;\n              app.form.document2_api.url = fr.result;\n            }\n            app.$forceUpdate();\n          });\n        } else {\n          docNumber === 1\n            ? app.app.form.document1_api = { file: \'\', url: \'\', name: \'\' }\n            : app.app.form.document2_api = { file: \'\', url: \'\', name: \'\' };\n        }\n      },\n      SavePassport() {\n        const app = this;\n        const data = app.form;\n        data.profile_id = app.user.profile_id;\n\n        app.$store.getters.axl.post(\'taxes/api/ndfl/save-passport\', data)\n          .then(() => {\n            app.$store.dispatch(\'ShowInfo\', \'Анкета отправлена!\');\n            app.$store.dispatch(\'GetProfile\');\n          })\n          .catch((error) => {\n            app.$store.dispatch(\'HandleError\', error);\n          });\n      },\n    },\n  };\n<\/script>\n\n<style scoped>\n  #address-suggestion {\n    margin-top:  -10px;\n    font-size:   13px;\n    line-height: 16px;\n  }\n  #address-suggestion table td:first-child {\n    padding-right: 15px;\n    color:         gray;\n  }\n  #address-suggestion table td:last-child {\n    color: #333;\n  }\n  .taxes-comments{\n    border-bottom: 1px solid #fff;\n  }\n  .taxes-comments:nth-child(odd) {\n    background-color: rgba(0,0,0,0.03);\n  }\n  .taxes-comments:nth-child(even) {\n    background-color: rgba(0,0,0,0.07);\n  }\n  .taxes-time {\n    font-size: 12px;\n    color:     #888;\n  }\n  .taxes-note {\n    font-size:   16px;\n    color:       darkred;\n    font-style:  italic;\n    font-weight: bold;\n  }\n  .taxes-documents img {\n    max-height: 150px;\n    max-width:  100%;\n  }\n</style>\n',"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n#address-suggestion {\n  margin-top:  -10px;\n  font-size:   13px;\n  line-height: 16px;\n}\n#address-suggestion table td:first-child {\n  padding-right: 15px;\n  color:         gray;\n}\n#address-suggestion table td:last-child {\n  color: #333;\n}\n.taxes-comments{\n  border-bottom: 1px solid #fff;\n}\n.taxes-comments:nth-child(odd) {\n  background-color: rgba(0,0,0,0.03);\n}\n.taxes-comments:nth-child(even) {\n  background-color: rgba(0,0,0,0.07);\n}\n.taxes-time {\n  font-size: 12px;\n  color:     #888;\n}\n.taxes-note {\n  font-size:   16px;\n  color:       darkred;\n  font-style:  italic;\n  font-weight: bold;\n}\n.taxes-documents img {\n  max-height: 150px;\n  max-width:  100%;\n}\n"],sourceRoot:""}])},"q/o2":function(n,t,e){"use strict";var a=e("JdNj");e.n(a).a},xKfC:function(n,t,e){"use strict";e.r(t);var a=e("vDqi"),s=e.n(a);var i={data:function(){return{form:{last_name:"",first_name:"",middle_name:"",birthday_on_local:"",document_series_and_number:"",inn:"",address:"",address_data:null,status:"",status_label:"",comments:[],document1_api:{file:"",url:"",name:""},document2_api:{file:"",url:"",name:""}},suggestions:[],suggestions_items:[]}},computed:{loading:function(){return this.$store.state.loading},user:function(){return this.$store.state.user},account:function(){return this.$store.state.user.account}},mounted:function(){this.$store.dispatch("GetProfile"),this.LoadPassport()},methods:{LoadPassport:function(){var n=this;n.$store.getters.ax.post("taxes/api/ndfl/ndfl-info",{profile_id:n.user.profile_id}).then(function(t){t.data.form?(delete t.data.form.document1,delete t.data.form.document2,n.form=t.data.form):n.LoadFromUser()})},LoadFromUser:function(){this.form.last_name=this.user.last_name,this.form.first_name=this.user.first_name,this.form.middle_name=this.user.middle_name,this.form.birthday_on_local=this.user.birthday_on},AutocompleteSearch:function(n,t){if(n){var e=this,a={count:20,query:n};s.a.post("https://dadata.ru/api/v2/suggest/address",a,{headers:{Accept:"application/json, text/javascript, */*; q=0.01",Authorization:"Token 7a77efb8ab6dae6e380c7e438b85360185660f34","Content-Type":"application/json"}}).then(function(n){e.suggestions=n.data.suggestions,t(e.suggestions)})}},AutocompleteSelect:function(n){var t=this;this.suggestions.forEach(function(e){e.value===n.value&&(t.form.address_data=e.data,document.getElementById("form-address").focus())})},PickDocument1:function(){this.$refs.document1.click()},PickDocument2:function(){this.$refs.document2.click()},OnDocument1:function(n){this.OnFilePicked(n,1)},OnDocument2:function(n){this.OnFilePicked(n,2)},OnFilePicked:function(n,t){var e=this,a=n.target.files;if(void 0!==a[0]){var s=function(n,t){return function(n){if(Array.isArray(n))return n}(n)||function(n,t){var e=[],a=!0,s=!1,i=void 0;try{for(var o,r=n[Symbol.iterator]();!(a=(o=r.next()).done)&&(e.push(o.value),!t||e.length!==t);a=!0);}catch(n){s=!0,i=n}finally{try{a||null==r.return||r.return()}finally{if(s)throw i}}return e}(n,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(a,1)[0];if(s.name.lastIndexOf(".")<=0)return;1===t?e.form.document1_api.name=s.name:e.form.document2_api.name=s.name;var i=new FileReader;i.readAsDataURL(s),i.addEventListener("load",function(){1===t?(e.form.document1_api.file=null,e.form.document1_api.url=i.result):(e.form.document2_api.file=null,e.form.document2_api.url=i.result),e.$forceUpdate()})}else 1===t?e.app.form.document1_api={file:"",url:"",name:""}:e.app.form.document2_api={file:"",url:"",name:""}},SavePassport:function(){var n=this,t=n.form;t.profile_id=n.user.profile_id,n.$store.getters.axl.post("taxes/api/ndfl/save-passport",t).then(function(){n.$store.dispatch("ShowInfo","Анкета отправлена!"),n.$store.dispatch("GetProfile")}).catch(function(t){n.$store.dispatch("HandleError",t)})}}},o=(e("q/o2"),e("KHd+")),r=Object(o.a)(i,function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("v-container",{attrs:{fluid:"","fill-height":"","pa-0":""}},[e("v-layout",{attrs:{max:"",row:"",wrap:"","col-2":""}},[e("v-flex",{class:0<n.form.comments.length?"":"offset-lg2 pa-0",attrs:{xs12:"",lg8:""}},[e("v-card",[e("v-card-title",{staticClass:"primary"},[n._v("Налоговая анкета")]),n._v(" "),e("v-card-text",[e("div",{staticClass:"mb-4"},[n._v("\n              Для заказа подарка необходимо заполнить все поля. Это нужно, чтобы мы заплатили за\n              Вас налог на доходы физических лиц в соответствии с законодательством Российской Федерации\n            ")]),n._v(" "),e("form",{attrs:{autocomplete:"off"},on:{submit:function(t){return t.preventDefault(),n.SavePassport(t)}}},[e("v-layout",{attrs:{row:"",wrap:"","col-2":""}},[e("v-flex",{attrs:{sm6:"",xs12:""}},[e("v-text-field",{attrs:{type:"text",label:"Фамилия",placeholder:"",required:""},model:{value:n.form.last_name,callback:function(t){n.$set(n.form,"last_name",t)},expression:"form.last_name"}})],1),n._v(" "),e("v-flex",{attrs:{sm6:"",xs12:""}},[e("v-text-field",{attrs:{type:"text",label:"Имя",value:n.form.first_name,placeholder:"",required:""},model:{value:n.form.first_name,callback:function(t){n.$set(n.form,"first_name",t)},expression:"form.first_name"}})],1),n._v(" "),e("v-flex",{attrs:{sm6:"",xs12:""}},[e("v-text-field",{attrs:{type:"text",label:"Отчество",placeholder:""},model:{value:n.form.middle_name,callback:function(t){n.$set(n.form,"middle_name",t)},expression:"form.middle_name"}})],1),n._v(" "),e("v-flex",{attrs:{sm6:"",xs12:""}},[e("v-text-field",{directives:[{name:"mask",rawName:"v-mask",value:"##.##.####",expression:"'##.##.####'"}],attrs:{type:"text",label:"Дата рождения (дд.мм.гггг)",placeholder:"14.01.1987"},model:{value:n.form.birthday_on_local,callback:function(t){n.$set(n.form,"birthday_on_local",t)},expression:"form.birthday_on_local"}})],1),n._v(" "),e("v-flex",{attrs:{sm6:"",xs12:""}},[e("v-text-field",{directives:[{name:"mask",rawName:"v-mask",value:"#### ######",expression:"'#### ######'"}],attrs:{type:"text",label:"Серия и номер паспорта",placeholder:"1234 567890"},model:{value:n.form.document_series_and_number,callback:function(t){n.$set(n.form,"document_series_and_number",t)},expression:"form.document_series_and_number"}})],1),n._v(" "),e("v-flex",{attrs:{sm6:"",xs12:""}},[e("v-text-field",{directives:[{name:"mask",rawName:"v-mask",value:"############",expression:"'############'"}],attrs:{type:"text",label:"Идентификационный номер налогоплательщика",placeholder:"ИНН"},model:{value:n.form.inn,callback:function(t){n.$set(n.form,"inn",t)},expression:"form.inn"}})],1)],1),n._v(" "),e("v-layout",{attrs:{row:"",wrap:""}},[e("v-flex",{attrs:{xs12:""}},[e("div",{staticClass:"v-input v-text-field theme--light"},[e("div",{staticClass:"v-input__control"},[e("div",{staticClass:"v-input__slot"},[e("div",{staticClass:"v-text-field__slot"},[e("label",{staticClass:"v-label v-label--active theme--light",staticStyle:{left:"0px",right:"auto",position:"absolute"},attrs:{"aria-hidden":"true"}},[n._v("Адрес места жительства в РФ")]),n._v(" "),e("el-autocomplete",{attrs:{"fetch-suggestions":n.AutocompleteSearch,placeholder:"Москва, Тверской б-р, д 9","trigger-on-focus":!1,id:"form-address"},on:{select:n.AutocompleteSelect},model:{value:n.form.address,callback:function(t){n.$set(n.form,"address",t)},expression:"form.address"}})],1)]),n._v(" "),e("div",{staticClass:"v-text-field__details"},[e("div",{staticClass:"v-messages theme--light"},[e("div",{staticClass:"v-messages__wrapper"})])])])])]),n._v(" "),n.form&&n.form.address_data?e("v-flex",{attrs:{xs12:"","mt-0":"",id:"address-suggestion"}},[e("div",{staticClass:"adress-table"},[e("div",{staticClass:"at-wrap"},[e("div",{staticClass:"atw-title"},[n._v("Почтовый индекс")]),n._v(" "),e("div",{staticClass:"atw-data"},[n._v(n._s(n.form.address_data.postal_code))])]),n._v(" "),e("div",{staticClass:"at-wrap"},[e("div",{staticClass:"atw-title"},[n._v("Код региона")]),n._v(" "),e("div",{staticClass:"atw-data"},[n._v(n._s(n.form.address_data.region_kladr_id))])]),n._v(" "),e("div",{staticClass:"at-wrap"},[e("div",{staticClass:"atw-title"},[n._v("Регион")]),n._v(" "),e("div",{staticClass:"atw-data"},[n._v(n._s(n.form.address_data.region_with_type))])]),n._v(" "),e("div",{staticClass:"at-wrap"},[e("div",{staticClass:"atw-title"},[n._v("Город")]),n._v(" "),e("div",{staticClass:"atw-data"},[n._v(n._s(n.form.address_data.city_with_type))])]),n._v(" "),e("div",{staticClass:"at-wrap"},[e("div",{staticClass:"atw-title"},[n._v("Улица")]),n._v(" "),e("div",{staticClass:"atw-data"},[n._v(n._s(n.form.address_data.street_with_type))])]),n._v(" "),e("div",{staticClass:"at-wrap"},[e("div",{staticClass:"atw-title"},[n._v("Номер дома")]),n._v(" "),e("div",{staticClass:"atw-data"},[n._v(n._s(n.form.address_data.house))])]),n._v(" "),e("div",{staticClass:"at-wrap"},[e("div",{staticClass:"atw-title"},[n._v("Корпус")]),n._v(" "),e("div",{staticClass:"atw-data"},[n._v(n._s(n.form.address_data.block))])]),n._v(" "),e("div",{staticClass:"at-wrap"},[e("div",{staticClass:"atw-title"},[n._v("Номер квартиры")]),n._v(" "),e("div",{staticClass:"atw-data"},[n._v(n._s(n.form.address_data.flat))])])])]):n._e()],1),n._v(" "),e("v-layout",{staticClass:"taxes-documents",attrs:{row:"",wrap:"","col-2":""}},[n.form&&n.form.document1_api?e("v-flex",{staticClass:"mt-2",attrs:{sm6:"",xs12:""}},["url"in n.form.document1_api&&n.form.document1_api.url&&-1!==n.form.document1_api.url.indexOf("/pdf;")||"file"in n.form.document1_api&&n.form.document1_api.file&&-1!==n.form.document1_api.file.indexOf("/pdf;")?e("div",[e("span",{staticStyle:{color:"darkred"}},[e("v-icon",{staticStyle:{color:"darkred"}},[n._v("insert_drive_file")]),n._v(" PDF\n                  ")],1)]):e("div",["url"in n.form.document1_api||"file"in n.form.document1_api?e("img",{attrs:{src:"url"in n.form.document1_api?n.form.document1_api.url:n.form.document1_api.file}}):n._e()]),n._v(" "),e("v-text-field",{attrs:{label:"Разворот паспорта","prepend-icon":"attach_file",readonly:""},on:{click:n.PickDocument1},model:{value:n.form.document1_api.name,callback:function(t){n.$set(n.form.document1_api,"name",t)},expression:"form.document1_api.name"}}),n._v(" "),e("input",{ref:"document1",staticStyle:{display:"none"},attrs:{type:"file",accept:"image/*, application/pdf"},on:{change:n.OnDocument1}})],1):n._e(),n._v(" "),n.form&&n.form.document2_api?e("v-flex",{staticClass:"mt-2",attrs:{sm6:"",xs12:""}},["url"in n.form.document2_api&&n.form.document2_api.url&&-1!==n.form.document2_api.url.indexOf("/pdf;")||"file"in n.form.document2_api&&n.form.document2_api.file&&-1!==n.form.document2_api.file.indexOf("/pdf;")?e("div",[e("span",[e("v-icon",[n._v("insert_drive_file")]),n._v(" PDF\n                  ")],1)]):e("div",["url"in n.form.document2_api||"file"in n.form.document2_api?e("img",{attrs:{src:"url"in n.form.document2_api?n.form.document2_api.url:n.form.document2_api.file}}):n._e()]),n._v(" "),e("v-text-field",{attrs:{label:"Страница регистрации","prepend-icon":"attach_file",readonly:""},on:{click:n.PickDocument2},model:{value:n.form.document2_api.name,callback:function(t){n.$set(n.form.document2_api,"name",t)},expression:"form.document2_api.name"}}),n._v(" "),e("input",{ref:"document2",staticStyle:{display:"none"},attrs:{type:"file",accept:"image/*,application/pdf"},on:{change:n.OnDocument2}})],1):n._e()],1),n._v(" "),e("v-card-actions",{staticClass:"pa-0 justify-space-between"},[e("v-btn",{staticClass:"primary--btn",attrs:{to:"/dashboard"}},[e("v-icon",[n._v("keyboard_arrow_left")]),n._v("\n                  Назад\n                ")],1),n._v(" "),e("v-btn",{attrs:{color:"primary--btn",type:"submit",disabled:n.loading||!!n.account&&"redo"!==n.account.status}},[n._v("Отправить")])],1)],1)])],1)],1),n._v(" "),e("v-flex",{directives:[{name:"show",rawName:"v-show",value:0<n.form.comments.length,expression:"form.comments.length > 0"}],attrs:{lg4:"",xs12:""}},[e("v-card-title",{staticClass:"primary"},[n._v("История анкеты и комментарии")]),n._v(" "),e("v-card",n._l(n.form.comments,function(t){return e("div",{staticClass:"taxes-comments pa-2"},[e("div",{staticClass:"taxes-time"},[n._v(n._s(t.created_at))]),n._v(" "),e("div",[n._v("\n              "+n._s(t.note)+"\n              "),e("span",{directives:[{name:"show",rawName:"v-show",value:t.comment&&0<t.comment.length,expression:"comment.comment && comment.comment.length > 0"}]},[n._v("с комментарием:")])]),n._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.comment&&0<t.comment.length,expression:"comment.comment && comment.comment.length > 0"}],staticClass:"taxes-note",domProps:{innerHTML:n._s(t.comment)}})])}),0)],1)],1)],1)},[],!1,null,"30d1e602",null);t.default=r.exports}}]);
//# sourceMappingURL=5.639784dd1eb6007faf85.js.map