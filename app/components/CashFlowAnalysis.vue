<script setup lang="ts">
import { useCfoStore } from '~/stores/cfo'

const cfoStore = useCfoStore()
const formatCurrency = (value: number) => new Intl.NumberFormat('es-MX', {
  style: 'currency', currency: 'MXN', maximumFractionDigits: 0
}).format(value || 0)
</script>

<template>
  <UCard :ui="{ root: 'glass-panel ring-0 divide-y-0', header: 'p-5 sm:p-6 pb-0', body: 'p-5 sm:p-6' }">
    <template #header>
      <div class="financial-row">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 icon-tile flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-bot" class="size-5" />
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="font-semibold text-highlighted">Diagnóstico Predictivo CFO Copilot</h2>
              <UBadge color="primary" variant="soft">IA GENERATIVA ACTIVA</UBadge>
            </div>
            <p class="text-sm text-muted">Análisis automatizado de confluencia fiscal, compromisos laborales y colchón de maniobra.</p>
          </div>
        </div>
        <span class="text-xs text-muted">Actualizado: Nov 2026</span>
      </div>
    </template>
    <div class="space-y-6">
      <div class="py-4 flat-section">
        <p class="text-sm font-semibold text-highlighted">
          {{ cfoStore.cashFlowForecast?.aiExecutiveSummary?.headline || 'Liquidez Operativa Blindada: Flujo positivo con resiliencia ante obligaciones fiscales de fin de año.' }}
        </p>
        <p class="text-sm text-muted mt-2 leading-relaxed">
          {{ cfoStore.cashFlowForecast?.aiExecutiveSummary?.riskDiagnosis || 'A lo largo de las 13 semanas proyectadas, el punto de máxima exigencia de caja ocurrirá en Sem 7 (Dic 14 - Dic 20), donde la liquidez alcanzará su valle proyectado en $1,538,500 MXN. El piso de maniobra ($400,000 MXN) se mantiene protegido.' }}
        </p>
      </div>
      <div>
        <h3 class="text-base font-semibold text-highlighted mb-3">Prescripciones Tácticas Sugeridas por el Motor Predictivo</h3>
        <p v-if="!cfoStore.cashFlowForecast?.aiExecutiveSummary?.prescriptions?.length" class="text-sm text-muted">No hay prescripciones disponibles en esta proyección.</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="rx in (cfoStore.cashFlowForecast?.aiExecutiveSummary?.prescriptions || [])" :key="rx.id" class="py-4 flat-section flex flex-col justify-between space-y-3 min-w-0">
            <div>
              <div class="financial-row mb-2">
                <UBadge :color="rx.category === 'RESERVAS' ? 'primary' : rx.category === 'IMPUESTOS' ? 'warning' : 'neutral'" variant="subtle">{{ rx.category }}</UBadge>
                <span class="tabular-nums text-sm font-semibold text-primary">+{{ formatCurrency(rx.impactMxn) }}</span>
              </div>
              <p class="text-sm font-semibold text-highlighted">{{ rx.title }}</p>
              <p class="text-sm text-muted mt-1 leading-relaxed">{{ rx.action }}</p>
            </div>
            <div class="pt-2 border-t border-default financial-row">
              <span class="text-xs text-muted">Impacto en liquidez</span>
              <span class="text-xs font-semibold">Semana 4 - 7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
