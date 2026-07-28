export default defineNuxtConfig({
  compatibilityDate: '2026-07-28',
  ssr: true,
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    baseURL: '/english-with-fun/',
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'English Fun! 🖍️',
      htmlAttrs: { lang: 'pt' },
      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
        },
        { name: 'theme-color', content: '#fdf8ee' },
        // iPad/iPhone: "Adicionar ao ecrã principal" abre em ecrã cheio, sem barras
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'English Fun' },
      ],
      link: [
        { rel: 'manifest', href: '/english-with-fun/manifest.webmanifest' },
        { rel: 'icon', type: 'image/png', href: '/english-with-fun/icon-192.png' },
        { rel: 'apple-touch-icon', href: '/english-with-fun/apple-touch-icon.png' },
      ],
    },
  },
})
