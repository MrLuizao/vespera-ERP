interface ConfirmModalOptions {
  title: string
  description: string
  icon?: string
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  confirmText?: string
  cancelText?: string
  details?: { label: string, value: string }[]
}

interface ConfirmModalState {
  isOpen: boolean
  options: ConfirmModalOptions
  onConfirm: (() => void) | null
  onCancel: (() => void) | null
}

const modalState = reactive<ConfirmModalState>({
  isOpen: false,
  options: {
    title: '',
    description: '',
    icon: 'i-lucide-alert-circle',
    color: 'primary',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    details: []
  },
  onConfirm: null,
  onCancel: null
})

export function useConfirmModal() {
  function confirm(options: ConfirmModalOptions): Promise<boolean> {
    return new Promise((resolve) => {
      modalState.options = {
        icon: 'i-lucide-alert-circle',
        color: 'primary',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        details: [],
        ...options
      }

      modalState.onConfirm = () => {
        modalState.isOpen = false
        resolve(true)
      }

      modalState.onCancel = () => {
        modalState.isOpen = false
        resolve(false)
      }

      modalState.isOpen = true
    })
  }

  function confirmLogout() {
    return confirm({
      title: '¿Cerrar Sesión?',
      description: '¿Estás seguro que deseas salir del Portal de Socios CFO?',
      icon: 'i-lucide-log-out',
      color: 'neutral',
      confirmText: 'Cerrar Sesión',
      cancelText: 'Cancelar'
    })
  }

  return {
    modalState,
    confirm,
    confirmLogout
  }
}
