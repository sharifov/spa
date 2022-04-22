<template>
  <v-container fluid pa-0 mb-5>
    <v-layout max>
      <v-flex xs12>
        <v-card-title v-if="!paymentFinish && !!paymentsInfo && paymentsInfo.length"  class="px-0">
          Перевод на мобильный телефон или банковскую карту:
        </v-card-title>

        <template v-if="paymentFinish">
          <v-card-title class="px-0">Перевод успешно отправлен</v-card-title>
          <div>Ваш платеж принят в работу. Платеж будет обработан в ближайшее время.</div>
          <v-btn class="iek-btn auto-width" to="/profile-transactions">Все платежи</v-btn>
        </template>

      </v-flex>
    </v-layout>

    <v-layout max column wrap class="payments">
      <div class="payments--types">
        <v-layout class="paymentsMemu pt-0" v-if="user" row wrap>
          <v-flex
            ma-2
            v-for="item in paymentsInfo"
            :key="item.id"
            @click="handleChangeMethod(item)"
            :class="[{paymentsMemuActiveItem: item.type == current.type, paymentsMemuItem: true}]">
            <div :class="`ico-${item.type} mode`">
              <span class="mode-title">{{ item.title }}</span>
            </div>
          </v-flex>
        </v-layout>
      </div>

      <div class="payments--number">
        <v-form
            autocomplete="off"
            ref="form"
            validation
            v-model="form.valid"
            class="prizes-form"
        >
<!--          <v-text-field-->

