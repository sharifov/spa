<template>
  <v-container fluid fill-height pa-0>
    <v-layout max row wrap>


      <v-flex xs12 class="title-page">
        <div class="title-background"></div>
        <div>Движение баллов</div>
      </v-flex>


      <v-card-title v-if="!!user && profileTransactions && !profileTransactions.length" class="px-0">
        Ваш баланс составляет {{ user.balance }} баллов
      </v-card-title>

      <v-flex xs12>
        <v-layout row wrap pt-1>
          <v-flex xs12 sm8 offset-sm2 md6 offset-md0 lg4 pr-3 pl-3 pb-3 mb-3
                  v-for="(item, index) in profileTransactions" :key="index">
            <v-card height="100%">
              <v-card-title class="primary">
                <v-layout align-center justify-space-between row fill-height>
                  <div class="item md6">
                    {{item.created_at}}
                  </div>
                  <div class="item md6">
                    {{item.amount}}
                    <v-icon class="transitionIcon" v-if="(item.type === 'in')" right color="green">arrow_upward</v-icon>
                    <v-icon class="transitionIcon" v-if="(item.type === 'out')" right color="red">arrow_downward</v-icon>
                  </div>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <div>{{item.title}}</div>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        profileTransactions: [],
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      },
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },
    },
    methods: {
      getProfileTransactions(profileId) {
        const app = this;
        if (this.isAuthenticated) {
          app.$store.getters.axl.post('profiles/api/transaction/list', { profile_id: profileId })
            .then((responce) => {
              app.profileTransactions = responce.data.transactions;
            })
            .catch((error) => {
              app.$store.dispatch('HandleError', error);
            });
        }
      },
    },
    mounted() {
      this.getProfileTransactions(this.user.profile_id);
    },
  };
</script>

<style scoped>
  #app .v-card__title .v-icon.transitionIcon {
    margin-right: 0;
  }
</style>

