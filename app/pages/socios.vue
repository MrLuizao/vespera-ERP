<template>
  <div class="max-w-5xl mx-auto">
    <!-- Encabezado con estado del usuario autenticado -->
    <div class="mb-8 mt-5 flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-4">
        <div class="w-11 h-11 shrink-0 rounded-full bg-white/60 dark:bg-white/[0.08] backdrop-blur-2xl flex items-center justify-center shadow-sm">
          <UIcon
            name="i-lucide-users"
            class="w-5 h-5 text-carbon-800 dark:text-gray-200"
          />
        </div>
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold text-carbon-900 dark:text-white tracking-tight">
            Bóveda de Socios & Firmas
          </h1>
          <p class="text-sage-600 dark:text-gray-300 mt-1 text-sm">
            Gobierno corporativo, autorización mancomunada y control de dividendos
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Badge de Usuario Activo con sesión validada -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-white/[0.08] backdrop-blur-xl border border-white/60 dark:border-white/10 text-xs shadow-xs">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span class="text-sage-600 dark:text-gray-400">Sesión:</span>
          <strong class="text-carbon-900 dark:text-white">{{ activeUser.name }}</strong>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-600 dark:text-[#D4E157] font-semibold">
            {{ activeUser.role }}
          </span>
        </div>

        <!-- Botón para Crear Nueva Solicitud -->
        <UButton
          icon="i-lucide-plus"
          color="primary"
          class="rounded-full cursor-pointer transition-transform active:scale-95 shadow-sm"
          @click="openCreateModal"
        >
          Nueva Solicitud
        </UButton>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- ===================================================================== -->
      <!-- COLUMNA IZQUIERDA: Solicitudes de Gasto & Candado Mancomunado         -->
      <!-- ===================================================================== -->
      <div class="lg:col-span-7">
        <UCard
          class="rounded-[2rem]"
          :ui="{ root: 'bg-white/60 dark:bg-white/[0.07] backdrop-blur-2xl ring-0 divide-y-0 shadow-lg', header: 'p-6 sm:px-7 sm:pt-7 sm:pb-0', body: 'p-6 sm:p-7' }"
        >
          <template #header>
            <div class="flex items-center justify-between flex-wrap gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-[#E879F9] to-[#C084FC] flex items-center justify-center shadow-sm">
                  <UIcon
                    name="i-lucide-shield-check"
                    class="w-5 h-5 text-white"
                  />
                </div>
                <div>
                  <p class="font-semibold text-carbon-900 dark:text-white">
                    Candado Mancomunado (&gt; $10,000 MXN)
                  </p>
                  <p class="text-xs text-sage-600 dark:text-gray-300">
                    Requiere mayoría (3 de 4 firmas de socios) para liberar dispersión SPEI
                  </p>
                </div>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <div
              v-for="req in cfoStore.filteredGovernanceRequests"
              :key="req.id"
              class="rounded-[1.5rem] bg-white/50 dark:bg-black/25 p-5 space-y-4 transition-all"
              :class="req.requestedByPartnerId === currentUserId ? 'ring-1 ring-primary-500/30' : ''"
            >
              <!-- 1. Encabezado de la Solicitud y Badges de Regla de Negocio -->
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="flex items-center flex-wrap gap-2 mb-1.5">
                    <!-- Badge de Estado de Aprobación -->
                    <UBadge
                      :color="req.status === 'PENDING' ? 'warning' : req.status === 'APPROVED' ? 'success' : 'error'"
                      variant="soft"
                      class="font-semibold"
                    >
                      {{ req.status === 'PENDING' ? `Firmas: ${req.approvalsCount}/${req.requiredApprovals}` : req.status === 'APPROVED' ? 'Autorizado SPEI' : 'Rechazado' }}
                    </UBadge>

                    <!-- Badge de Sucursal -->
                    <span class="text-xs text-sage-600 dark:text-gray-300 font-mono">
                      {{ req.venueName }}
                    </span>

                    <!-- Badge de Pertenencia Estricto: Editable vs Informativo -->
                    <UBadge
                      v-if="req.requestedByPartnerId === currentUserId"
                      color="primary"
                      variant="subtle"
                      class="font-bold flex items-center gap-1"
                    >
                      <UIcon name="i-lucide-pencil" class="w-3 h-3 text-primary-500 dark:text-[#D4E157]" />
                      Tu Solicitud (Editable)
                    </UBadge>
                    <UBadge
                      v-else
                      color="neutral"
                      variant="subtle"
                      class="flex items-center gap-1 text-sage-600 dark:text-gray-400"
                    >
                      <UIcon name="i-lucide-lock" class="w-3 h-3" />
                      Informativo (Solo Lectura)
                    </UBadge>
                  </div>

                  <!-- Concepto y Proveedor -->
                  <h3 class="font-bold text-carbon-900 dark:text-white text-base">
                    {{ req.Concept }}
                  </h3>
                  <p class="text-xs text-sage-600 dark:text-gray-300 mt-0.5">
                    Proveedor: <span class="font-medium text-carbon-800 dark:text-gray-200">{{ req.supplier }}</span> · Solicitado por: <span class="font-medium text-carbon-800 dark:text-gray-200">{{ req.requestedBy }}</span>
                  </p>
                </div>

                <!-- Monto en Moneda Nacional -->
                <span class="text-xl font-bold font-mono text-carbon-900 dark:text-white shrink-0">
                  {{ formatCurrency(req.amountMxn) }}
                </span>
              </div>

              <!-- 2. Matriz Informativa de Firmas de Socios (Transparencia Total) -->
              <div class="pt-2 pb-1 border-t border-black/[0.05] dark:border-white/[0.05]">
                <p class="text-[11px] font-semibold uppercase tracking-wider text-sage-500 dark:text-gray-400 mb-2">
                  Registro de Firmas Mancomunadas:
                </p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div
                    v-for="signer in req.signers"
                    :key="signer.partnerId"
                    class="p-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                    :class="signer.status === 'APPROVED'
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium'
                      : signer.status === 'REJECTED'
                        ? 'bg-error-500/10 text-error-700 dark:text-error-300 font-medium'
                        : 'bg-black/[0.03] dark:bg-white/[0.04] text-sage-500 dark:text-gray-400'"
                  >
                    <UIcon
                      :name="signer.status === 'APPROVED' ? 'i-lucide-check-circle' : signer.status === 'REJECTED' ? 'i-lucide-x-circle' : 'i-lucide-clock'"
                      class="w-3.5 h-3.5 shrink-0"
                    />
                    <span class="truncate">{{ signer.partnerName.split(' ')[0] }}</span>
                    <span v-if="signer.partnerId === currentUserId" class="text-[10px] font-bold text-primary-500 ml-auto">(Tú)</span>
                  </div>
                </div>
              </div>

              <!-- 3. Barra de Acciones y Gobernanza Segregada -->
              <div class="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-black/[0.05] dark:border-white/[0.05]">
                <!-- Acciones de Edición (Solo permitidas en LAS SUYAS) -->
                <div>
                  <div v-if="req.requestedByPartnerId === currentUserId && req.status === 'PENDING'" class="flex items-center gap-2">
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="subtle"
                      icon="i-lucide-pencil"
                      class="rounded-full cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800"
                      @click="openEditModal(req)"
                    >
                      Editar Solicitud
                    </UButton>
                    <UButton
                      size="xs"
                      color="error"
                      variant="ghost"
                      icon="i-lucide-trash-2"
                      class="rounded-full cursor-pointer hover:bg-error-50 dark:hover:bg-error-950/40"
                      @click="handleDeleteRequest(req)"
                    >
                      Cancelar
                    </UButton>
                  </div>
                  <div v-else-if="req.requestedByPartnerId !== currentUserId" class="flex items-center gap-1.5 text-xs text-sage-500 dark:text-gray-400 italic">
                    <UIcon name="i-lucide-shield" class="w-3.5 h-3.5" />
                    <span>Informativo · Solicitado por {{ req.requestedBy.split(' ')[0] }}</span>
                  </div>
                </div>

                <!-- Acciones de Firma para el Socio Logueado -->
                <div class="flex items-center gap-2 ml-auto">
                  <!-- Caso 1: Solicitud Pendiente y el usuario logueado NO ha firmado -->
                  <template v-if="req.status === 'PENDING'">
                    <template v-if="getMySignerStatus(req) === 'PENDING'">
                      <UButton
                        color="error"
                        variant="subtle"
                        size="sm"
                        class="rounded-full cursor-pointer transition-all hover:bg-error-100 dark:hover:bg-error-950/40"
                        icon="i-lucide-x-circle"
                        @click="handleVote(req, 'REJECTED')"
                      >
                        Rechazar
                      </UButton>
                      <UButton
                        color="primary"
                        size="sm"
                        class="rounded-full cursor-pointer transition-all active:scale-95"
                        icon="i-lucide-check"
                        @click="handleVote(req, 'APPROVED')"
                      >
                        Firmar como {{ activeUser.name.split(' ')[0] }}
                      </UButton>
                    </template>

                    <!-- Caso 2: Solicitud Pendiente pero el usuario logueado YA firmó -->
                    <div
                      v-else-if="getMySignerStatus(req) === 'APPROVED'"
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#D4E157] text-xs font-semibold"
                    >
                      <UIcon name="i-lucide-check-circle" class="w-3.5 h-3.5" />
                      <span>Has firmado digitalmente</span>
                    </div>

                    <!-- Caso 3: Solicitud Pendiente pero el usuario logueado YA rechazó -->
                    <div
                      v-else-if="getMySignerStatus(req) === 'REJECTED'"
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-500/10 text-error-700 dark:text-error-400 text-xs font-semibold"
                    >
                      <UIcon name="i-lucide-x-circle" class="w-3.5 h-3.5" />
                      <span>Has rechazado esta orden</span>
                    </div>
                  </template>

                  <!-- Caso 4: Solicitud ya Autorizada Globalmente -->
                  <div
                    v-else-if="req.status === 'APPROVED'"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-[#D4E157] text-xs font-bold"
                  >
                    <UIcon name="i-lucide-check-check" class="w-4 h-4" />
                    <span>Autorizado SPEI</span>
                  </div>

                  <!-- Caso 5: Solicitud Rechazada Globalmente -->
                  <div
                    v-else
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-500/15 text-error-600 dark:text-error-400 text-xs font-bold"
                  >
                    <UIcon name="i-lucide-shield-ban" class="w-4 h-4" />
                    <span>Rechazado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- ===================================================================== -->
      <!-- COLUMNA DERECHA: Cap Table, Dividendos y Ficha Informativa             -->
      <!-- ===================================================================== -->
      <div class="lg:col-span-5">
        <UCard
          class="rounded-[2rem]"
          :ui="{ root: 'bg-white/60 dark:bg-white/[0.07] backdrop-blur-2xl ring-0 divide-y-0 shadow-lg', header: 'p-6 sm:px-7 sm:pt-7 sm:pb-0', body: 'p-6 sm:p-7' }"
        >
          <template #header>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-[#8B80F9] to-[#6C5CE7] flex items-center justify-center shadow-sm">
                <UIcon
                  name="i-lucide-users"
                  class="w-5 h-5 text-white"
                />
              </div>
              <div>
                <p class="font-semibold text-carbon-900 dark:text-white">
                  Cap Table & Dividendos
                </p>
                <p class="text-xs text-sage-600 dark:text-gray-300">
                  Estructura accionaria y rendimientos del grupo
                </p>
              </div>
            </div>
          </template>

          <!-- Aviso de Reglas de Gobernanza Activas -->
          <div class="p-3.5 rounded-2xl bg-primary-500/[0.08] dark:bg-white/[0.04] border border-primary-500/20 dark:border-white/10 text-xs mb-4">
            <div class="flex items-start gap-2.5">
              <UIcon name="i-lucide-shield" class="w-4 h-4 text-primary-500 dark:text-[#D4E157] shrink-0 mt-0.5" />
              <div>
                <p class="font-bold text-carbon-900 dark:text-white">
                  Gobernanza & Segregación de Funciones
                </p>
                <p class="text-[11px] text-sage-600 dark:text-gray-300 mt-0.5 leading-relaxed">
                  Has iniciado sesión como <strong class="text-carbon-900 dark:text-white">{{ activeUser.name }}</strong>. Solo puedes editar y autorizar solicitudes asignadas a tu cuenta. La información de los demás socios es de consulta informativa.
                </p>
              </div>
            </div>
          </div>

          <!-- Lista de Socios (Cap Table) -->
          <div class="space-y-3">
            <div
              v-for="p in cfoStore.partners"
              :key="p.id"
              class="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all"
              :class="p.id === currentUserId
                ? 'bg-primary-500/10 dark:bg-[#D4E157]/10 ring-1 ring-primary-500/40 dark:ring-[#D4E157]/30'
                : 'bg-white/50 dark:bg-black/25 opacity-90'"
            >
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                :class="p.id === currentUserId ? 'bg-primary-500 text-white' : 'bg-[#D4E157] text-carbon-900'"
              >
                {{ p.avatarInitials }}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5">
                  <p class="text-sm font-semibold truncate text-carbon-900 dark:text-white">
                    {{ p.name }}
                  </p>
                  <span
                    v-if="p.id === currentUserId"
                    class="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500 text-white font-bold"
                  >
                    Tú
                  </span>
                  <span
                    v-else
                    class="px-2 py-0.5 text-[10px] rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-sage-500 dark:text-gray-400 font-medium"
                  >
                    Informativo
                  </span>
                </div>
                <p class="text-xs text-sage-600 dark:text-gray-300 mt-0.5">
                  {{ p.role }} · {{ p.equityPct }}%
                </p>
              </div>

              <div class="text-right shrink-0">
                <p class="text-sm font-bold font-mono text-posteal-600 dark:text-[#D4E157]">
                  {{ formatCurrency(Math.round(cfoStore.pnlSummary.netDistributableProfit * (p.equityPct / 100))) }}
                </p>
                <p class="text-[11px] text-sage-500 dark:text-gray-400">
                  Dividendo
                </p>
              </div>
            </div>
          </div>

          <!-- Información Fiscal CUFIN y Blindaje Legal (Art. 140 LISR) -->
          <div class="mt-5 pt-4 border-t border-black/[0.05] dark:border-white/[0.05] space-y-2 text-xs">
            <div class="flex justify-between text-sage-600 dark:text-gray-300">
              <span>Saldo CUFIN Disponible:</span>
              <span class="font-bold text-carbon-900 dark:text-white font-mono">$4,850,000 MXN</span>
            </div>
            <div class="flex justify-between text-sage-600 dark:text-gray-300">
              <span>Retención Art. 140 LISR:</span>
              <span class="font-semibold text-carbon-900 dark:text-white">10% (Sin impuesto adicional PM)</span>
            </div>
            <div class="flex justify-between text-sage-600 dark:text-gray-300">
              <span>Poderes Notariales & Asambleas:</span>
              <span class="text-emerald-500 font-semibold flex items-center gap-1">
                <UIcon name="i-lucide-check-circle" class="w-3.5 h-3.5" /> Al día (Vigencia 2027)
              </span>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL: Editar Solicitud Propia                                            -->
    <!-- ========================================================================= -->
    <UModal v-model:open="isEditModalOpen" :ui="{ content: 'rounded-[2rem] bg-white/95 dark:bg-carbon-900/95 backdrop-blur-2xl ring-0 shadow-2xl max-w-lg' }">
      <template #content>
        <div class="p-7 space-y-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-primary-500/15 flex items-center justify-center">
                <UIcon name="i-lucide-pencil" class="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h3 class="font-bold text-carbon-900 dark:text-white text-base">
                  Editar Tu Solicitud de Gasto
                </h3>
                <p class="text-xs text-sage-600 dark:text-gray-400">
                  Modifica los parámetros antes de que concluya la votación
                </p>
              </div>
            </div>
            <button type="button" class="text-sage-400 hover:text-carbon-900 dark:hover:text-white cursor-pointer" @click="isEditModalOpen = false">
              <UIcon name="i-lucide-x" class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-carbon-800 dark:text-gray-200 mb-1">Concepto del Gasto</label>
              <UInput v-model="editForm.Concept" class="w-full" size="lg" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-carbon-800 dark:text-gray-200 mb-1">Proveedor Autorizado</label>
              <UInput v-model="editForm.supplier" class="w-full" size="lg" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-carbon-800 dark:text-gray-200 mb-1">Importe ($ MXN)</label>
                <UInput v-model.number="editForm.amountMxn" type="number" class="w-full" size="lg" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-carbon-800 dark:text-gray-200 mb-1">Categoría</label>
                <USelect v-model="editForm.category" :items="categoryItems" class="w-full cursor-pointer" size="lg" />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-black/[0.05] dark:border-white/[0.05]">
            <UButton color="neutral" variant="subtle" class="rounded-full cursor-pointer" @click="isEditModalOpen = false">
              Cancelar
            </UButton>
            <UButton color="primary" class="rounded-full cursor-pointer" @click="saveEditRequest">
              Guardar Cambios
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ========================================================================= -->
    <!-- MODAL: Crear Nueva Solicitud de Gasto                                     -->
    <!-- ========================================================================= -->
    <UModal v-model:open="isCreateModalOpen" :ui="{ content: 'rounded-[2rem] bg-white/95 dark:bg-carbon-900/95 backdrop-blur-2xl ring-0 shadow-2xl max-w-lg' }">
      <template #content>
        <div class="p-7 space-y-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                <UIcon name="i-lucide-plus-circle" class="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 class="font-bold text-carbon-900 dark:text-white text-base">
                  Nueva Solicitud de Gasto Mancomunado
                </h3>
                <p class="text-xs text-sage-600 dark:text-gray-400">
                  Se registrará a tu nombre ({{ activeUser.name }})
                </p>
              </div>
            </div>
            <button type="button" class="text-sage-400 hover:text-carbon-900 dark:hover:text-white cursor-pointer" @click="isCreateModalOpen = false">
              <UIcon name="i-lucide-x" class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-carbon-800 dark:text-gray-200 mb-1">Concepto del Gasto</label>
              <UInput v-model="createForm.Concept" placeholder="Ej. Equipo de Refrigeración o Insumo Especial" class="w-full" size="lg" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-carbon-800 dark:text-gray-200 mb-1">Proveedor</label>
              <UInput v-model="createForm.supplier" placeholder="Razón Social del Proveedor" class="w-full" size="lg" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-carbon-800 dark:text-gray-200 mb-1">Importe ($ MXN)</label>
                <UInput v-model.number="createForm.amountMxn" type="number" placeholder="0" class="w-full" size="lg" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-carbon-800 dark:text-gray-200 mb-1">Sucursal</label>
                <USelect v-model="createForm.venueId" :items="venueSelectItems" class="w-full cursor-pointer" size="lg" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-carbon-800 dark:text-gray-200 mb-1">Categoría</label>
              <USelect v-model="createForm.category" :items="categoryItems" class="w-full cursor-pointer" size="lg" />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-black/[0.05] dark:border-white/[0.05]">
            <UButton color="neutral" variant="subtle" class="rounded-full cursor-pointer" @click="isCreateModalOpen = false">
              Cancelar
            </UButton>
            <UButton color="primary" class="rounded-full cursor-pointer" @click="submitCreateRequest">
              Emitir Solicitud
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useCfoStore, type GovernancePaymentRequest } from '~/stores/cfo'
import { useAuthStore } from '~/stores/auth'

const cfoStore = useCfoStore()
const authStore = useAuthStore()
const { confirm } = useConfirmModal()
const { showSuccess } = useSuccessModal()
const { showLoader, hideLoader } = useLoader()

// Identificar al socio autenticado
const currentUserId = computed(() => authStore.user?.id || 'luis')
const activeUser = computed(() => {
  return authStore.user || {
    id: 'luis',
    name: 'Luis Morales',
    role: 'Socio Director',
    equityPct: 35
  }
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(val)
}

function getMySignerStatus(req: GovernancePaymentRequest) {
  const signer = req.signers?.find(s => s.partnerId === currentUserId.value)
  return signer?.status || 'PENDING'
}

// ============================================================================
// MODAL: Editar Solicitud Propia
// ============================================================================
const isEditModalOpen = ref(false)
const editForm = reactive({
  id: '',
  Concept: '',
  supplier: '',
  amountMxn: 0,
  category: 'CAPEX / EQUIPO' as const
})

function openEditModal(req: GovernancePaymentRequest) {
  // Regla: Solo el creador puede editar
  if (req.requestedByPartnerId !== currentUserId.value) {
    alert('No tienes permisos para editar esta solicitud. Solo puedes modificar las solicitudes creadas por tu cuenta.')
    return
  }
  editForm.id = req.id
  editForm.Concept = req.Concept
  editForm.supplier = req.supplier
  editForm.amountMxn = req.amountMxn
  editForm.category = req.category as any
  isEditModalOpen.value = true
}

function saveEditRequest() {
  if (!editForm.Concept || !editForm.supplier || editForm.amountMxn <= 0) {
    alert('Por favor completa todos los campos con valores válidos.')
    return
  }

  cfoStore.updateGovernanceRequest(editForm.id, {
    Concept: editForm.Concept,
    supplier: editForm.supplier,
    amountMxn: editForm.amountMxn,
    category: editForm.category
  })

  isEditModalOpen.value = false
  showSuccess({
    title: 'Solicitud Actualizada',
    description: 'Los cambios fueron registrados exitosamente en la bóveda de gobierno corporativo.',
    icon: 'i-lucide-check-circle',
    details: [
      { label: 'Concepto', value: editForm.Concept },
      { label: 'Importe', value: formatCurrency(editForm.amountMxn) }
    ]
  })
}

// ============================================================================
// MODAL: Crear Nueva Solicitud
// ============================================================================
const isCreateModalOpen = ref(false)
const createForm = reactive({
  Concept: '',
  supplier: '',
  amountMxn: 0,
  venueId: 'woodnest' as const,
  category: 'CAPEX / EQUIPO' as const
})

const categoryItems = [
  { label: 'CAPEX / EQUIPO', value: 'CAPEX / EQUIPO' },
  { label: 'PROVEEDOR EXTRA', value: 'PROVEEDOR EXTRA' },
  { label: 'MANTENIMIENTO', value: 'MANTENIMIENTO' },
  { label: 'EVENTO ESPECIAL', value: 'EVENTO ESPECIAL' }
]

const venueSelectItems = [
  { label: 'WoodNest · Town Square', value: 'woodnest' },
  { label: 'Kuroi · Av. Tecnológico', value: 'kuroi' },
  { label: 'Ámbar · Providencia', value: 'ambar' }
]

function openCreateModal() {
  createForm.Concept = ''
  createForm.supplier = ''
  createForm.amountMxn = 0
  createForm.venueId = 'woodnest'
  createForm.category = 'CAPEX / EQUIPO'
  isCreateModalOpen.value = true
}

function submitCreateRequest() {
  if (!createForm.Concept || !createForm.supplier || createForm.amountMxn <= 0) {
    alert('Por favor completa todos los campos con valores válidos.')
    return
  }

  const venueNames: Record<string, string> = {
    woodnest: 'WoodNest · Town Square',
    kuroi: 'Kuroi · Av. Tecnológico',
    ambar: 'Ámbar · Providencia'
  }

  cfoStore.createGovernanceRequest({
    venueId: createForm.venueId,
    venueName: venueNames[createForm.venueId] || 'Vespera Hub',
    Concept: createForm.Concept,
    supplier: createForm.supplier,
    amountMxn: createForm.amountMxn,
    category: createForm.category,
    requestedBy: `${activeUser.value.name} (${activeUser.value.role})`,
    requestedByPartnerId: currentUserId.value
  })

  isCreateModalOpen.value = false
  showSuccess({
    title: 'Solicitud Emitida',
    description: 'La orden fue registrada a tu nombre con tu firma aprobatoria inicial (1/3 firmas).',
    icon: 'i-lucide-check-circle',
    details: [
      { label: 'Concepto', value: createForm.Concept },
      { label: 'Importe', value: formatCurrency(createForm.amountMxn) },
      { label: 'Solicitante', value: activeUser.value.name }
    ]
  })
}

// ============================================================================
// CANCELAR / ELIMINAR SOLICITUD PROPIA
// ============================================================================
async function handleDeleteRequest(req: GovernancePaymentRequest) {
  if (req.requestedByPartnerId !== currentUserId.value) {
    alert('Solo puedes cancelar solicitudes emitidas por tu propia cuenta.')
    return
  }

  const confirmed = await confirm({
    title: '¿Cancelar Solicitud de Gasto?',
    description: 'La orden de pago será eliminada del candado mancomunado:',
    icon: 'i-lucide-trash-2',
    color: 'warning',
    confirmText: 'Sí, Cancelar Solicitud',
    details: [
      { label: 'Concepto', value: req.Concept },
      { label: 'Importe', value: formatCurrency(req.amountMxn) }
    ]
  })

  if (!confirmed) return

  cfoStore.deleteGovernanceRequest(req.id)
  showSuccess({
    title: 'Solicitud Cancelada',
    description: 'La solicitud ha sido retirada de la bóveda de socios.',
    icon: 'i-lucide-info',
    details: [
      { label: 'Folio', value: req.cfdiUuid }
    ]
  })
}

// ============================================================================
// VOTACIÓN / FIRMA MANCOMUNADA
// ============================================================================
async function handleVote(req: GovernancePaymentRequest, decision: 'APPROVED' | 'REJECTED') {
  const isApprove = decision === 'APPROVED'
  const confirmed = await confirm({
    title: isApprove ? '¿Firmar y Autorizar Pago?' : '¿Rechazar Gasto?',
    description: isApprove
      ? `Estás emitiendo tu firma digital como ${activeUser.value.name} (${activeUser.value.role}):`
      : `Registrarás tu voto de rechazo como ${activeUser.value.name}:`,
    icon: isApprove ? 'i-lucide-shield-check' : 'i-lucide-x-circle',
    color: isApprove ? 'success' : 'warning',
    confirmText: isApprove ? 'Firmar Digitalmente' : 'Confirmar Rechazo',
    details: [
      { label: 'Concepto', value: req.Concept },
      { label: 'Proveedor', value: req.supplier },
      { label: 'Importe', value: formatCurrency(req.amountMxn) },
      { label: 'Socio Firmante', value: `${activeUser.value.name} (${activeUser.value.role})` }
    ]
  })

  if (!confirmed) return

  showLoader(isApprove ? 'Registrando tu firma mancomunada...' : 'Registrando rechazo...')
  setTimeout(() => {
    cfoStore.handleGovernanceVote(req.id, decision, currentUserId.value)
    hideLoader()
    showSuccess({
      title: isApprove ? 'Firma Mancomunada Registrada' : 'Voto de Rechazo Registrado',
      description: isApprove
        ? 'Tu firma fue estampada en la orden de pago.'
        : 'Tu voto fue computado en el registro de gobierno corporativo.',
      icon: isApprove ? 'i-lucide-check-circle' : 'i-lucide-shield',
      details: [
        { label: 'Folio XML', value: req.cfdiUuid },
        { label: 'Importe', value: formatCurrency(req.amountMxn) },
        { label: 'Firmante', value: activeUser.value.name }
      ]
    })
  }, 500)
}
</script>
