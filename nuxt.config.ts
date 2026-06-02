// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxt/eslint', 'nuxt-auth-utils'],
  devtools: {
    enabled: true,
  },
  css: [
    '@/assets/styles/reset.scss',
    '@/assets/styles/global.scss',
    '@/assets/styles/iconfont/iconfont.css',
    '@/assets/styles/article.scss',
  ],
  runtimeConfig: {
    session: {
      maxAge: 60 * 60,
      password: process.env.NUXT_SESSION_PASSWORD || '',
      cookie: {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
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
