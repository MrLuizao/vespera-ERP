<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  htmlAttrs: {
    lang: 'es'
  }
})

const title = 'Vespera Hub ERP · Sistema Financiero & Legal (CFO Core)'
const description = 'CFO Core, Tesorería, Blindaje Fiscal SAT y Gobierno Corporativo para Grupos Restauranteros'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <UApp :toaster="{ position: 'top-right' }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ConfirmModal />
    <SuccessModal />
    <GlobalLoader />
  </UApp>
</template>
