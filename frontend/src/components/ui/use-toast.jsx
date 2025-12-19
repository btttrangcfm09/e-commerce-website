import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ title, description, variant = "default", duration = 5000 }) => {
    const id = Math.random().toString(36).slice(2)
    const newToast = { id, title, description, variant }
    
    setToasts((currentToasts) => [...currentToasts, newToast])
    
    setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      )
    }, duration)
  }, [])

  return { toast, toasts }
}