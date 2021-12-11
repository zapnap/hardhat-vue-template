<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>Welcome</h1>
    <p>
      This is a basic app template with a dummy smart contract to jumpstart your
      project.
    </p>

    <p class="status-connected" v-if="isUserConnected">
      You are connected to the
      <strong>{{ getChainData.name }} ({{ getChainData.chainId }})</strong>
      network.
    </p>

    <router-link v-if="isUserConnected" to="/set-value">
      <button type="button" class="btn btn-outline-primary btn-lg">
        Let's Go!
      </button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";

export default {
  name: "Home",
  computed: {
    ...mapGetters("accounts", ["getChainData", "isUserConnected"]),
  },
};
</script>
