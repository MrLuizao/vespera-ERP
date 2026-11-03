<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="loaderState.isLoading"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div class="bg-white/90 dark:bg-carbon-900/90 backdrop-blur-2xl rounded-[2rem] p-8 shadow-2xl flex flex-col items-center gap-4 min-w-[220px]">
          <div class="relative">
            <div class="w-16 h-16 rounded-full border-4 border-primary-200 dark:border-primary-800" />
            <div class="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary-500 animate-spin" />
          </div>
          <p class="text-carbon-900 dark:text-gray-200 font-semibold text-center text-sm">
            {{ loaderState.message }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { loaderState } = useLoader()
</script>
