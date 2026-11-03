<template>
  <UModal
    v-model:open="modalState.isOpen"
    :ui="{ content: 'rounded-[2rem] bg-white/85 dark:bg-carbon-900/90 backdrop-blur-2xl ring-0 shadow-2xl' }"
  >
    <template #content>
      <div class="p-7">
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            :class="iconBgClass"
          >
            <UIcon
              :name="modalState.options.icon"
              class="w-5 h-5"
              :class="iconColorClass"
            />
          </div>
          <div>
            <h3 class="font-semibold text-carbon-900 dark:text-white">
              {{ modalState.options.title }}
            </h3>
            <p class="text-xs text-sage-600 dark:text-gray-400">
              {{ modalState.options.description }}
            </p>
          </div>
        </div>

        <div
          v-if="modalState.options.details?.length"
          class="rounded-2xl bg-black/[0.04] dark:bg-black/30 divide-y divide-black/[0.05] dark:divide-white/[0.05] mb-6"
        >
          <div
            v-for="detail in modalState.options.details"
            :key="detail.label"
            class="flex justify-between items-center px-4 py-3"
          >
            <span class="text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-gray-400">
              {{ detail.label }}
            </span>
            <span class="font-semibold text-carbon-900 dark:text-white">{{ detail.value }}</span>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <UButton
            color="neutral"
            variant="subtle"
            size="lg"
            class="rounded-full cursor-pointer transition-all hover:bg-neutral-200 dark:hover:bg-neutral-800"
            @click="modalState.onCancel?.()"
          >
            {{ modalState.options.cancelText }}
          </UButton>
          <UButton
            :color="modalState.options.color"
            size="lg"
            class="rounded-full cursor-pointer transition-all active:scale-95"
            @click="modalState.onConfirm?.()"
          >
            {{ modalState.options.confirmText }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { modalState } = useConfirmModal()

const iconBgClass = computed(() => {
  const colors: Record<string, string> = {
    primary: 'bg-primary-500',
    success: 'bg-posteal-500',
    warning: 'bg-posyellow-400',
    error: 'bg-error-500',
    info: 'bg-primary-500',
    neutral: 'bg-carbon-900 dark:bg-white'
  }
  return colors[modalState.options.color || 'primary']
})

const iconColorClass = computed(() => {
  const colors: Record<string, string> = {
    primary: 'text-white',
    success: 'text-white',
    warning: 'text-carbon-900',
    error: 'text-white',
    info: 'text-white',
    neutral: 'text-white dark:text-carbon-900'
  }
  return colors[modalState.options.color || 'primary']
})
</script>