<!--              type="num"-->
<!--              :label="current.title"-->
<!--              v-model="form.value"-->
<!--              :rules="[rules.required, rules.purse]"-->
<!--          ></v-text-field>-->
          <v-text-field
            v-if="current.type === 'rbs'"
            type="text"
            :label="current.title"
            v-model="form.value"
            :rules="[rules.required, rules.number]"
          ></v-text-field>
          <v-text-field
            v-if="current.type === 'phone' || current.type === 'qiwi'"
            type="text"
            :label="current.title"
            v-model="form.value"
            v-mask="'+7 (###) ###-####'"
            :rules="[rules.required, rules.phoneLength]"
          ></v-text-field>
          <v-text-field
            v-if="current.type === 'card'"
            type="text"
            :label="current.title"
            v-model="form.value"
            v-mask="'#### #### #### ####'"
            :rules="[rules.required, rules.cardLength]"
          ></v-text-field>
          <v-text-field
            type="number" label="Сумма перевода" id="amount"
            v-model="form.amount"
            @input="GetTaxes"
            min="1"
            :rules="[rules.required, rules.amount, current.type === 'card' && rules.groupMinAmount]"
          ></v-text-field>
        </v-form>

        <template v-if="hasTaxes && taxes.sum > 0 && form && form.amount > 0">
          <div v-if="!!userGroup && !!+userGroup.certificates_price_coefficient">
            Спишется {{ Math.round(taxes.sum * userGroup.certificates_price_coefficient)}}
            {{ DeclOfNum(Math.round(taxes.sum * userGroup.certificates_price_coefficient)) }}
          </div>
          <div v-else>
            Спишется {{ taxes.sum}}
            {{ DeclOfNum(taxes.sum) }}
          </div>
        </template>

        <div class="payment_limits" v-if="current.type === 'phone'">
          <p>Ограничение суммы единоразового вывода от 1 до 5000 рублей;</p>
          <p>Ограничение суммы на вывод 25000 рублей ежемесячно;</p>
          <p>Перевод на мобильные номера осуществляется через кошельки Qiwi (встроенная механика сервиса «Qiwi», при которой вывод на мобильные номера нужно осуществить из своего кошелька Qiwi, при необходимости зарегистрировав его).</p>
        </div>
        <div class="payment_limits" v-if="current.type === 'card'">
          <p>Минимальная сумма вывода = 1000руб. Единоразовая максимальная сумма вывода 14500руб.</p>
        </div>

        <v-btn
          :disabled="!form.valid"
          @click="paymentSubmit"
          class="iek-btn">
          Перевести
        </v-btn>
        <span v-if="current.type === 'card'" class="pl-4">Пополнения на карты категории Prepaid - не осуществляются.</span>
      </div>
    </v-layout>

    <!--<v-layout max row wrap v-if="paymentFinish">-->
      <!--<v-flex xs12 lg6 offset-lg3 px-3 mb-4>-->
        <!--<v-card>-->
          <!--<v-card-title class="primary body-1">Перевод успешно отправлен</v-card-title>-->
          <!--<v-card-text>Ваш платеж принят в работу. Платеж будет обработан в ближайшее время.</v-card-text>-->
          <!--<v-card-actions class="pa-3">-->
            <!--<v-spacer></v-spacer>-->
            <!--<v-btn class="mt-3" @click="paymentFinish = !paymentFinish">Завершить</v-btn>-->
            <!--<v-btn class="primary mt-3" to="/purse">Все платежи</v-btn>-->
          <!--</v-card-actions>-->
        <!--</v-card>-->
      <!--</v-flex>-->
    <!--</v-layout>-->

  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        current: {},
        settings: [],
        paymentFinish: false,
        form: {
          value: '',
          amount: '',
          valid: true,
        },
        taxes: { sum: '', string: '' },
        patternNumber: /^\d{1,10}$/,
        patternPurse: /^\d{12,15}$/,
        rules: {
          required: value => !!value || 'Поле должно быть заполнено',
          phoneLength: value => (value && value.length >= 17) || 'Номер телефона заполнен не полностью',
          cardLength: value => (value && value.length >= 19) || 'Номер карты заполнен не полностью',
          number: value => this.patternNumber.test(value) || 'Поле должно содержать только целые числа',
          amount: value => (!!+value && this.patternNumber.test(value)) || 'Сумма должна быть больше нуля',
          groupMinAmount: value => (+value >= this.bankThreshold) || `Сумма должна быть больше или равна ${this.bankThreshold}`,
          purse: value => this.patternPurse.test(value) || 'Поле должно содержать только целые числа',
        },
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      },
      userGroup() {
        const tempUser = !!this.user;
        return tempUser ? this.$store.state.user.group : null;
      },
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },
      paymentsInfo() {
        return this.$store.state.paymentsInfo.methods;
      },
      hasTaxes() {
        return this.$store.state.settings.taxes === true;
      },
      bankThreshold() {
        return this.$store.state.settings.payments_settings.bank_threshold;
      },
    },
    methods: {
      GetPaymentsSettings() {
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
      handleChangeMethod(item) {
        this.current = item;
        this.ResetForm();
      },
      GetTaxes(amount) {
        // eslint-disable-next-line
        if (!!+amount) {
          const app = this;
          const params = {
            profile_id: app.user.profile_id,
            amount,
            type: app.current.type,
          };

          this.$store.getters.ax.post('payments/api-v3/payments/calculate', params)
            .then((response) => {
              app.taxes = {
                sum: parseInt(response.data.amount, 10) + parseInt(response.data.commission, 10),
              };
            })
            .catch(() => {
              app.taxes = { sum: '' };
            });
        }
      },
      paymentSubmit() {
        const app = this;
        if (app.form.valid) {
          const payment = {
            profile_id: app.user.profile_id,
            type: app.current.type,
            amount: app.form.amount,
            parameters: {
              phone_mobile: app.form.value,
            },
          };
          app.$store.getters.axl.post('queue/api/payments/create', payment)
            .then(() => {
              app.ResetForm();
              this.$store.dispatch('GetProfile');

              app.paymentFinish = true;
              setTimeout(() => {
                this.$store.dispatch('GetProfile');
              }, 61000);
            })
            .catch((error) => {
              app.$store.dispatch('HandleError', error);
            });
        }
      },
      ResetForm() {
        this.$refs.form.reset();
        this.form.amount = '';
        this.form.value = '';
        this.taxes = { sum: '', string: '' };
      },
      DeclOfNum(number) {
        const cases = [2, 0, 1, 1, 1, 2];
        const num = +number;
        const titles = ['балл', 'балла', 'баллов'];

        return titles[(num % 100 > 4 && num % 100 < 20) ? 2 : cases[(num % 10 < 5) ? num % 10 : 5]];
      },
    },
    mounted() {
      // eslint-disable-next-line
      this.current = this.paymentsInfo[0];
    },
  };
</script>
