import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  app: {
    layoutTransition: { name: "layout", mode: "out-in" },
    pageTransition: { name: "page", mode: "out-in" },
  },
  modules: [
    "@nuxt/eslint",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error because that is just how it works
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@nuxtjs/i18n",
    "@nuxt/content"
  ],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  i18n: {
    lazy: true,
    strategy: "prefix_except_default",
    locales: [
      {
        code: "en",
        language: "en-US",
        name: "English",
        file: "en-US.json",
        icon: "🇬🇧",
      },
      {
        code: "ro",
        language: "ro-RO",
        name: "Romana",
        file: "ro-RO.json",
        icon: "🇷🇴",
      },
      {
        code: "ru",
        language: "ru-RU",
        name: "Русский",
        file: "ru-RU.json",
        icon: "🇷🇺",
      },
    ],
    defaultLocale: "en",
    langDir: "locales",
  },
});
