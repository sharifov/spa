<template>
  <v-container fluid pa-0 style="height: 100%">
    <v-layout v-if="card && card.title" max row wrap>
      <v-flex xs12 class="title-page">
        <div class="title-background"></div>
        {{card.title}}
      </v-flex>
    </v-layout>

    <v-layout v-if="card" max row wrap class="card-page">
      <v-flex xs12 md10 offset-md1>
        <div class="card-page--about">
          <img :src="card.image" class="card-page--image">
          <div v-html="card.description" class="card-page--text"></div>
        </div>

        <!--<v-btn @click="Return" class="iek-btn">-->
          <!--<v-icon>keyboard_arrow_left</v-icon>-->
          <!--<span>Назад</span>-->
        <!--</v-btn>-->

        <div class="card-page--add-card">
            <v-select
                :items="card.nominals_text"
                v-model="card.nominal"
                label="Номинал"
                class="mr-3 nominal"
                item-text="nominal"
                item-value="price"
                :id="'select-card-' + card.id"
                :hint="selectHint"
                persistent-hint
                @change="ChangeSelectHint"
            ></v-select>

            <v-text-field
                placeholder="Кол-во"
                class="mr-3 quantity"
                type="number"
                min="1"
                max="100"
                required
                v-model="card.qty"
                @click="ChangeQty($event, card)"
                @keyup="ChangeQty($event, card)"
            ></v-text-field>


            <v-btn @click="Add(card)" class="iek-btn">
              <span>В корзину</span>
              <i class="material-icons size-18 ml-1">shopping_cart</i>
            </v-btn>

        </div>

        <v-btn @click="Return" class="iek-btn">
          <v-icon>keyboard_arrow_left</v-icon>
          <span>Назад</span>
        </v-btn>
      </v-flex>

      <v-dialog v-model="dialogAdded" width="500">
        <v-card>
          <v-card-text>
            <h2>Сертификат добавлен в корзину</h2>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary--btn" @click="dialogAdded = false;">Продолжить</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary--btn" @click="dialogAdded = false; GoToCart();">Оформить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['type'],
    data() {
      return {
        dialogAdded: false,
        qty: '',
        selectHint: '',
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
      },
      GoToCart() {
        this.$router.push('/eps-cart');
      },
      ChangeQty(e) {
        if (+e.target.value > 0) {
          this.qty = +e.target.value;
        } else {
          this.qty = 1;
        }

        this.ChangeSelectHint();
      },
      ChangeSelectHint() {
        if (this.card.nominal && this.card.qty) {
          if (!!this.userGroup && !!+this.userGroup.certificates_price_coefficient) {
            // eslint-disable-next-line
            this.selectHint = `Спишется ${String(this.card.nominal * this.card.qty * this.userGroup.certificates_price_coefficient)} баллов`;
          } else {
            this.selectHint = `Спишется ${String(this.card.nominal * this.card.qty)} баллов`;
          }
        } else {
          this.selectHint = '';
        }
      },
      Return() {
        this.$router.push('/eps');
      },
    },
    mounted() {
      const app = this;
      app.$store.dispatch('eps/GetCard', this.type);
      app.$store.getters.ax.post('profiles/api/cards/list', { group_id: app.user.group_id })
        .then((response) => {
          app.$store.commit('eps/SetCards', response.data.cards);
          app.$store.dispatch('eps/GetCard', this.type);
        })
        .catch((error) => {
          app.$store.dispatch('HandleError', error);
        });
    },
  };
</script>
