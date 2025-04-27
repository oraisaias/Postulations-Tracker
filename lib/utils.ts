import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función de utilidad para manejar errores de formularios
export function handleFormError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return "Ha ocurrido un error inesperado"
}

// Función para formatear fechas de manera segura
export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString()
  } catch (error) {
    console.error("Error al formatear fecha:", error)
    return "Fecha inválida"
  }
}

// Función para validar URLs
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

// Función para convertir string a fecha de manera segura
export function safeParseDate(dateString: string | undefined): Date {
  if (!dateString) return new Date()

  try {
    const date = new Date(dateString)
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return new Date()
    }
    return date
  } catch (error) {
    console.error("Error al parsear fecha:", error)
    return new Date()
  }
}

// Función para manejar valores por defecto en formularios
export function getDefaultFormValue<T>(value: T | undefined, defaultValue: T): T {
  return value !== undefined && value !== null ? value : defaultValue
}
