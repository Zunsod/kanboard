module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'prettier'],
  plugins: [],
  // add your custom rules here
  rules: {
    'vue/no-undef-components': [
      'error',
      { ignorePatterns: ['^Nuxt', '^nuxt', '^ClientOnly$', '^client-only$'] }
    ]
  }
}
