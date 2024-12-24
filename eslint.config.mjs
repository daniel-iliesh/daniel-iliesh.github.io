// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
    rules: { "vue/valid-v-slot": ["error", { allowModifiers: true }] },
});
