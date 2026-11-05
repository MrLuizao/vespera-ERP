<script setup lang="ts">
const { modalState } = useConfirmModal()
const iconTone = computed(() => {
  const colors: Record<string, string> = {
    primary: 'bg-royal-500 text-carbon-950',
    success: 'bg-royal-500 text-carbon-950',
    warning: 'bg-posyellow-400 text-carbon-950',
    error: 'bg-error-600 text-white',
    info: 'bg-muted text-default',
    neutral: 'bg-muted text-default'
  }
  return colors[modalState.options.color || 'primary']
})
</script>

<template>
  <UModal
    v-model:open="modalState.isOpen"
    :title="modalState.options.title"
    :description="modalState.options.description"
    :close="false"
    :ui="{ content: 'glass-overlay max-w-[480px] ring-0', header: 'p-5 sm:p-6', body: 'p-5 sm:p-6', footer: 'p-5 sm:p-6 flex-col sm:flex-row sm:justify-end' }"
  >
    <template #body>
      <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-4" :class="iconTone">
        <UIcon :name="modalState.options.icon" class="size-5" aria-hidden="true" />
      </div>
      <dl v-if="modalState.options.details?.length" class="divide-y divide-default">
        <div v-for="detail in modalState.options.details" :key="detail.label" class="financial-row py-3">
          <dt class="text-sm text-muted">{{ detail.label }}</dt>
          <dd class="font-semibold text-right break-words min-w-0 max-w-full tabular-nums">{{ detail.value }}</dd>
        </div>
      </dl>
    </template>
    <template #footer>
      <UButton color="neutral" variant="outline" size="lg" class="w-full sm:w-auto justify-center" autofocus @click="modalState.onCancel?.()">
        {{ modalState.options.cancelText }}
      </UButton>
      <UButton :color="modalState.options.color" size="lg" class="w-full sm:w-auto justify-center whitespace-normal" @click="modalState.onConfirm?.()">
        {{ modalState.options.confirmText }}
      </UButton>
    </template>
  </UModal>
</template>
