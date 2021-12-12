<template>
  <div
    class="network-status-alert modal fade"
    id="networkStatus"
    tabindex="-1"
    role="dialog"
    aria-labelledby="networkStatusLabel"
    aria-hidden="true"
    v-show="this.show"
  >
    <div class="modal-dialog" role="document" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="networkStatusLabel">
            ⚠️ Warning: Unsupported Network
          </h5>
        </div>
        <div class="modal-body">
          <p>
            You are currently connected to
            <strong class="warning-network">
              {{ currentNetwork.name }} ({{ currentNetwork.chainId }})
            </strong>
            which is not supported by this application.
          </p>
          <p>Please connect your wallet to one of the following networks:</p>
          <ul class="supported-networks">
            <li v-for="network in supportedNetworks" :key="network.chainId">
              {{ network.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import addresses from "@/contracts/addresses.json";
import chains from "@/contracts/chains.json";
import { mapGetters } from "vuex";
import { Modal } from "bootstrap";

export default {
  name: "NetworkStatus",
  data() {
    return {
      modalInstance: null,
      show: false,
    };
  },
  mounted() {
    this.modalInstance = new Modal(this.$el, { backdrop: "static" });
    document.addEventListener("keydown", this.handleKeydown);
  },
  created() {
    this.$store.dispatch("accounts/init");
  },
  computed: {
    ...mapGetters("accounts", [
      "getChainSupported",
      "getChainId",
      "getChainData",
      "isUserConnected",
    ]),
    supportedNetworks: function () {
      const production = process.env.NODE_ENV === "production";
      const testIds = ["1337", "31337"];

      const key = Object.keys(addresses)[0];
      let supportedIds = Object.keys(addresses[key]);
      let testNetworks: any[] = [];

      if (!production) {
        testNetworks.push({
          name: "Localhost",
          chainId: 1337,
          networkId: 1337,
        });
      }

      const filteredNetworks = chains.filter(
        (c: any) =>
          supportedIds.includes(c.chainId.toString()) &&
          (production ? !testIds.includes(c.chainId.toString()) : true)
      );
      return [...filteredNetworks, ...testNetworks];
    },
    currentNetwork: function () {
      const id = this.getChainId;
      const defaultNetwork = {
        name: "Unknown",
        chainId: id,
        networkId: id,
      };
      const network = chains.filter((c: any) => c.chainId === parseInt(id))[0];
      return network || defaultNetwork;
    },
  },
  watch: {
    getChainSupported: {
      handler: function (value) {
        if (!value) {
          this.show = true;
        }
      },
      immediate: true,
    },
    show: {
      handler(value) {
        if (value) {
          this.open();
        } else if (!value) {
          this.close();
        }
      },
    },
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleKeydown);
    if (this.isDef(this.modalInstance)) {
      this.modalInstance.dispose();
      this.modalInstance = null;
    }
  },
  methods: {
    handleKeydown(e) {
      if (this.show && e.keyCode === 27) {
        this.close();
      }
    },
    close() {
      if (this.isDef(this.modalInstance)) {
        this.modalInstance.hide();
      }
      // if (this.onClose !== null) {
      //   this.onClose();
      // }
    },
    open() {
      // if (this.isDef(this.onOpen)) {
      //   this.onOpen();
      // }
      this.modalInstance.show();
    },
    isDef(obj) {
      return typeof obj !== undefined && obj !== null;
    },
  },
};
</script>
