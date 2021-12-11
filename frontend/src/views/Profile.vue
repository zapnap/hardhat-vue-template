<template>
  <LoginRequired :initialized="isInitialized" :connected="isUserConnected">
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Your profile</h1>
    </div>

    <div class="row">
      <div class="col-md-5 text-center">
        <div class="card">
          <div class="card-body">
            <Gravatar
              v-if="getActiveAccount"
              class="img-fluid mb-4"
              :email="getActiveAccount"
              default-img="robohash"
              :size="200"
            />
            <p class="profile-address">
              <strong>Your address:</strong>
              <span>{{ getActiveAccount }}</span>
            </p>
            <p class="profile-balance">
              <strong>Your balance:</strong>
              <span>{{ Number(getActiveBalanceEth).toFixed(4) }} ETH</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </LoginRequired>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import Gravatar from "vue-gravatar";
import LoginRequired from "@/components/LoginRequired.vue";

export default {
  name: "Profile",
  components: {
    LoginRequired,
    Gravatar,
  },
  computed: {
    ...mapGetters("accounts", [
      "isInitialized",
      "isUserConnected",
      "getActiveAccount",
      "getActiveBalanceEth",
    ]),
  },
};
</script>
