<template>
  <v-container fluid fill-height pa-0>
    <v-layout max row wrap>

      <v-flex md4 sm6 xs12 v-for="card in cards" :key="card.id" class="px-3 mb-4">
        <v-card>
          <v-img :src="card.image" aspect-ratio="1.8"></v-img>
          <v-card-text class="pt-1">
            <h3>{{card.title}}</h3>
            <div v-html="card.description" class="card-description pb-0" data-scrollbar></div>
          </v-card-text>
          <v-card-actions class="pl-3 pr-3 justify-space-between">
            <v-select :items="card.nominals" v-model="card.nominal" label="Номинал" class="mr-3"
                      :id="'select-card-' + card.id"></v-select>
            <v-btn @click="Add(card)" class="primary">В корзину</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-dialog v-model="dialogAdded" width="500">
        <v-card>
          <v-card-text>
            <h2>Сертификат добавлен в корзину</h2>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary--btn" @click="dialogAdded = false;">Продолжить</v-btn>
            <v-btn color="primary--btn" @click="dialogAdded = false; GoToCart();">Оформить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-layout>
  </v-container>
</template>

<script>
  import Scrollbar from 'smooth-scrollbar';

  export default {
    data() {
      return {
        dialogAdded: false,
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      },
      cards() {
        return this.$store.state.eps.cards;
      },
    },
    mounted() {
      this.GetCards();
      Scrollbar.initAll();
    },
    methods: {
      GetCards() {
        const app = this;
        app.$store.getters.ax.post('profiles/api/cards/list', { group_id: app.user.group_id })
          .then((response) => {
            app.$store.commit('eps/SetCards', response.data.cards);
            Scrollbar.initAll();
          });
      },
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
    },
  };
</script>

<style scoped>
  #app .card-description {
    position:    relative;
    height:      120px;
    text-align:  justify;
    overflow-y:  scroll;
    font-size:   13px;
    line-height: 15px;
  }
  #app h3 {
    margin-bottom: 5px;
    text-align:    center;
  }
</style>
