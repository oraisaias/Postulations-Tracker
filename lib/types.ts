export type ApplicationStatus = "enviada" | "entrevista" | "rechazada" | "oferta" | "aceptada"
export type WorkType = "remoto" | "hibrido" | "presencial"

export interface Application {
  id: string
  company: string
  position: string
  dateApplied: string
  status: ApplicationStatus
  location?: string
  workType?: WorkType
  salary?: string
  jobUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Nueva interfaz para la información del usuario
export interface UserInfo {
  // Información personal
  fullName: string
  email: string
  phone: string
  location: string
  postalCode: string
  linkedinUrl: string
  portfolioUrl: string

  // Información profesional
  professionalTitle: string
  yearsOfExperience: string
  desiredSalary: string
  availability: string
  preferredWorkType: WorkType

  // Educación
  degree: string
  institution: string
  graduationYear: string

  // Habilidades
  skills: string
  languages: string

  // Respuestas comunes
  professionalSummary: string
  whyLookingForJob: string
}
