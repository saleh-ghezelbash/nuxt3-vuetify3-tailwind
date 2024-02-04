import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  devtools: { enabled: true },
  // runtimeConfig: {
  //   public: {
  //     baseURL: process.env.BASE_URL || "http://localhost:8000",
  //     headers: {
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //   },
  // },
  build: {
    transpile: ["vuetify", "@vuepic/vue-datepicker"],
  },
  plugins: [
    "~/plugins/notificationHandler",
    "~/plugins/axios",
    // "~/plugins/v-mask",
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  modules: [
    "@pinia/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["~/assets/css/main.css"],
});
