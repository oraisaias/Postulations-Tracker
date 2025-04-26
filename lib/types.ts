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
