"use client"

// Adapted from https://ui.shadcn.com/docs/components/toast
import { useState, useEffect } from "react"

export type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function toast(props: ToastProps) {
  const event = new CustomEvent("toast", { detail: props })
  window.dispatchEvent(event)
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastProps>
      setToasts((prev) => [...prev, customEvent.detail])

      // Auto dismiss after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.slice(1))
      }, 3000)
    }

    window.addEventListener("toast", handleToast)
    return () => window.removeEventListener("toast", handleToast)
  }, [])

  return { toasts }
}
