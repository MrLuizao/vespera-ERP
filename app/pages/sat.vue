<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-8 flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-4">
        <div class="w-11 h-11 shrink-0 rounded-full bg-white/60 dark:bg-white/[0.08] backdrop-blur-2xl flex items-center justify-center shadow-sm">
          <UIcon
            name="i-lucide-file-search"
            class="w-5 h-5 text-carbon-800 dark:text-gray-200"
          />
        </div>
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold text-carbon-900 dark:text-white tracking-tight">
            Auditoría SAT & Proveedores
          </h1>
          <p class="text-sage-600 dark:text-gray-300 mt-1 text-sm">
            {{ cfoStore.lastSatSync }}
          </p>
        </div>
      </div>

      <UButton
        icon="i-lucide-refresh-cw"
        color="primary"
        size="lg"
        class="w-full sm:w-auto justify-center rounded-full cursor-pointer transition-transform active:scale-95"
        @click="handleSyncSat"
      >
        Sincronizar SAT
      </UButton>
    </div>

    <UCard
      class="rounded-[2rem]"
      :ui="{ root: 'bg-white/60 dark:bg-white/[0.07] backdrop-blur-2xl ring-0 divide-y-0 shadow-lg', header: 'p-6 sm:px-7 sm:pt-7 sm:pb-0', body: 'p-6 sm:p-7' }"
    >
      <template #header>
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-[#67B8F7] to-[#3B9AE8] flex items-center justify-center shadow-sm">
              <UIcon
                name="i-lucide-shield-alert"
                class="w-5 h-5 text-white"
              />
            </div>
            <div>
              <p class="font-semibold text-carbon-900 dark:text-white">
                Facturas XML con Sobrecosto
              </p>
              <p class="text-xs text-sage-600 dark:text-gray-300">
                RFC: {{ cfoStore.activeFinancials.rfc }} · En riesgo: {{ formatCurrency(cfoStore.pendingLeakageAmount) }}/mes
              </p>
            </div>
          </div>

          <UBadge
            v-if="cfoStore.pnlSummary.recoveredSavingsFromSat > 0"
            color="success"
            variant="soft"
            size="lg"
            class="rounded-full font-semibold"
          >
            Recuperado: +{{ formatCurrency(cfoStore.pnlSummary.recoveredSavingsFromSat) }}
          </UBadge>
        </div>
      </template>

      <div class="space-y-4">
        <div
          v-for="item in cfoStore.filteredAnomalies"
          :key="item.id"
          class="rounded-[1.5rem] bg-white/50 dark:bg-black/25 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5"
        >
          <div class="space-y-2 max-w-2xl">
            <div class="flex items-center flex-wrap gap-2">
              <UBadge
                v-if="item.category === 'LISTA_NEGRA_EFOS_69B'"
                color="error"
                variant="solid"
                class="font-bold"
              >
                Art. 69-B EFOS
              </UBadge>
              <UBadge
                :color="item.status === 'DETECTED' ? 'error' : item.status === 'BLOCKED' ? 'success' : 'neutral'"
                variant="soft"
              >
                {{ item.status === 'DETECTED' ? 'Sobreprecio Detectado' : item.status === 'BLOCKED' ? 'Pago Retenido' : 'Permitido' }}
              </UBadge>
              <span class="text-xs font-mono text-sage-600 dark:text-gray-300">
                {{ item.cfdiFolio }} · {{ item.venueName }}
              </span>
            </div>

            <h3 class="text-base sm:text-lg font-bold text-carbon-900 dark:text-white">
              {{ item.title }}
            </h3>

            <p class="text-xs font-semibold text-sage-700 dark:text-gray-200">
              {{ item.supplierName }} ({{ item.supplierRfc }})
            </p>

            <p class="text-sm text-sage-600 dark:text-gray-300">
              {{ item.detail }}
            </p>
          </div>

          <div class="flex flex-col md:items-end justify-between gap-3 shrink-0">
            <div class="md:text-right">
              <span class="text-xs uppercase tracking-wider font-semibold text-sage-600 dark:text-gray-300 block">
                Impacto Mensual
              </span>
              <span class="text-2xl font-bold font-mono text-error-600 dark:text-error-400">
                -{{ formatCurrency(item.monthlyImpactMxn) }}
              </span>
            </div>

            <div
              v-if="item.status === 'DETECTED'"
              class="flex items-center gap-2.5"
            >
              <UButton
                color="neutral"
                variant="subtle"
                class="rounded-full cursor-pointer transition-all hover:bg-neutral-200 dark:hover:bg-neutral-800"
                @click="handleApproveException(item)"
              >
                Permitir
              </UButton>
              <UButton
                color="primary"
                icon="i-lucide-shield-alert"
                class="rounded-full cursor-pointer transition-all"
                @click="handleBlockPayment(item)"
              >
                Retener Pago
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useCfoStore, type SatXmlAnomaly } from '~/stores/cfo'

const cfoStore = useCfoStore()
const { confirm } = useConfirmModal()
const { showSuccess } = useSuccessModal()
const { showLoader, hideLoader } = useLoader()

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(val)
}

async function handleSyncSat() {
  showLoader('Descargando y auditando XMLs del SAT...')
  setTimeout(() => {
    cfoStore.addSimulatedSatAnomaly()
    hideLoader()
    showSuccess({
      title: 'Sincronización SAT Completada',
      description: 'Se analizaron los nodos <cfdi:Concepto> de las últimas facturas emitidas al RFC del grupo.',
      icon: 'i-lucide-file-check-2',
      details: [
        { label: 'RFC Auditado', value: cfoStore.activeFinancials.rfc },
        { label: 'XMLs Analizados', value: '185 CFDIs 4.0' },
        { label: 'Nueva Anomalía', value: 'Factura duplicada $12,600 MXN' }
      ]
    })
  }, 900)
}

async function handleBlockPayment(item: SatXmlAnomaly) {
  const confirmed = await confirm({
    title: '¿Retener Pago a Proveedor?',
    description: 'Se bloqueará la dispersión bancaria de esta factura y se solicitará nota de crédito:',
    icon: 'i-lucide-shield-alert',
    color: 'warning',
    confirmText: 'Retener Pago',
    details: [
      { label: 'Folio CFDI', value: item.cfdiFolio },
      { label: 'Proveedor', value: item.supplierName },
      { label: 'Impacto Recuperado', value: formatCurrency(item.monthlyImpactMxn) }
    ]
  })

  if (!confirmed) return

  showLoader('Bloqueando factura en tesorería...')
  setTimeout(() => {
    cfoStore.handleAnomalyAction(item.id, 'BLOCKED')
    hideLoader()
    showSuccess({
      title: 'Pago Retenido Exitosamente',
      description: 'El monto ha sido sumado de vuelta a la utilidad distribuible de los socios.',
      icon: 'i-lucide-check-circle',
      details: [
        { label: 'Folio CFDI', value: item.cfdiFolio },
        { label: 'Utilidad Recuperada', value: `+${formatCurrency(item.monthlyImpactMxn)}` },
        { label: 'Nuevo Dividendo Socio', value: formatCurrency(cfoStore.partnerDividendMxn) }
      ]
    })
  }, 600)
}

function handleApproveException(item: SatXmlAnomaly) {
  cfoStore.handleAnomalyAction(item.id, 'ACCEPTED')
}
</script>
