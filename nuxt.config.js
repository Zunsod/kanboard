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

  css: ['~/assets/scss/main.scss'],

  components: [{ path: '~/components', pathPrefix: false }],

  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/style-resources'],

  styleResources: {
    // Zuvhun mixins
    scss: ['~/assets/scss/_variables.scss', '~/assets/scss/_mixins.scss']
  },

  build: {
    transpile: ['firebase', '@firebase', 'vue-tabler-icons', 're2js']
  },

  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID
  },
}