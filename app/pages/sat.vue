<template>
  <div class="min-w-0">
    <!-- Encabezado Desktop y Móvil -->
    <div class="mb-4 sm:mb-8 mt-4 sm:mt-5 flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-4">
        <div class="w-11 h-11 shrink-0 icon-tile flex items-center justify-center">
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

      <!-- Botón Sincronizar en Desktop -->
      <UButton
        icon="i-lucide-refresh-cw"
        color="primary"
        size="lg"
        :disabled="cfoStore.isScanningSat" :loading="cfoStore.isScanningSat"
        class="hidden sm:inline-flex w-auto justify-center"
        @click="handleSyncSat"
      >
        Sincronizar SAT
      </UButton>
    </div>

    <!-- Botón Sincronizar SAT en Modo Móvil: DEBAJO del título ocupando ancho total -->
    <div class="block sm:hidden mb-6">
      <UButton
        icon="i-lucide-refresh-cw"
        color="primary"
        size="xl"
        block
        :disabled="cfoStore.isScanningSat" :loading="cfoStore.isScanningSat"
        class="w-full justify-center"
        @click="handleSyncSat"
      >
        Sincronizar SAT
      </UButton>
    </div>

    <!-- Anuncio de resultado del análisis IA, una vez por sync (spec §8) -->
    <p
      role="status"
      aria-live="polite"
      class="sr-only"
    >
      {{ aiAnnouncement }}
    </p>

    <UCard
      :ui="{ root: 'glass-panel ring-0 divide-y-0', header: 'p-5 sm:p-6 pb-0', body: 'p-5 sm:p-6' }"
    >
      <template #header>
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 shrink-0 icon-tile flex items-center justify-center">
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

      <p v-if="!cfoStore.filteredAnomalies.length" class="py-6 text-muted">No hay anomalías para la sucursal seleccionada.</p>
      <div class="divide-y divide-default">
        <div
          v-for="item in cfoStore.filteredAnomalies"
          :key="item.id"
          class="py-6 flex flex-col lg:flex-row lg:items-start justify-between gap-6"
        >
          <div class="space-y-3 max-w-3xl min-w-0 break-words">
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

            <!-- Bloque Análisis IA (spec sat-ai-audit §1): reemplaza al slot de detail -->
            <div
              v-if="item.aiAnalysis"
              :id="`sat-ai-${item.id}`"
              role="region"
              :aria-labelledby="`sat-ai-label-${item.id}`"
              class="border-t border-default pt-4 space-y-4"
            >
              <!-- Fila 1: label + badges (legal omitido en EFOS, spec §1) -->
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <span
                  :id="`sat-ai-label-${item.id}`"
                  class="text-sm font-semibold text-muted inline-flex items-center gap-1.5"
                >
                  <UIcon
                    name="i-lucide-sparkles"
                    aria-hidden="true"
                    class="w-4 h-4 text-primary"
                  />
                  Análisis IA
                </span>
                <div class="flex items-center gap-1.5 flex-wrap">
                  <UBadge
                    v-if="item.category !== 'LISTA_NEGRA_EFOS_69B'"
                    color="error"
                    variant="soft"
                    size="sm"
                    class="rounded-full font-semibold"
                  >
                    {{ item.aiAnalysis.legalReference }}
                  </UBadge>
                  <UBadge
                    color="primary"
                    variant="soft"
                    size="sm"
                    class="rounded-full"
                  >
                    <UIcon
                      name="i-lucide-sparkles"
                      aria-hidden="true"
                      class="w-3.5 h-3.5"
                    />
                    Generado por IA
                  </UBadge>
                </div>
              </div>

              <!-- 1. Explicación en lenguaje claro (sustituye a detail) -->
              <p class="text-sm text-sage-600 dark:text-gray-300">
                {{ item.aiAnalysis.plainExplanation }}
              </p>

              <!-- 3. Riesgo fiscal -->
              <div class="space-y-1">
                <span class="text-sm font-semibold text-muted inline-flex items-center gap-1.5">
                  <UIcon
                    name="i-lucide-scale"
                    aria-hidden="true"
                    class="w-4 h-4"
                  />
                  Riesgo fiscal
                </span>
                <p class="text-sm font-medium text-carbon-900 dark:text-white">
                  <template
                    v-for="(seg, segIndex) in segmentMono(item.aiAnalysis.fiscalRisk)"
                    :key="segIndex"
                  >
                    <span :class="seg.mono ? 'tabular-nums' : ''">{{ seg.text }}</span>
                  </template>
                </p>
              </div>

              <!-- 4. Acción recomendada -->
              <div class="space-y-1">
                <span class="text-sm font-semibold text-muted inline-flex items-center gap-1.5">
                  <UIcon
                    name="i-lucide-arrow-right"
                    aria-hidden="true"
                    class="w-4 h-4"
                  />
                  Acción recomendada
                </span>
                <p class="text-sm font-medium text-carbon-900 dark:text-white">
                  {{ item.aiAnalysis.recommendedAction }}
                </p>
              </div>

              <!-- 5. Confianza (píldora = semáforo, siempre con % y etiqueta, spec §4) -->
              <div class="space-y-1">
                <span class="text-sm font-semibold text-muted">
                  Confianza
                </span>
                <div class="space-y-1">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                    :class="confidenceMeta(item.aiAnalysis.confidencePct).tone"
                  >
                    <UIcon
                      name="i-lucide-gauge"
                      aria-hidden="true"
                      class="w-4 h-4"
                    />
                    <span class="tabular-nums">{{ item.aiAnalysis.confidencePct }}%</span>
                    · {{ confidenceMeta(item.aiAnalysis.confidencePct).label }}
                  </span>
                  <p
                    v-if="item.aiAnalysis.confidencePct < 60"
                    class="text-sm text-error-600 dark:text-error-400"
                  >
                    Confianza baja: revisa manualmente antes de actuar.
                  </p>
                </div>
              </div>

              <!-- Disclaimer de transparencia -->
              <p class="text-xs text-muted">
                Texto generado por inteligencia artificial; no sustituye asesoría fiscal.
              </p>
            </div>

            <!-- Estado degradado (spec §3): detail + micro-nota si ya hubo sync -->
            <template v-else>
              <p class="text-sm text-sage-600 dark:text-gray-300">
                {{ item.detail }}
              </p>
              <p
                v-if="cfoStore.satAiSynced"
                class="text-sm text-muted inline-flex items-center gap-1.5"
              >
                <UIcon
                  name="i-lucide-circle-minus"
                  aria-hidden="true"
                  class="w-3.5 h-3.5"
                />
                Análisis IA no disponible en esta sincronización.
              </p>
            </template>
          </div>

          <div class="flex flex-col md:items-end justify-between gap-3 shrink-0">
            <div class="md:text-right">
              <span class="text-sm font-semibold text-muted block">
                Impacto Mensual
              </span>
              <span class="text-[28px] font-semibold tabular-nums text-error-600 dark:text-error-400">
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

