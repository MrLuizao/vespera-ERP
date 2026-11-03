export default defineAppConfig({
  ui: {
    colors: {
      primary: 'royal',
      neutral: 'sage'
    },
    input: {
      slots: {
        base: 'dark:bg-carbon-800/80'
      }
    },
    inputNumber: {
      slots: {
        base: 'dark:bg-carbon-800/80'
      }
    },
    button: {
      compoundVariants: [
        { color: 'primary', variant: 'solid', class: 'text-white' },
        { color: 'info', variant: 'solid', class: 'text-white' }
      ]
    }
  }
})
