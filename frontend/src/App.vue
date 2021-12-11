<template>
  <div id="app" class="main h-100 d-flex flex-column" v-cloak>
    <NetworkStatus />
    <Navbar />
    <div class="container-fluid">
      <div class="row">
        <main class="col-12 ms-sm-auto px-md-4">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#app main {
  text-align: center;
}
[v-cloak] {
  display: none !important;
}
</style>

<script lang="ts">
import Navbar from "./components/Navbar.vue";
import NetworkStatus from "./components/NetworkStatus.vue";

export default {
  name: "App",
  components: {
    Navbar,
    NetworkStatus,
  },
};
</script>
