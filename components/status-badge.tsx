"use client"

import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "@/lib/types"

interface StatusBadgeProps {
  status: ApplicationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "enviada":
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700"
        >
          Enviada
        </Badge>
      )
    case "entrevista":
      return (
        <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 border-primary-200 dark:border-primary-800">
          En Entrevista
        </Badge>
      )
    case "rechazada":
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
        >
          Rechazada
        </Badge>
      )
    case "oferta":
      return (
        <Badge className="bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300 border-secondary-200 dark:border-secondary-800">
          Oferta Recibida
        </Badge>
      )
    case "aceptada":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
          Aceptada
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
