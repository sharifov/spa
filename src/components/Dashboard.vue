<template>
  <v-container fluid fill-height pa-0>
    <v-layout max row wrap class="dashboard">
      <v-flex xs12 mb-4 class="xs-margin-x0">
        <v-card>
          <v-card-title class="primary">Личный кабинет</v-card-title>
        </v-card>
      </v-flex>
      <v-flex v-if="user" xs12 row fill-height class="xs-margin-x0">
        <v-layout row wrap v-if="user">
          <v-flex md4 xs12 pr-3 pb-3 md-pr-0>
            <v-card height="100%">
              <v-card-title class="primary">Личные данные</v-card-title>
              <v-card-text class="stable-height size-16">
                <div class="mb-2">{{user.last_name}} {{user.first_name}} {{user.middle_name}}</div>
                <div v-if="user.phone_mobile">Телефон: {{user.phone_mobile}}</div>
                <div v-if="user.email">Email: {{user.email}}</div>
              </v-card-text>
              <v-card-actions class="pa-3">
                <v-btn color="primary--btn" to="/profile-edit">
                  <v-icon class="mr-2">create</v-icon>
                  Изменить
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>

          <v-flex md4 xs12 pr-3 pb-3 md-pr-0>
            <v-card height="100%">
              <v-card-title class="primary">Кошелек</v-card-title>
              <v-card-text class="stable-height size-16">
                Баланс: <b>{{user.balance}}</b>
              </v-card-text>
              <v-card-actions class="pa-3" bottom>
                <v-btn color="primary--btn" to="/profile-transactions">
                  <v-icon class="mr-2">monetization_on</v-icon>
                  Движение баллов
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>

          <v-flex md4 xs12 pb-3>
            <v-card height="100%">
              <v-card-title class="primary">Налоговая анкета</v-card-title>
              <v-card-text class="stable-height size-16 block-chip">
                <div>Статус:
                  <v-chip v-if="account" :class="`border-color-${account.status} sale-status bg-color-white`">
                    {{account.status_label}}
                    <span :class="`bg-color-${account.status} status-point`"></span>
                  </v-chip>
                  <v-chip v-else class="border-color-red sale-status bg-color-white">
                    не заполнена
                    <span class="bg-color-red status-point"></span>
                  </v-chip>
                </div>
              </v-card-text>
              <v-card-actions class="pa-3" v-show="!account || account.status !== 'approved'">
                <v-btn color="primary--btn" to="/passport">
                  <v-icon class="mr-2">assignment_ind</v-icon>
                  Заполнить анкету
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    computed: {
      user() {
        return this.$store.state.user;
      },
      account() {
        return this.$store.state.user.account;
      },
    },
    mounted() {
      this.$store.dispatch('GetProfile');
      setInterval(() => {
        this.$store.dispatch('GetProfile');
      }, 61000);
    },
  };
</script>
