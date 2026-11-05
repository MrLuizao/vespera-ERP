// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  // Secretos de server-side (Nunca llegan al cliente).
  // Override en producción: NUXT_GEMINI_API_KEY / NUXT_GEMINI_MODEL
  runtimeConfig: {
    geminiApiKey: '',
    geminiModel: ''
  },

  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15'
})
