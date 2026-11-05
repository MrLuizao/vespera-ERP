<template>
  <div class="space-y-6">
    <!-- Encabezado limpio sin bordes blancos -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-5">
      <div class="flex items-center gap-4">
        <div
          class="w-11 h-11 shrink-0 icon-tile flex items-center justify-center">
          <UIcon name="i-lucide-layout-dashboard" class="w-5 h-5 text-carbon-800 dark:text-gray-200" />
        </div>
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold text-carbon-900 dark:text-white tracking-tight">
            Panel Financiero
          </h1>
          <p class="text-xs text-sage-600 dark:text-gray-300 mt-0.5">
            {{ cfoStore.activeFinancials.name }}
          </p>
        </div>
      </div>

      <!-- Pill de Sincronización en Vivo con Vespera Hub API -->
      <div
        class="flex flex-wrap items-center gap-2 self-start sm:self-auto text-muted" role="status">
        <span class="text-xs font-medium text-sage-700 dark:text-gray-300">
          {{ cfoStore.lastReservationsSync }}
        </span>
        <UButton color="neutral" variant="outline"
          class="ml-1"
          :disabled="cfoStore.isSyncingReservations" @click="cfoStore.fetchReservations()">
          <UIcon name="i-lucide-refresh-cw" class="w-3.5 h-3.5"
            :class="{ 'animate-spin': cfoStore.isSyncingReservations }" />
          <span>{{ cfoStore.isSyncingReservations ? 'Sincronizando...' : 'Actualizar' }}</span>
        </UButton>
      </div>
    </div>

    <!-- <p class="text-sage-600 dark:text-gray-300 -mt-6 mb-10 text-sm sm:text-base">
      Bienvenido, {{ cfoStore.currentPartner.name }} · {{ cfoStore.activeFinancials.name }}
    </p> -->

    <!-- Tarjeta Inferior Glassmorphism: Punto de Equilibrio (Sin ring blanco) -->
    <UCard :ui="{ root: 'glass-panel ring-0 divide-y-0', body: 'p-5 sm:p-6' }">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 shrink-0 icon-tile flex items-center justify-center">
            <UIcon name="i-lucide-flame" class="w-5 h-5" />
          </div>
          <div>
            <p class="font-semibold text-carbon-900 dark:text-white">
              Punto de Equilibrio · Superado el Día {{ cfoStore.activeFinancials.breakEvenDayReached }}
            </p>
            <p class="text-xs text-sage-600 dark:text-gray-300">
              Costos fijos cubiertos al 100% ({{ formatCurrency(cfoStore.activeFinancials.breakEvenTarget) }})
            </p>
          </div>
        </div>

        <UBadge color="success" variant="soft" size="lg" class="rounded-full font-semibold self-start sm:self-auto">
          Excedente: +{{ formatCurrency(cfoStore.pnlSummary.surplusAboveBreakEven) }}
        </UBadge>
      </div>

      <div class="relative h-3.5 w-full rounded-full bg-black/[0.06] dark:bg-black/40 overflow-hidden mb-2.5">
        <div
          aria-hidden="true" class="h-full rounded-full bg-royal-500"
          style="width: 88%" />
      </div>

      <div class="financial-row text-sm text-muted font-medium">
        <span>Meta: {{ formatCurrency(cfoStore.activeFinancials.breakEvenTarget) }}</span>
        <span class="text-carbon-900 dark:text-white font-semibold">
          Ventas Actuales: {{ formatCurrency(cfoStore.pnlSummary.grossRevenue) }}
        </span>
      </div>
    </UCard>

    <!-- Contenedor Principal Glassmorphism (Con borde blanco muy sutil en modo oscuro) -->
    <div
      class="mt-8">
      <div class="flex items-center justify-between mb-5 px-2">
        <h2 class="font-semibold text-carbon-900 dark:text-white">
          Resumen Directivo
        </h2>
        <span class="text-xs font-medium text-sage-700 dark:text-gray-300">
          Participación {{ cfoStore.currentPartner.equityPct }}%
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <NuxtLink v-for="op in cards" :key="op.title" :to="op.to"
          class="glass-panel p-5 sm:p-6 transition-colors duration-150 hover:border-primary group min-w-0">
          <div class="flex items-start justify-between gap-3 mb-6">
            <div>
              <p class="text-xs font-medium text-sage-600 dark:text-gray-300 mb-1">
                {{ op.subtitle }}
              </p>
              <p class="text-[28px] font-semibold leading-tight tracking-tight tabular-nums text-highlighted">
                {{ op.metric }}
              </p>
            </div>
            <div
              class="w-11 h-11 shrink-0 flex items-center justify-center text-muted">
              <UIcon name="i-lucide-arrow-up-right" class="w-5 h-5 text-carbon-900 dark:text-white" />
            </div>
          </div>

          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 shrink-0 icon-tile flex items-center justify-center">
              <UIcon :name="op.icon" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-highlighted">
                {{ op.title }}
              </h3>
              <p class="text-xs text-sage-600 dark:text-gray-300 mt-0.5">
                {{ op.description }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useCfoStore } from '~/stores/cfo'

const cfoStore = useCfoStore()

onMounted(() => {
  cfoStore.fetchReservations()
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(val)
}

const cards = computed(() => [
  {
    subtitle: `Mi Dividendo (${cfoStore.currentPartner.equityPct}%)`,
    metric: formatCurrency(cfoStore.partnerDividendMxn),
    title: 'Bóveda del Socio',
    description: `+${formatCurrency(cfoStore.partnerProjectedWeekendBonusMxn)} proyectados este fin de semana`,
    icon: 'i-lucide-wallet',
    to: '/pulso',
  },
  {
    subtitle: `Margen Neto ${cfoStore.pnlSummary.netMarginPct}%`,
    metric: formatCurrency(cfoStore.pnlSummary.netDistributableProfit),
    title: 'Estado de Resultados',
    description: 'Ver cascada de ventas, costos fijos y utilidad libre',
    icon: 'i-lucide-trending-up',
    to: '/pulso',
  },
  {
    subtitle: 'Auditoría SAT CFDI 4.0',
    metric: `${cfoStore.filteredAnomalies.filter(a => a.status === 'DETECTED').length} Alertas XML`,
    title: 'Proveedores & Costos',
    description: `${formatCurrency(cfoStore.pendingLeakageAmount)}/mes detectados en sobreprecios`,
    icon: 'i-lucide-file-search',
    to: '/sat',
  },
  {
    subtitle: 'Gobierno Corporativo',
    metric: `${cfoStore.pendingGovernanceCount} Por Firmar`,
    title: 'Socios & Pagos',
    description: 'Autorización mancomunada de gastos y Cap Table',
    icon: 'i-lucide-shield-check',
    to: '/socios',
  }
])
</script>
