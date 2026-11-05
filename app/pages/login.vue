<template>
  <div class="w-full">
    <!-- Contenedor Maestro con Liquid Glassmorphism Puro (2 Columnas Split) -->
    <div
      class="w-full glass-panel overflow-hidden grid grid-cols-1 lg:grid-cols-2 lg:min-h-[640px]">

      <!-- ========================================================================= -->
      <!-- COLUMNA IZQUIERDA: Formulario de Inicio de Sesión Vía Credenciales        -->
      <!-- ========================================================================= -->
      <div
        class="p-5 sm:p-10 lg:p-12 flex flex-col justify-between">
        <!-- 1. Header Superior: Logo de Vespera Hub ERP y Selector de Región / Tema -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <div class="leading-tight">
              <span class="font-bold text-base tracking-tight text-carbon-900 dark:text-white">
                Vespera<span class="text-primary">ERP</span>
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UColorModeButton
              aria-label="Cambiar tema" class="min-w-11" />
          </div>
        </div>

        <!-- 2. Bloque Central: Saludo y Formulario de Credenciales con Vidrio Escarchado -->
        <div class="my-auto py-8 max-w-sm w-full mx-auto">
          <div class="mb-8">
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
            <UFormField name="identifier" label="Correo electrónico o usuario">
              <div
                class="rounded-xl bg-elevated border border-accented focus-within:ring-2 focus-within:ring-primary">
                <UInput v-model="state.identifier" placeholder="Tu correo electrónico o usuario" icon="i-lucide-mail"
                  autocomplete="username" size="xl" variant="none" class="w-full" :ui="{
                    base: 'bg-transparent text-default placeholder:text-muted py-3 px-4 rounded-xl pl-11'
                  }" />
              </div>
            </UFormField>

            <!-- Campo 2: Contraseña con Ojo para Ver/Ocultar (Cápsula Glassmorphism) -->
            <UFormField name="password" label="Contraseña">
              <div
                class="relative rounded-xl bg-elevated border border-accented focus-within:ring-2 focus-within:ring-primary">
                <UInput v-model="state.password" :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password" placeholder="Tu contraseña de socio" icon="i-lucide-lock" size="xl" variant="none" class="w-full" :ui="{
                    base: 'bg-transparent text-default placeholder:text-muted py-3 px-4 rounded-xl pl-11 pr-12'
                  }" />
                <UButton type="button" color="neutral" variant="ghost"
                  class="absolute right-0 top-1/2 -translate-y-1/2 min-w-11"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="showPassword"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" @click="showPassword = !showPassword" />
              </div>
            </UFormField>

            <!-- Enlace "¿Olvidaste tu contraseña?" -->
            <div class="flex justify-start pt-1">
              <button type="button"
                class="text-sm font-semibold text-primary hover:underline"
                @click="handleForgotPassword">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <!-- Botón Principal "Iniciar sesión" de Alto Contraste -->
            <div class="pt-3">
              <UButton type="submit" :disabled="loading" :loading="loading" color="primary" block size="xl">
                <span>{{ loading ? 'Verificando acceso...' : 'Iniciar sesión' }}</span>
              </UButton>
            </div>
          </UForm>

          <!-- Contacto de Soporte -->
          <div class="text-center mt-7 space-y-1">
            <p class="text-xs text-sage-600 dark:text-gray-400">
              ¿No tienes cuenta o necesitas asistencia?
            </p>
            <a href="mailto:soporte@vesperahub.mx"
              class="text-sm font-semibold text-primary hover:underline block">
              soporte@vesperahub.mx
            </a>
          </div>

          <!-- Mensaje de Error si falla la autenticación -->
          <div v-if="errorMessage" role="alert"
            class="mt-4 p-4 rounded-xl bg-error-500/10 border border-error-500/25 text-error-700 dark:text-error-300 flex items-start gap-2.5 text-sm">
            <UIcon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0 mt-0.5" />
            <div class="flex-1">
              <p class="font-semibold">Credenciales Incorrectas</p>
              <p class="mt-0.5">{{ errorMessage }}</p>
            </div>
            <UButton type="button" color="error" variant="ghost" aria-label="Cerrar mensaje de error" icon="i-lucide-x" class="min-w-11" @click="errorMessage = ''" />
          </div>

        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- COLUMNA DERECHA: Imagen de Fondo con Tarjeta Glassmorphism Flotante        -->
      <!-- ========================================================================= -->
      <div class="relative hidden lg:flex items-center justify-center p-8 lg:p-10 overflow-hidden bg-carbon-900">
        <!-- Imagen de Fondo Ultra-Lujo (Restaurante / Fuego & Cava) -->
        <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=85"
          alt="Vespera Hub Ambiance"
          class="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.78]" />
        <!-- Overlay Gradiente Atmosférico -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/60 pointer-events-none" />

        <!-- Tarjeta Flotante Glassmorphism Escarchada Ultra-Translúcida -->
        <div
          class="relative z-10 w-full max-w-md text-white">
          <!-- Destello especular de refracción -->

          <!-- Glifo Circular Minimalista de Estado (estilo BonSanté) -->
          <!-- <div
            class="w-8 h-8 rounded-full border-2 border-white/70 border-t-transparent animate-spin-slow mb-6 opacity-90" /> -->

          <!-- Titular Principal de Impacto con Gradiente de Oro Líquido -->
          <h2
            class="text-2xl sm:text-[28px] font-extrabold leading-tight tracking-tight mb-4 drop-shadow-md text-white">
            El estándar de oro en
            <span class="text-white">
              Dirección Financiera
            </span>
            y Control Estratégico
          </h2>

          <!-- Párrafo Informativo con Énfasis en Métricas Financieras del CFO -->
          <p class="text-sm sm:text-[16px] text-white/95 leading-tighter font-normal drop-shadow-sm mt-6 mb-6">
            Supervisión ejecutiva en tiempo real del <strong class="text-white font-semibold">flujo de
              efectivo</strong>, análisis continuo de <strong class="text-white font-semibold">márgenes de
              rentabilidad</strong>, optimización de tesorería y <strong class="text-white font-semibold">blindaje
              fiscal ante el SAT</strong>.
          </p>

          <div class="border border-white/30 mt-4"></div>
          <!-- 3. Footer Inferior -->
          <div class="pt-4 text-center">
            <p class="text-xs text-white">
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
