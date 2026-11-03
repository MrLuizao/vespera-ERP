<template>
  <div class="w-full">
    <!-- Contenedor Maestro con Liquid Glassmorphism Puro (2 Columnas Split) -->
    <div
      class="w-full rounded-[2.5rem] overflow-hidden border border-white/70 dark:border-white/15 bg-white/40 dark:bg-[#0B131B]/45 backdrop-blur-3xl shadow-[0_30px_80px_rgba(15,23,42,0.12),inset_0_1px_2px_rgba(255,255,255,0.85)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.15)] grid grid-cols-1 md:grid-cols-2 min-h-[640px]">

      <!-- ========================================================================= -->
      <!-- COLUMNA IZQUIERDA: Formulario de Inicio de Sesión Vía Credenciales        -->
      <!-- ========================================================================= -->
      <div
        class="p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-gradient-to-br from-white/40 via-white/15 to-transparent dark:from-white/[0.04] dark:via-transparent dark:to-transparent">
        <!-- 1. Header Superior: Logo de Vespera Hub ERP y Selector de Región / Tema -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <!-- <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB347] to-[#FF8C00] flex items-center justify-center shadow-md shadow-amber-500/20">
              <UIcon
                name="i-lucide-flame"
                class="w-4 h-4 text-carbon-950"
              />
            </div> -->
            <div class="leading-tight">
              <span class="font-bold text-base tracking-tight text-carbon-900 dark:text-white">
                Vespera<span class="text-primary-500 dark:text-[#D4E157]">ERP</span>
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/15 text-xs font-semibold text-carbon-800 dark:text-gray-200 shadow-xs">
              <span>🇲🇽</span>
              <span class="text-[11px] font-mono tracking-wider">MXN</span>
            </div> -->
            <UColorModeButton
              class="rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/15 hover:bg-white/80 dark:hover:bg-white/20 shadow-xs" />
          </div>
        </div>

        <!-- 2. Bloque Central: Saludo y Formulario de Credenciales con Vidrio Escarchado -->
        <div class="my-auto py-8 max-w-sm w-full mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-carbon-900 dark:text-white tracking-tight">
              ¡Bienvenido!
            </h1>
            <p class="text-xs sm:text-sm text-sage-600 dark:text-gray-300 mt-2 leading-relaxed">
              Para ingresar a la dirección financiera y bóveda de socios, ingresa tus credenciales autorizadas.
            </p>
          </div>

          <!-- Formulario Estrictamente por Credenciales -->
          <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
            <!-- Campo 1: Usuario o Correo Electrónico (Cápsula Glassmorphism) -->
            <UFormField name="identifier">
              <div
                class="rounded-2xl bg-white/55 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/80 dark:border-white/15 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_4px_16px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.2)] focus-within:ring-2 focus-within:ring-primary-400/40 focus-within:border-primary-400 transition-all">
                <UInput v-model="state.identifier" placeholder="Tu correo electrónico o usuario" icon="i-lucide-mail"
                  size="xl" variant="none" class="w-full" :ui="{
                    base: 'bg-transparent text-carbon-900 dark:text-white placeholder:text-sage-500 dark:placeholder:text-gray-400 py-3.5 px-4 rounded-2xl pl-11'
                  }" />
              </div>
            </UFormField>

            <!-- Campo 2: Contraseña con Ojo para Ver/Ocultar (Cápsula Glassmorphism) -->
            <UFormField name="password">
              <div
                class="relative rounded-2xl bg-white/55 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/80 dark:border-white/15 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_4px_16px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.2)] focus-within:ring-2 focus-within:ring-primary-400/40 focus-within:border-primary-400 transition-all">
                <UInput v-model="state.password" :type="showPassword ? 'text' : 'password'"
                  placeholder="Tu contraseña de socio" icon="i-lucide-lock" size="xl" variant="none" class="w-full" :ui="{
                    base: 'bg-transparent text-carbon-900 dark:text-white placeholder:text-sage-500 dark:placeholder:text-gray-400 py-3.5 px-4 rounded-2xl pl-11 pr-11'
                  }" />
                <button type="button"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-sage-500 hover:text-carbon-900 dark:hover:text-white transition-colors cursor-pointer"
                  tabindex="-1" @click="showPassword = !showPassword">
                  <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-4 h-4" />
                </button>
              </div>
            </UFormField>

            <!-- Enlace "¿Olvidaste tu contraseña?" -->
            <div class="flex justify-start pt-1">
              <button type="button"
                class="text-xs font-semibold text-emerald-600 dark:text-[#D4E157] hover:underline cursor-pointer"
                @click="handleForgotPassword">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <!-- Botón Principal "Iniciar sesión" de Alto Contraste -->
            <div class="pt-3">
              <button type="submit" :disabled="loading"
                class="w-full py-4 px-6 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_12px_28px_rgba(15,23,42,0.25)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.32)] active:scale-[0.98] flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white dark:bg-white dark:hover:bg-gray-100 dark:text-carbon-950">
                <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
                <span>{{ loading ? 'Verificando acceso...' : 'Iniciar sesión' }}</span>
              </button>
            </div>
          </UForm>

          <!-- Contacto de Soporte -->
          <div class="text-center mt-7 space-y-1">
            <p class="text-xs text-sage-600 dark:text-gray-400">
              ¿No tienes cuenta o necesitas asistencia?
            </p>
            <a href="mailto:soporte@vesperahub.mx"
              class="text-xs font-semibold text-emerald-600 dark:text-[#D4E157] hover:underline block">
              soporte@vesperahub.mx
            </a>
          </div>

          <!-- Mensaje de Error si falla la autenticación -->
          <div v-if="errorMessage"
            class="mt-2 p-2.5 rounded-2xl bg-error-500/10 backdrop-blur-xl border border-error-500/25 text-error-700 dark:text-error-300 flex items-start gap-2.5 text-xs animate-shake shadow-xs">
            <UIcon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0 mt-0.5" />
            <div class="flex-1">
              <p class="font-semibold">Credenciales Incorrectas</p>
              <p class="mt-0.5">{{ errorMessage }}</p>
            </div>
            <button type="button" class="text-error-400 hover:text-error-200 cursor-pointer" @click="errorMessage = ''">
              <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- COLUMNA DERECHA: Imagen de Fondo con Tarjeta Glassmorphism Flotante        -->
      <!-- ========================================================================= -->
      <div class="relative hidden md:flex items-center justify-center p-8 lg:p-12 overflow-hidden bg-[#16202A]">
        <!-- Imagen de Fondo Ultra-Lujo (Restaurante / Fuego & Cava) -->
        <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=85"
          alt="Vespera Hub Ambiance"
          class="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.78]" />
        <!-- Overlay Gradiente Atmosférico -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/60 pointer-events-none" />

        <!-- Tarjeta Flotante Glassmorphism Escarchada Ultra-Translúcida -->
        <div
          class="relative z-10 w-full max-w-md rounded-[32px] p-8 sm:p-9 bg-white/[0.08] dark:bg-black/25 backdrop-blur-2xl border border-white/30 dark:border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.45),inset_0_1px_2px_rgba(255,255,255,0.5)] text-white overflow-hidden">
          <!-- Destello especular de refracción -->
          <div class="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/15 blur-2xl pointer-events-none" />

          <!-- Glifo Circular Minimalista de Estado (estilo BonSanté) -->
          <!-- <div
            class="w-8 h-8 rounded-full border-2 border-white/70 border-t-transparent animate-spin-slow mb-6 opacity-90" /> -->

          <!-- Titular Principal de Impacto con Gradiente de Oro Líquido -->
          <h2
            class="text-2xl sm:text-[28px] font-extrabold leading-tight tracking-tight mb-4 drop-shadow-md text-white">
            El estándar de oro en
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB347] via-[#FFA000] to-[#D4E157]">
              Dirección Financiera
            </span>
            y Control Estratégico
          </h2>

          <!-- Párrafo Informativo con Énfasis en Métricas Financieras del CFO -->
          <p class="text-sm sm:text-[16px] text-white/95 leading-tighter font-normal drop-shadow-sm mt-6 mb-6">
            Supervisión ejecutiva en tiempo real del <strong class="text-white font-semibold">flujo de
              efectivo</strong>, análisis continuo de <strong class="text-[#FFD580] font-semibold">márgenes de
              rentabilidad</strong>, optimización de tesorería y <strong class="text-emerald-300 font-semibold">blindaje
              fiscal ante el SAT</strong>.
          </p>

          <div class="border border-white/30 mt-4"></div>
          <!-- 3. Footer Inferior -->
          <div class="pt-4 text-center">
            <p class="text-[11px] text-sage-500 dark:text-gray-400">
              Todos los derechos reservados Vespera Hub ERP 2026
            </p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const { showLoader, hideLoader } = useLoader()

const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const schema = z.object({
  identifier: z.string().min(1, 'Ingresa tu correo o usuario'),
  password: z.string().min(1, 'Ingresa tu contraseña')
})

const state = reactive({
  identifier: 'luis@vesperahub.mx',
  password: 'password2026'
})

async function onSubmit() {
  loading.value = true
  errorMessage.value = ''
  showLoader('Verificando credenciales...')

  try {
    const result = await authStore.login(state.identifier, state.password)
    if (result.success) {
      await navigateTo('/main')
    } else {
      errorMessage.value = result.error || 'Verifica tu usuario y contraseña.'
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Error inesperado al conectar con el servidor.'
  } finally {
    hideLoader()
    loading.value = false
  }
}

function handleForgotPassword() {
  alert('Para restablecer tu contraseña de socio o solicitar nuevas credenciales, contacta a la Dirección de Finanzas en soporte@vesperahub.mx')
}
</script>
