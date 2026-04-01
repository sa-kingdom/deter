// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  app: {
    head: {
      title: '看板',
      titleTemplate: '%s - Deter 迪特',
      meta: [
        {
          name: 'description',
          content: '在名為 Discord 的高速公路風馳電掣的論壇系統！在 Discord 建立公開論壇？騙人的吧...',
        },
      ],
      link: [
        {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap'},
        {rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/tocas/4.2.5/tocas.min.css'},
      ],
      script: [
        {src: 'https://cdnjs.cloudflare.com/ajax/libs/tocas/4.2.5/tocas.min.js'},
      ],
    },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
  ],
  devtools: {enabled: true},
  nitro: {
    preset: 'bun',
    externals: {
      external: ['mysql2'],
    },
  },
  runtimeConfig: {
    public: {
      githubRepositoryUrl: 'https://github.com/sa-kingdom?q=deter',
      discordServerUrl: 'https://discord.gg/Hr4XQt7Eay',
      apiPublicBaseUrl: 'http://localhost:3000',
      apiInvokeBaseUrl: '/api',
    },
    database: {
      name: 'deter',
      user: 'deter',
      pass: 'deter',
      host: '127.0.0.1',
      port: '3306',
      logging: false,
    },
  },
});
