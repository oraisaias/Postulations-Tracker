"use client"

import { useToast } from "./use-toast"
import { X, Check } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast, index) => (
        <div
          key={index}
          className={`rounded-lg shadow-lg p-4 text-white animate-in fade-in slide-in-from-bottom-5 ${
            toast.variant === "destructive" ? "bg-red-500" : "bg-primary-500"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {toast.variant !== "destructive" && <Check className="h-5 w-5" />}
              <div>
                {toast.title && <h3 className="font-medium">{toast.title}</h3>}
                {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
              </div>
            </div>
            <button
              onClick={() => {
                const event = new CustomEvent("dismiss-toast", { detail: { index } })
                window.dispatchEvent(event)
              }}
              className="ml-4 text-white/80 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
