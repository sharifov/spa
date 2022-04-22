<template>

  <v-container fluid pa-0 style="height: 100%">

    <v-layout max row wrap>
      <v-flex xs12 class="title-page">
        <div class="title-background"></div>
        Призы
      </v-flex>
    </v-layout>

    <v-layout max row wrap>
      <v-flex xs12 v-if="hasTaxes && !userHasPassport" class="cart-attention mr-3">
        Для заказа призов необходимо заполнить Анкету НДФЛ и дождаться подтверждения анкеты модератором сайта. <br/>Срок проверки анкеты НДФЛ до 5 рабочих дней.
        <v-btn class="iek-btn auto-width" to="/passport"><i class="material-icons mr-1">assignment</i> Заполнить</v-btn>
      </v-flex>
    </v-layout>

    <Payments v-show="hasPayments && hasTaxes && userHasPassport"/>

    <v-layout max row wrap class="eps-list" v-show="showCertificates">
      <v-flex v-for="card in cards" :key="card.id" class="eps-list--card" lg4 md4 sm6 xs12>
        <v-card class="elevation-0">
          <v-img
            :src="card.image"
            aspect-ratio="1.8"
            @click="GetDetails(card.type)"
            class="eps-list--image"
          />

          <v-card-actions class="pa-0">

            <v-select
              :items="card.nominals_text"
              :id="`select-card-${card.id}`"
              v-model="card.nominal"
              label="Номинал"
              class="mr-3"
              item-text="nominal"
              item-value="price"
              single-line
              :hint="selectHints[card.id]"
              persistent-hint
              @change="ChangeSelectHint(card)"
            />

            <v-text-field
              class="mr-3 eps-list--card-number"
              type="number"
              min="1"
              max="100"
              placeholder=""
              required
              v-model="card.qty"
              @click="ChangeQty($event, card)"
              @keyup="ChangeQty($event, card)"
            />


            <v-btn @click="Add(card)" :disabled="!card.nominal" icon class="eps-list--add">
              <i class="material-icons">shopping_cart</i>
            </v-btn>

            <v-btn @click="card.nominal = ''; card.qty = '1'" v-show="card.nominal" icon class="eps-list--delete">
              <i class="material-icons">clear</i>
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
    import Payments from './PrizesPayments.vue';

    export default {
      components: {
        Payments,
      },
      props: ['type'],
      data() {
        return {
          dialogAdded: false,
          cards: [],
          selectHints: [],
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
        card() {
          return this.$store.state.eps.card;
        },
        cart() {
          return this.$store.state.eps.cart;
        },
        hasPayments() {
          return this.$store.state.settings.payments === true;
        },
        hasTaxes() {
          return this.$store.state.settings.taxes === true;
        },
        userHasPassport() {
          return this.user && this.user.account && this.user.account.status === 'approved';
        },
        showCertificates() {
          return this.hasTaxes
            && this.userHasPassport
            && !!this.userGroup
            && this.userGroup.certificates_show;
        },
      },
      methods: {
        Add(card) {
          const app = this;
          if (card.nominal === undefined || !card.nominal) {
            document.getElementById(`select-card-${card.id}`).click();
            return;
          }
          app.$store.dispatch('eps/AddToCart', card);
          app.dialogAdded = true;
          card.nominal = null;
          card.qty = 1;
        },
        GoToCart() {
          this.$router.push('/eps-cart');
        },
        ChangeQty(e, card) {
          if (+e.target.value > 0) {
            card.qty = +e.target.value;
          } else {
            card.qty = 1;
          }

          this.ChangeSelectHint(card);
        },
        GetDetails(type) {
          this.$router.push(`eps/${type}`);
        },
        ChangeSelectHint(card) {
          if (card.nominal && card.qty) {
            if (!!this.userGroup && !!+this.userGroup.certificates_price_coefficient) {
              // eslint-disable-next-line
              this.selectHints[card.id] = `Спишется ${String(card.nominal * card.qty * this.userGroup.certificates_price_coefficient)} баллов`;
            } else {
              this.selectHints[card.id] = `Спишется ${String(card.nominal * card.qty)} баллов`;
            }
          } else {
            this.selectHints[card.id] = '';
          }
        },
      },
      mounted() {
        const app = this;

        app.$store.dispatch('eps/GetCard', app.type);
        app.$store.getters.axl.post('profiles/api/cards/list', { group_id: app.user.group_id })
          .then((response) => {
            app.$store.commit('eps/SetCards', response.data.cards);
            app.$store.dispatch('eps/GetCard', app.type);
            // eslint-disable-next-line
            app.cards = this.$store.state.eps.cards.map(item => {
              return {
                ...item,
                qty: '1',
              };
            });
          });
      },
    };
</script>
