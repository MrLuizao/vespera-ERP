interface SuccessModalOptions {
  title: string
  description: string
  icon?: string
  details?: { label: string, value: string }[]
}

interface SuccessModalState {
  isOpen: boolean
  options: SuccessModalOptions
}

const successState = reactive<SuccessModalState>({
  isOpen: false,
  options: {
    title: '',
    description: '',
    icon: 'i-lucide-check-circle',
    details: []
  }
})

export function useSuccessModal() {
  function showSuccess(options: SuccessModalOptions) {
    successState.options = {
      icon: 'i-lucide-check-circle',
      details: [],
      ...options
    }
    successState.isOpen = true
  }

  function closeSuccess() {
    successState.isOpen = false
  }

  return {
    successState,
    showSuccess,
    closeSuccess
  }
}
