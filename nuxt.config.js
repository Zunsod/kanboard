export default {
  ssr: false,
  target: 'static',

  head: {
    title: 'Kanboard',
    htmlAttrs: { lang: 'mn' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&subset=cyrillic&display=swap'
      }
    ]
  },

  css: [
  '@tabler/icons-webfont/dist/tabler-icons.min.css',
  '~/assets/scss/main.scss'
  ],

  components: false,

  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/style-resources'],

  styleResources: {
    // Zuvhun mixins
    scss: ['~/assets/scss/_variables.scss', '~/assets/scss/_mixins.scss']
  },

  build: {
    transpile: ['firebase', '@firebase']
  }
}