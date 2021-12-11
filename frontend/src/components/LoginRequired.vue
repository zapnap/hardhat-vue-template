<template>
  <div class="content-login-required">
    <div v-if="initialized && connected" class="content-ok" v-cloak>
      <slot></slot>
    </div>
    <div v-if="initialized && !connected" class="content-warning mt-3" v-cloak>
      <h2>No wallet connected</h2>
      <p>Please connect a wallet to use this application.</p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "LoginRequired",
  props: {
    initialized: Boolean,
    connected: Boolean,
  },
};
</script>