/** Anuncio aria-live, una sola vez por sync (spec §8). */
const aiAnnouncement = ref('')

async function handleSyncSat() {
  if (cfoStore.isScanningSat) return
  showLoader('Analizando CFDIs con IA… puede tomar hasta 30 segundos.')
  try {
    const ok = await cfoStore.fetchSatAudit()
    if (!ok) return // fetch falló: sin modal, sin anuncio (spec §2 — fuera de alcance)

    const analyzedCount = cfoStore.satAnomalies.filter(a => a.aiAnalysis).length
    aiAnnouncement.value = analyzedCount > 0
      ? `Se agregó análisis de IA a ${analyzedCount} anomalías.`
      : 'Sincronización completada. El análisis IA no está disponible en este momento.'

    showSuccess({
      title: 'Sincronización SAT Completada',
      description: 'Se analizaron los nodos <cfdi:Concepto> de las últimas facturas emitidas al RFC del grupo.',
      icon: 'i-lucide-file-check-2',
      details: [
        { label: 'RFC Auditado', value: cfoStore.activeFinancials.rfc },
        { label: 'XMLs Analizados', value: `${cfoStore.satXmlCount} CFDIs 4.0` },
        {
          label: 'Análisis IA',
          value: analyzedCount > 0 ? `${analyzedCount} anomalías analizadas` : 'No disponible (detalle estático)'
        }
      ]
    })
  } finally {
    hideLoader()
  }
}

/** Metadatos de la píldora de confianza según umbrales spec §4. */
function confidenceMeta(pct: number): { label: string; tone: string } {
  if (pct >= 80) {
    return {
      label: 'Confianza alta',
      tone: 'status-success'
    }
  }
  if (pct >= 60) {
    return {
      label: 'Confianza media',
      tone: 'status-warning'
    }
  }
  return {
    label: 'Requiere revisión manual',
    tone: 'bg-error-500/10 text-error-600 dark:bg-error-400/15 dark:text-error-400'
  }
}

/** Separa cifras para alineación tabular, sin usar v-html. */
function segmentMono(text: string): Array<{ text: string; mono: boolean }> {
  const segments: Array<{ text: string; mono: boolean }> = []
  const pattern = /(\$[\d,]+(?:\.\d+)?|\b\d[\d,.]*%|\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b)/g
  let lastIndex = 0
  let match = pattern.exec(text)
  while (match !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), mono: false })
    }
    segments.push({ text: match[0], mono: true })
    lastIndex = match.index + match[0].length
    match = pattern.exec(text)
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), mono: false })
  }
  return segments
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
