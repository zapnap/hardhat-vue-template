<template>
  <LoginRequired :initialized="isInitialized" :connected="isUserConnected">
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Set a new greeting</h1>
    </div>

    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Current greeting</h5>
            <p class="card-text get-greeting">
              <strong>Value:</strong>
              {{ greeting }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">New greeting</h5>

            <div class="set-greeting">
              <div class="form-group mb-3">
                <input
                  id="new-greeting"
                  v-model="newValue"
                  type="text"
                  class="form-control"
                  aria-describedby="greeting-help"
                  placeholder="Your new greeting"
                />
                <small
                  id="greeting-help"
                  v-show="waiting"
                  class="form-text text-muted"
                >
                  Please wait...
                </small>
              </div>
              <button
                @click="onSubmit"
                type="submit"
                class="btn btn-primary"
                :disabled="waiting"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LoginRequired>
</template>

<script lang="ts">
import { ethers } from "ethers";
import { mapGetters, mapActions } from "vuex";

import LoginRequired from "@/components/LoginRequired.vue";

import Greeter from "@/contracts/Greeter.json";
import addresses from "@/contracts/addresses.json";

export default {
  name: "SetValue",
  components: {
    LoginRequired,
  },
  data() {
    return {
      greeting: "",
      newValue: null,
      contract: null,
      waiting: false,
    };
  },
  computed: {
    ...mapGetters("accounts", [
      "isInitialized",
      "isUserConnected",
      "getChainId",
      "getWeb3Provider",
    ]),
  },
  async created() {
    await this.connect();

    if (!this.getWeb3Provider) {
      document.location.href = "/";
    } else {
      // get the contract instance
      let provider = new ethers.providers.Web3Provider(this.getWeb3Provider);
      let signer = provider.getSigner();
      const contractAddress = addresses.Greeter[parseInt(this.getChainId)];
      this.contract = new ethers.Contract(contractAddress, Greeter.abi, signer);

      try {
        const greeting = await this.contract.greet();
        this.greeting = greeting;
      } catch (err) {
        this.$toasted.global.app_error();
        console.log(err);
      }
    }
  },
  methods: {
    ...mapActions("accounts", ["connect"]),
    async onSubmit() {
      this.waiting = true;

      try {
        const transaction = await this.contract.setGreeting(this.newValue);
        await transaction.wait().then((receipt) => {
          this.greeting = this.newValue;
          this.$toasted.global.app_success({
            message: "The new greeting has been set to " + this.newValue,
          });
          this.newValue = "";
          this.waiting = false;
          console.log(receipt);
        });
      } catch (err) {
        this.$toasted.global.app_error();
        this.waiting = false;
        console.log(err);
      }
    },
  },
};
</script>
