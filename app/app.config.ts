export default defineAppConfig({
  ui: {
    colors: {
      primary: 'royal',
      neutral: 'sage',
      success: 'royal',
      info: 'sage',
      warning: 'amber'
    },
    input: {
      slots: {
        base: 'rounded-xl min-h-11 text-base bg-elevated ring-accented'
      }
    },
    inputNumber: {
      slots: {
        base: 'rounded-xl min-h-11 text-base bg-elevated ring-accented'
      }
    },
    button: {
      slots: { base: 'min-h-11 rounded-xl font-semibold transition-colors duration-150' },
      compoundVariants: [
        { color: 'primary', variant: 'solid', class: 'bg-royal-500 text-carbon-950 hover:bg-royal-400 active:bg-royal-600 focus-visible:outline-primary' },
        { color: 'success', variant: 'solid', class: 'bg-royal-500 text-carbon-950 hover:bg-royal-400' },
        { color: 'warning', variant: 'solid', class: 'bg-posyellow-400 text-carbon-950 hover:bg-posyellow-300' }
      ]
    },
    select: { slots: { base: 'min-h-11 rounded-xl text-base bg-elevated ring-accented', content: 'z-20 rounded-xl bg-elevated', item: 'min-h-11' } },
    modal: { slots: { overlay: 'z-40 bg-black/45', content: 'z-50 glass-overlay max-h-[90dvh] overflow-y-auto', title: 'text-xl font-semibold', description: 'text-sm text-muted' } },
    card: { slots: { root: 'glass-panel shadow-none', body: 'p-5 sm:p-6', header: 'p-5 sm:p-6' } }
  }
})
