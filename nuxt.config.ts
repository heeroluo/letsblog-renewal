// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
  ],
  devtools: {
    enabled: true,
  },
  css: [
    '@/assets/styles/reset.scss',
    '@/assets/styles/global.scss',
    '@/assets/styles/iconfont/iconfont.css',
    '@/assets/styles/article.scss',
  ],
  devServer: {
    port: 3030,
  },
  compatibilityDate: '2025-07-15',
  eslint: {
    config: {
      stylistic: true,
    },
  },
});
