<template>
  <v-container fluid pa-0 style="height: 100%">
    <v-layout max row wrap>
      <v-flex xs12 class="title-page">
        <div class="title-background"></div>
        Корзина
      </v-flex>
    </v-layout>

    <v-layout max row wrap class="order-page">
      <v-flex class="md10 offset-md1 xs12">
        <div v-if="!userHasPassport" class="cart-attention">
          <span>Для заказа призов необходимо заполнить Анкету НДФЛ и дождаться подтверждения анкеты модератором сайта. <br/>Срок проверки анкеты НДФЛ до 5 рабочих дней.</span>
          <v-btn class="iek-btn" to="/passport"><i class="material-icons mr-1">assignment</i>Заполнить</v-btn>
        </div>

        <v-layout class="order-page--head">
          <v-flex>Заказ №</v-flex>
          <v-flex md1 xs2 class="center">Кол-во</v-flex>
          <v-flex md1 xs2 class="center">Цена</v-flex>
          <v-flex xs1></v-flex>
        </v-layout>

        <div v-for="(card, cardType) in cart" :key="cardType">
          <v-layout
                  v-for="(qty, nominal) in card"
                  v-if="nominal !== 'card'"
                  :key="nominal"
                  class="order-page--block"
          >

            <v-flex class="order-page--name">
              {{GetCardTitle(nominal, cardType)}}
            </v-flex>

            <v-flex md1 xs2>
              <v-text-field
                      class="order-page--qty"
                      type="number"
                      required
                      v-model="cart[cardType][nominal]"
                      @click="ChangeQty(cardType, nominal, cart[cardType][nominal])"
                      @keyup="ChangeQty(cardType, nominal, cart[cardType][nominal])"
              ></v-text-field>
            </v-flex>

            <v-flex md1 xs2 class="order-page--total" v-if="!!userGroup && !!+userGroup.certificates_price_coefficient">
              {{nominal * qty * userGroup.certificates_price_coefficient}}
            </v-flex>
            <v-flex md1 xs2 class="order-page--total" v-else>
              {{nominal * qty}}
            </v-flex>

            <v-flex xs1 class="text-center">
              <v-icon
                      color="gray"
                      class="material-icons size-30 remove-card"
                      @click="RemoveCard(cardType, nominal)"
              >cancel</v-icon>
            </v-flex>
          </v-layout>
        </div>

        <v-layout v-if="cartLength" row wrap class="order-page--footer">
          <v-flex>Итоговая сумма заказа:</v-flex>
          <v-flex sm1 class="hidden-xs"></v-flex>
          <v-flex xs1 class="center" v-if="!!userGroup && !!+userGroup.certificates_price_coefficient">
            {{cartSummary * userGroup.certificates_price_coefficient}}
          </v-flex>
          <v-flex xs1 class="center" v-else>{{cartSummary}}</v-flex>
          <v-flex sm1></v-flex>
        </v-layout>

        <v-layout pa-3 v-else>
          <div class="size-16">Ваша корзина пуста</div>
        </v-layout>
      </v-flex>

      <v-flex class="md5 offset-md1 xs12" v-if="cartLength">
        <div v-if="userHasPassport">
          <form @submit.prevent="SendOrder" autocomplete="off">
            <v-text-field
                    type="text"
                    label="E-mail для получения заказа"
                    v-model="form.delivery_email"
                    required
                    prepend-icon="mail_outline"
                    color="#ffcc02"
            ></v-text-field>

            <div v-if="hasPlastic" class="v-input v-text-field theme--light">
              <div class="v-input__control">
                <div class="v-input__slot">
                  <div class="v-text-field__slot">
                    <label aria-hidden="true" class="v-label v-label--active theme--light"
                           style="left: 0px; right: auto; position: absolute;">Адрес доставки</label>
                    <el-autocomplete v-model="form.delivery_address" :fetch-suggestions="AutocompleteSearch"
                                     @select="AutocompleteSelect" placeholder="Москва, Тверской б-р, д 9"
                                     :trigger-on-focus="false" id="delivery-address" required></el-autocomplete>
                  </div>
                </div>
                <div class="v-text-field__details">
                  <div class="v-messages theme--light">
                    <div class="v-messages__wrapper"></div>
                  </div>
                </div>
              </div>
            </div>

            <v-layout row>
              <v-flex>
                <v-checkbox
                        color="#ffcc02"
                        class="rules-checkbox"
                        id="cart-allow-cancel"
                        v-model="form.is_allow_cancel"
                >
                  <template v-slot:label>
                    <small>
                      Я уверен в своем заказе и хочу сразу отправить его на обработку. <br>
                      Я понимаю, что это будет быстрее, но его нельзя будет отменить.
                    </small>
                  </template>
                </v-checkbox>
              </v-flex>
            </v-layout>

            <v-btn class="iek-btn" type="submit" :disabled="loading">Заказать</v-btn>
          </form>
        </div>
      </v-flex>

      <v-dialog v-model="dialogOrdered" width="500">
        <v-card>
          <v-card-text>
            <h2>Заказ оформлен!</h2>
            <div>В течение 5 дней сертификаты придут на указанную почту</div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="iek-btn ma-0" @click="GoToOrders">Продолжить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        dialogOrdered: false,
        form: {
          delivery_email: this.$store.state.user.email,
          delivery_address: '',
          is_allow_cancel: false,
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
      userHasPassport() {
        return this.user && this.user.account && this.user.account.status === 'approved';
      },
      loading() {
        return this.$store.state.loading;
      },
      cart() {
        return this.$store.state.eps.cart;
      },
      cartSummary() {
        return this.$store.state.eps.cartSummary;
      },
      cartLength() {
        return this.$store.state.eps.cartLength;
      },
      cards() {
        return this.$store.state.eps.cards;
      },
      hasPlastic() {
        let hasPlastic = false;
        Object.keys(this.cart).forEach((cardType) => {
          for (let i = 0; i < this.cards.length; i += 1) {
            if (this.cards[i].type === cardType && this.cards[i].is_plastic) {
              hasPlastic = true;
            }
          }
        });
        return hasPlastic;
      },
    },
    mounted() {
      this.dialogOrdered = false;
      this.form.is_allow_cancel = false;
      this.form.delivery_email = this.$store.state.user.email;
      this.form.delivery_address = '';
      this.$store.dispatch('GetProfile');
      // this.$store.dispatch('eps/GetCards');
      this.GetCards();
    },
    methods: {
      GetCards() {
        const app = this;
        app.$store.getters.ax.post('profiles/api/cards/list', { group_id: app.user.group_id })
          .then((response) => {
            app.$store.commit('eps/SetCards', response.data.cards);
          });
      },
      GetCard(cardType) {
        for (let i = 0; i < this.cards.length; i += 1) {
          if (this.cards[i].type === cardType) {
            return this.cards[i];
          }
        }
        return null;
      },
      GetCardTitle(price, cardType) {
        const card = this.GetCard(cardType);
        let text = card.title;
        for (let i = 0; i < card.nominals_text.length; i += 1) {
          if (card.nominals_text[i].price === parseInt(price, 10)) {
            text = `${text} ${card.nominals_text[i].nominal}`;
          }
        }
        return text;
      },
      GetCardHint(price, cardType) {
        const card = this.GetCard(cardType);
        for (let i = 0; i < card.nominals_text.length; i += 1) {
          if (card.nominals_text[i].price === parseInt(price, 10)) {
            return `${card.nominals_text[i].text}`;
          }
        }
        return '';
      },
      ChangeQty(cardType, nominal, qty) {
        if (qty <= 0) {
          this.RemoveCard(cardType, nominal);
          return;
        }
        this.$store.dispatch('eps/ChangeQty', { cardType, nominal, qty });
      },
      RemoveCard(cardType, nominal) {
        this.$store.dispatch('eps/RemoveCard', { cardType, nominal });
      },
      SetActionIdForOrders(order) {
        const app = this;
        const info = {
          orderId: order.ms_order_id,
          profileId: order.profile_id,
        };

        app.$store.getters.axl.post('profiles/api/cards/set-action-id-for-orders', info)
          .then(() => {
            console.log('Успех');
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
          });
      },

      SendOrder() {
        const app = this;
        const formData = app.form;
        formData.profile_id = app.user.profile_id;
        formData.items = app.$store.getters['eps/cartItems'];

        app.$store.getters.axl.post('catalog/api-v3/orders/create', formData)
          .then((response) => {
            app.dialogOrdered = true;
            app.$store.dispatch('GetProfile', app.user.profile_id);
            app.$store.dispatch('eps/GetOrders', app.user.profile_id);
            app.$store.dispatch('eps/ClearCart');
            app.SetActionIdForOrders(response.data.order);
            console.log(response.data.order);
          })
          .catch((error) => {
            app.$store.dispatch('HandleError', error);
          });
      },
      GoToOrders() {
        this.$router.push('/eps-orders');
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
          })
          .catch((err) => {
            console.log(err);
          });
      },
      AutocompleteSelect(item) {
        this.suggestions.forEach((sug) => {
          if (sug.value === item.value) {
            this.form.address_data = sug.data;
            document.getElementById('delivery-address').focus();
          }
        });
      },
    },
  };
</script>
