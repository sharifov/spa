(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{aq5x:function(e,t,s){"use strict";s.r(t);var o={data:function(){return{user:{phone:"",password:"",passwordConfirm:""},type:"sms_profile",code:"",sentCode:!1,token:null,hidePw:!0,phoneRules:[function(e){return!e.length||17<=e.length||"Номер телефона заполнен не полностью"}],codeRules:[function(e){return!!e||"Укажите проверочный код"}],passwordRules:[function(e){return!!e||"Укажите пароль"}]}},computed:{comparePasswords:function(){return this.user.password===this.user.passwordConfirm||"Пароли не совпадают"},loading:function(){return this.$store.state.loading}},created:function(){this.Focus("remindPhone")},methods:{Focus:function(e){this.$nextTick(function(){document.getElementById(e).focus()})},Reset:function(){this.user={phone:"",password:"",passwordConfirm:""},this.sentCode=!1,this.code="",this.token=null,this.Focus("remindPhone")},Back:function(){this.Reset(),this.$router.push("/login")},SendCode:function(){var e=this;e.$store.getters.axl.post("api/token/get-sms",{phone:e.user.phone,type:e.type}).then(function(){e.sentCode=!0,e.Focus("remindCode")}).catch(function(t){e.$store.dispatch("HandleError",t),e.Focus("remindPhone")})},CheckCode:function(){var e=this;e.$store.getters.axl.post("api/token/check-sms",{phone:e.user.phone,type:e.type,code:e.code}).then(function(t){e.token=t.data.token,e.Focus("regLastName")}).catch(function(t){e.$store.dispatch("HandleError",t),e.Focus("regCode")})},Remind:function(){var e=this,t=e.user;t.token=e.token,e.$store.getters.axl.post("api/remind",t).then(function(t){e.Reset(),e.$store.dispatch("ShowInfo",t.data.msg),e.$router.push("/login")}).catch(function(t){e.$store.dispatch("HandleError",t)})}}},n=s("KHd+"),r=Object(n.a)(o,function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("v-container",{attrs:{fluid:"","fill-height":""}},[s("v-layout",{attrs:{row:"",wrap:"",max:""}},[s("v-flex",{attrs:{lg4:"","offset-lg4":"",md8:"","offset-md2":"",xs12:""}},[s("v-card",[s("v-card-title",{staticClass:"primary"},[s("v-icon",{on:{click:e.Back}},[e._v("arrow_back")]),e._v("\n          Сменить пароль\n        ")],1),e._v(" "),s("v-card-text",{staticClass:"pt-4"},[s("div",{directives:[{name:"show",rawName:"v-show",value:!e.sentCode&&!e.token,expression:"!sentCode && !token"}]},[s("input",{staticStyle:{display:"none"},attrs:{type:"text"}}),e._v(" "),s("v-text-field",{directives:[{name:"mask",rawName:"v-mask",value:"+7 (###) ###-####",expression:"'+7 (###) ###-####'"}],attrs:{type:"text",label:"Номер телефона",id:"remindPhone",placeholder:"",autofocus:"",required:"",rules:e.phoneRules},model:{value:e.user.phone,callback:function(t){e.$set(e.user,"phone",t)},expression:"user.phone"}}),e._v(" "),s("v-card-actions",{staticClass:"pa-0 justify-space-between"},[s("v-btn",{attrs:{color:"primary--btn",disabled:e.loading},on:{click:e.SendCode}},[e._v("Отправить код")])],1)],1),e._v(" "),s("h3",{directives:[{name:"show",rawName:"v-show",value:e.sentCode||e.token,expression:"sentCode || token"}]},[e._v(e._s(e.user.phone))]),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:e.sentCode&&!e.token,expression:"sentCode && !token"}]},[s("input",{staticStyle:{display:"none"},attrs:{type:"number"}}),e._v(" "),s("v-text-field",{directives:[{name:"mask",rawName:"v-mask",value:"#####",expression:"'#####'"}],attrs:{id:"remindCode",label:"Проверочный код",placeholder:"",required:"",rules:e.codeRules,type:"number"},model:{value:e.code,callback:function(t){e.code=t},expression:"code"}}),e._v(" "),s("v-card-actions",{staticClass:"pa-0 justify-space-between"},[s("v-btn",{attrs:{color:"primary--btn",disabled:e.loading},on:{click:e.CheckCode}},[e._v("Проверить код")])],1)],1),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:e.token,expression:"token"}]},[s("form",{attrs:{autocomplete:"off"},on:{submit:function(t){return t.preventDefault(),e.Remind(t)}}},[s("input",{staticStyle:{display:"none"},attrs:{type:"password"}}),e._v(" "),s("v-text-field",{attrs:{"append-icon":e.hidePw?"visibility_off":"visibility",counter:"",id:"remindPassword",label:"Пароль",placeholder:"",required:"",rules:e.passwordRules,type:e.hidePw?"password":"text"},on:{"click:append":function(t){e.hidePw=!e.hidePw}},model:{value:e.user.password,callback:function(t){e.$set(e.user,"password",t)},expression:"user.password"}}),e._v(" "),s("v-text-field",{attrs:{"append-icon":e.hidePw?"visibility_off":"visibility",counter:"",label:"Пароль",placeholder:"",required:"",rules:[e.comparePasswords],type:e.hidePw?"password":"text"},on:{"click:append":function(t){e.hidePw=!e.hidePw}},model:{value:e.user.passwordConfirm,callback:function(t){e.$set(e.user,"passwordConfirm",t)},expression:"user.passwordConfirm"}}),e._v(" "),s("v-card-actions",{staticClass:"pa-0 justify-space-between"},[s("v-btn",{attrs:{color:"primary--btn",type:"submit",disabled:e.loading}},[e._v("Задать пароль")])],1)],1)])])],1)],1)],1)],1)},[],!1,null,null,null);t.default=r.exports}}]);
//# sourceMappingURL=18.addb2c1274481721935e.js.map