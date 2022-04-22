<template>
  <v-container fluid pa-0 style="height: 100%">
    <v-layout max row wrap >
      <v-flex xs12 class="title-page">
        <div class="title-background"></div>
        Заказы
      </v-flex>
    </v-layout>

    <v-tabs fixed-tabs slider-color="#fbcb30">
      <v-tab>Сертификаты</v-tab>
      <v-tab-item>
        <v-layout max row wrap class="orders">
          <v-flex md10 offset-md1 xs12>
            <v-layout v-for="order in orders" :key="order.ms_order_id"  class="orders--block">
              <v-flex>
                <v-layout class="orders--head">
                  <v-flex>Заказ №{{order.ms_order_id}}</v-flex>
                  <v-flex md1 xs2 class="center">Кол-во</v-flex>
                  <v-flex md1 xs2 class="center">Цена(руб)</v-flex>
                </v-layout>

                <div v-if="order.delivery_address && order.delivery_address.length">
                  <b>Адрес доставки</b>: {{order.delivery_address}}
                </div>

                <div v-for="item in order.items">
                  <v-layout row wrap class="orders--wrap">
                    <v-flex>
                      <span>{{item.card_title}} {{item.nominal}}</span>
                    </v-flex>

                    <v-flex md1 xs2>
                      <div class="sert-title center">{{item.qty}}</div>
                    </v-flex>

                    <v-flex md1 xs2>
                      <div class="sert-title center">{{item.nominal*order.coeff}}</div>
                    </v-flex>
                  </v-layout>

                  <v-layout v-if="!!order && !!order.items && order.items.length > 1" row wrap class="orders--footer">
                    <v-flex>Итого:</v-flex>
                    <v-flex md1 xs2 class="center">{{ item.qty * item.nominal * order.coeff }}</v-flex>
                  </v-layout>
                  <v-layout v-else row wrap class="orders--footer">
                    <v-flex>Итоговая сумма заказа:</v-flex>
                    <v-flex md1 xs2 class="center">{{ order.amount }}</v-flex>
                  </v-layout>

                  <v-layout class="justify-end">
                    <v-flex lg6 md8 sm12 xs12 class="justify-end display-flex download_cont">
                      <template v-if="item.cards && item.cards.length === 1">
                        <v-btn class="iek-btn ma-0" @click="DownloadCard(order, item.cards[0])">
                          Получить сертификат
                        </v-btn>
                      </template>

                      <template v-else-if="item.cards && item.cards.length > 1">
                        <v-btn class="iek-btn ma-0" @click="DownloadCards(order, item.cards)">
                          Получить сертификат
                        </v-btn>
                      </template>

                      <v-btn v-else disabled class="iek-btn ma-0">{{item.status_label}}</v-btn>
                    </v-flex>
                  </v-layout>

                </div>

                <v-layout v-if="!!order && !!order.items && order.items.length > 1" row wrap class="orders--footer mt-4">
                  <v-flex>Итоговая сумма заказа:</v-flex>
                  <v-flex md1 xs2 class="center">{{order.amount}}</v-flex>
                </v-layout>

              </v-flex>
            </v-layout>

          </v-flex>
        </v-layout>
      </v-tab-item>

      <v-tab>Платежи</v-tab>
      <v-tab-item>
        <v-layout max row wrap class="payments mt-3">
          <v-flex md10 offset-md1 xs12>
            <v-layout v-for="payment in payments" :key="payment.ms_payment_id"  class="payments--block">
              <v-flex>
                <v-layout class="payments--head">
                  <v-flex md3 xs3>Заказ №{{payment.ms_payment_id}}</v-flex>
                  <v-flex md2 xs2 class="center">{{ payment.type_label }}</v-flex>
                  <v-flex md3 xs3 class="center">Дата платежа</v-flex>
                  <v-flex md2 xs2 class="center">Сумма (бонусов)</v-flex>
                  <v-flex md2 xs2 class="center">Сумма (рублей)</v-flex>
                </v-layout>

                <v-layout row wrap class="payments--wrap">
                  <v-flex md3 xs3>
                    <div>{{ payment.status_label }}</div>
                  </v-flex>

                  <v-flex md2 xs2 v-if="payment.parameters">
                    <div class="sert-title center">{{ payment.parameters.phone_mobile }}</div>
                  </v-flex>

                  <v-flex md3 xs3>
                    <div class="sert-title center">{{ payment.created_at }}</div>
                  </v-flex>

                  <v-flex md2 xs2>
                    <div class="sert-title center">{{ payment.amount }}</div>
                  </v-flex>

                  <v-flex md2 xs2>
                    <div class="sert-title center">{{ payment.payment_amount }}</div>
                  </v-flex>
                </v-layout>

              </v-flex>
            </v-layout>

          </v-flex>
        </v-layout>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
  export default {
    computed: {
      user() {
        return this.$store.state.user;
      },
      orders() {
        return this.$store.state.eps.orders;
      },
      payments() {
        return this.$store.state.payments.payments;
      },
    },
    mounted() {
      this.$store.dispatch('eps/GetOrders', this.user.profile_id);
      this.$store.dispatch('payments/GetPayments', this.user.profile_id);
      this.$store.dispatch('GetPaymentsSettings');
    },
    methods: {
      DownloadCard(order, card) {
        this.$store.dispatch('DownloadFile', {
          url: '/profiles/api/cards/download-blob',
          data: {
            profile_id: this.user.profile_id,
            ms_order_id: order.ms_order_id,
            ms_card_id: card.ms_card_id,
          },
          filename: `${card.type}_${card.nominal}.pdf`,
        });
      },
      DownloadCards(order, cards) {
        let msCardIds = [];
        if (cards) {
          msCardIds = cards.map(card => card.ms_card_id);
        }

        this.$store.dispatch('DownloadFile', {
          url: '/profiles/api/cards/download-blob-cards',
          data: {
            profile_id: this.user.profile_id,
            ms_order_id: order.ms_order_id,
            ms_card_ids: msCardIds,
          },
          filename: `${cards[0].type}_${cards[0].nominal}.zip`,
        });
      },
    },
  };
</script>

<style scoped>
  .icon-download {
    color: #666;
    font-size: 32px;
    padding-right: 6px;
  }

  .icon-download:hover {
    color: #111;
  }

  .certificate-list--wrap .sert-label {
    color: #666;
  }

  .certificate-list--wrap .sert-title {
    font-weight: 600;
    font-size: 1.1rem;
  }
  .certificate-list--wrap .sert-title.title-with-icon{
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>
