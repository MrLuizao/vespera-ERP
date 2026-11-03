interface LoaderState {
  isLoading: boolean
  message: string
}

const loaderState = reactive<LoaderState>({
  isLoading: false,
  message: ''
})

export function useLoader() {
  function showLoader(message: string = 'Procesando...') {
    loaderState.message = message
    loaderState.isLoading = true
  }

  function hideLoader() {
    loaderState.isLoading = false
    loaderState.message = ''
  }

  return {
    loaderState,
    showLoader,
    hideLoader
  }
}
