import type { Application } from "./types"

const STORAGE_KEY = "job-applications"

// Obtener todas las postulaciones
export function getApplications(): Application[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error al obtener las postulaciones:", error)
    return []
  }
}

// Obtener una postulación por ID
export function getApplicationById(id: string): Application | null {
  const applications = getApplications()
  return applications.find((app) => app.id === id) || null
}

// Agregar una nueva postulación
export function addApplication(application: Application): void {
  try {
    const applications = getApplications()
    applications.push(application)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
    // Disparar evento para actualizar otras pestañas
    window.dispatchEvent(new Event("storage"))
  } catch (error) {
    console.error("Error al agregar la postulación:", error)
    throw error
  }
}

// Actualizar una postulación existente
export function updateApplication(updatedApplication: Application): void {
  try {
    const applications = getApplications()
    const index = applications.findIndex((app) => app.id === updatedApplication.id)

    if (index !== -1) {
      applications[index] = updatedApplication
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
      // Disparar evento para actualizar otras pestañas
      window.dispatchEvent(new Event("storage"))
    } else {
      throw new Error("Postulación no encontrada")
    }
  } catch (error) {
    console.error("Error al actualizar la postulación:", error)
    throw error
  }
}

// Eliminar una postulación
export function deleteApplication(id: string): void {
  try {
    const applications = getApplications()
    const filteredApplications = applications.filter((app) => app.id !== id)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredApplications))
    // Disparar evento para actualizar otras pestañas
    window.dispatchEvent(new Event("storage"))
  } catch (error) {
    console.error("Error al eliminar la postulación:", error)
    throw error
  }
}

// Datos de ejemplo
export function seedExampleData(): void {
  if (typeof window === "undefined") return

  // Verificar si ya hay datos
  const existingData = localStorage.getItem(STORAGE_KEY)
  if (existingData && JSON.parse(existingData).length > 0) {
    return
  }

  const exampleData: Application[] = [
    {
      id: "1",
      company: "Google México",
      position: "Frontend Developer",
      dateApplied: new Date().toISOString(),
      status: "entrevista",
      location: "Ciudad de México",
      workType: "hibrido",
      jobUrl: "https://careers.google.com",
      notes: "Primera entrevista programada para la próxima semana. Preparar preguntas sobre la cultura de la empresa.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      company: "Microsoft",
      position: "UX Designer",
      dateApplied: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días atrás
      status: "rechazada",
      location: "Guadalajara, Jalisco",
      workType: "presencial",
      jobUrl: "https://careers.microsoft.com",
      notes: "Recibí retroalimentación sobre mejorar mi portafolio con más casos de estudio.",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      company: "Amazon",
      position: "Full Stack Developer",
      dateApplied: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 días atrás
      status: "oferta",
      location: "Monterrey, Nuevo León",
      workType: "remoto",
      jobUrl: "https://amazon.jobs",
      notes: "Oferta recibida: $80,000 MXN mensuales. Beneficios incluyen seguro médico y bonos anuales.",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(exampleData))
}
