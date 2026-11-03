<template>
  <div class="relative min-h-screen glass-mesh-bg flex flex-col justify-center items-center p-3 sm:p-6 md:p-8 transition-colors duration-300 overflow-hidden">
    <!-- Orbes de refracción atmosférica para potenciar el efecto Liquid Glassmorphism -->
    <div class="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#8B80F9]/40 to-[#635BFF]/30 blur-[110px] pointer-events-none" />
    <div class="absolute top-1/3 -right-24 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-[#FFB347]/35 to-[#FF8C00]/25 blur-[130px] pointer-events-none" />
    <div class="absolute -bottom-20 left-1/4 w-[30rem] h-[30rem] rounded-full bg-gradient-to-br from-[#4CD97B]/30 to-[#67B8F7]/25 blur-[120px] pointer-events-none" />

    <div class="relative z-10 w-full max-w-5xl">
      <slot />
    </div>
  </div>
</template>
