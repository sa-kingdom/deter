// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: '看板',
      titleTemplate: '%s - Deter 迪特',
      meta: [
        {
          name: 'description',
          content: '在名為 Discord 的高速公路風馳電掣的論壇系統！ 在 Discord 建立公開論壇？騙人的吧...'
        }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/tocas/4.2.5/tocas.min.css' },
      ],
      script: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/tocas/4.2.5/tocas.min.js' }
      ]
    },
  },
  devtools: { enabled: true }
})
