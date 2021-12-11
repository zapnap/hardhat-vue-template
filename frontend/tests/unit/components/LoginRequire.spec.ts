import { mount, createLocalVue } from "@vue/test-utils";
import LoginRequired from "@/components/LoginRequired.vue";

const localVue = createLocalVue();

describe("LoginRequired.vue", () => {
  describe("connected", () => {
    it("displays the slot content", async () => {
      const opts = {
        localVue,
        propsData: {
          initialized: true,
          connected: true,
        },
        slots: {
          default: "hello world",
        },
      };
      const wrapper = mount(LoginRequired, opts);
      const text = wrapper.find(".content-login-required").text();

      expect(text).toMatch("hello world");
      expect(text).not.toMatch("No wallet connected");
    });
  });

  describe("initialized but not connected", () => {
    it("displays warning message", async () => {
      const opts = {
        localVue,
        propsData: {
          initialized: true,
          connected: false,
        },
        slots: {
          default: "hello world",
        },
      };
      const wrapper = mount(LoginRequired, opts);
      const text = wrapper.find(".content-login-required").text();

      expect(text).not.toMatch("hello world");
      expect(text).toMatch("No wallet connected");
    });
  });

  describe("not yet initialized", () => {
    it("waits to display content", async () => {
      const opts = {
        localVue,
        propsData: {
          initialized: false,
          connected: false,
        },
        slots: {
          default: "hello world",
        },
      };
      const wrapper = mount(LoginRequired, opts);
      const text = wrapper.find(".content-login-required").text();

      expect(text).not.toMatch("hello world");
      expect(text).not.toMatch("No wallet connected");
    });
  });
});
