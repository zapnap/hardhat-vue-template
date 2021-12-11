<template>
  <header
    class="navbar navbar-expand-lg navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow"
  >
    <nav class="container-fluid">
      <a class="navbar-brand me-0 px-3" href="/">Hardhat-Vue Template</a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#main-nav"
        aria-controls="main-nav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span
          class="navbar-toggler-icon"
          @click="toggledNav = !toggledNav"
        ></span>
      </button>

      <nav class="navbar-collapse collapse" id="main-nav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              v-if="isUserConnected"
              class="nav-link"
              active-class="active"
              to="/set-value"
            >
              Set value
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item" v-if="!isUserConnected">
            <a class="nav-link connect-wallet" href="#" @click="connect">
              Connect your wallet
            </a>
          </li>
          <li class="nav-item dropdown" v-if="isUserConnected">
            <a
              class="nav-link dropdown-toggle"
              id="user-menu"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-expanded="false"
            >
              <span class="user-account">{{ nickname }}</span>
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="user-menu"
            >
              <li>
                <router-link
                  v-if="isUserConnected"
                  class="dropdown-item"
                  to="/profile"
                >
                  👤 My Profile
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item disabled" href="#">
                  🟢 Connected to
                  <span class="network-name">{{ getChainData.name }}</span>
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="disconnect">
                  ⚪ Disconnect Wallet
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </nav>
  </header>
</template>

<script lang="ts">
import { mapGetters, mapActions } from "vuex";
import { Collapse } from "bootstrap";

export default {
  name: "Navbar",
  data() {
    return {
      toggledNav: false,
    };
  },
  computed: {
    ...mapGetters("accounts", [
      "getActiveAccount",
      "isUserConnected",
      "getWeb3Modal",
      "getChainData",
    ]),
    nickname: function () {
      return (
        this.getActiveAccount.slice(0, 9) +
        "..." +
        this.getActiveAccount.slice(-4)
      );
    },
  },
  created() {
    this.$store.dispatch("accounts/init");
  },
  methods: {
    ...mapActions("accounts", ["connect", "disconnect"]),
  },
  watch: {
    $route() {
      this.toggledNav = !this.toggledNav;
      const collapseElementList = [].slice.call(
        document.querySelectorAll(".navbar-collapse.show")
      );
      collapseElementList.map(function (collapseEl) {
        return new Collapse(collapseEl);
      });
    },
  },
};
</script>
