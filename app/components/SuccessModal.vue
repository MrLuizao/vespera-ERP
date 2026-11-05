<script setup lang="ts">
const { successState, closeSuccess } = useSuccessModal()
</script>

<template>
  <UModal
    v-model:open="successState.isOpen"
    :title="successState.options.title"
    :description="successState.options.description"
    :ui="{ content: 'glass-overlay max-w-[480px] ring-0', header: 'p-5 sm:p-6', body: 'p-5 sm:p-6', footer: 'p-5 sm:p-6 justify-end' }"
  >
    <template #body>
      <div class="w-11 h-11 rounded-xl bg-royal-500 text-carbon-950 flex items-center justify-center mb-4">
        <UIcon :name="successState.options.icon" class="size-5" aria-hidden="true" />
      </div>
      <dl v-if="successState.options.details?.length" class="divide-y divide-default">
        <div v-for="detail in successState.options.details" :key="detail.label" class="financial-row py-3">
          <dt class="text-sm text-muted">{{ detail.label }}</dt>
          <dd class="font-semibold text-right break-words min-w-0 max-w-full tabular-nums">{{ detail.value }}</dd>
        </div>
      </dl>
    </template>
    <template #footer>
      <UButton color="primary" size="lg" class="w-full sm:w-auto justify-center" @click="closeSuccess">Aceptar</UButton>
    </template>
  </UModal>
</template>
