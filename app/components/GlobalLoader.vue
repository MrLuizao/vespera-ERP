<script setup lang="ts">
const { loaderState } = useLoader()
</script>

<template>
  <UModal
    :open="loaderState.isLoading"
    :dismissible="false"
    :close="false"
    :title="loaderState.message"
    description="Espera a que termine la operación."
    :ui="{ overlay: 'z-60 bg-black/45', content: 'z-60 glass-overlay ring-0 max-w-sm', header: 'sr-only', body: 'p-0' }"
  >
    <template #body>
      <div class="p-6 flex flex-col items-center gap-4" aria-busy="true">
        <div class="relative" aria-hidden="true">
          <div class="size-14 rounded-full border-4 border-royal-200 dark:border-royal-800" />
          <div class="absolute inset-0 size-14 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        </div>
        <p id="global-loader-message" role="status" aria-live="polite" class="font-semibold text-center text-sm">
          {{ loaderState.message }}
        </p>
      </div>
    </template>
  </UModal>
</template>
