<template>
  <UModal
    v-model:open="successState.isOpen"
    :ui="{ content: 'rounded-[2rem] bg-white/85 dark:bg-carbon-900/90 backdrop-blur-2xl ring-0 shadow-2xl' }"
  >
    <template #content>
      <div class="p-7">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-11 h-11 rounded-full bg-posteal-500 flex items-center justify-center shrink-0">
            <UIcon
              :name="successState.options.icon"
              class="w-5 h-5 text-white"
            />
          </div>
          <div>
            <h3 class="font-semibold text-carbon-900 dark:text-white">
              {{ successState.options.title }}
            </h3>
            <p class="text-xs text-sage-600 dark:text-gray-400">
              {{ successState.options.description }}
            </p>
          </div>
        </div>

        <div
          v-if="successState.options.details?.length"
          class="rounded-2xl bg-black/[0.04] dark:bg-black/30 divide-y divide-black/[0.05] dark:divide-white/[0.05] mb-6"
        >
          <div
            v-for="detail in successState.options.details"
            :key="detail.label"
            class="flex justify-between items-center px-4 py-3"
          >
            <span class="text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-gray-400">
              {{ detail.label }}
            </span>
            <span class="font-semibold text-carbon-900 dark:text-white font-mono">{{ detail.value }}</span>
          </div>
        </div>

        <div class="flex justify-end">
          <UButton
            color="success"
            size="lg"
            class="rounded-full cursor-pointer transition-all active:scale-95"
            @click="closeSuccess"
          >
            Aceptar
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { successState, closeSuccess } = useSuccessModal()
</script>
