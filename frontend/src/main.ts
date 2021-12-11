import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import Toasted from "vue-toasted";

// import "bootstrap";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.css";

Vue.use(Toasted);

Vue.toasted.register("app_error", "Oops.. Something Went Wrong.", {
  type: "error",
  position: "top-center",
  theme: "bubble",
  duration: 5000,
});
Vue.toasted.register(
  "app_success",
  (payload) => {
    if (!payload.message) {
      return "Success!";
    } else {
      return payload.message;
    }
  },
  {
    type: "success",
    position: "top-center",
    theme: "bubble",
    duration: 5000,
  }
);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
