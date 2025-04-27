"use client"
import { useState, useEffect } from "react"
import { CalendarIcon, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/status-badge"
import { WorkTypeBadge } from "@/components/work-type-badge"
import type { Application, ApplicationStatus, WorkType } from "@/lib/types"
import { updateApplication, deleteApplication } from "@/lib/storage"
import { useSimpleForm } from "@/lib/form-utils"
import { toast } from "@/components/ui/use-toast"

interface ApplicationDetailsModalProps {
  application: Application
  open: boolean
  onClose: () => void
  onUpdate: () => void
}

interface FormValues {
  company: string
  position: string
  dateApplied: Date
  status: ApplicationStatus
  location: string
  workType: WorkType
  jobUrl: string
  notes: string
  salary: string
}

export function ApplicationDetailsModal({ application, open, onClose, onUpdate }: ApplicationDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Prepare initial values
  const initialValues: FormValues = {
    company: application.company || "",
    position: application.position || "",
    dateApplied: application.dateApplied ? new Date(application.dateApplied) : new Date(),
    status: application.status || "enviada",
    location: application.location || "",
    workType: application.workType || "presencial",
    jobUrl: application.jobUrl || "",
    notes: application.notes || "",
    salary: application.salary || "",
  }

  const { values, errors, isSubmitting, handleChange, handleDateChange, handleSelectChange, handleSubmit, setValues } =
    useSimpleForm<FormValues>(initialValues)

  // Update form values when application changes
  useEffect(() => {
    if (application) {
      setValues({
        company: application.company || "",
        position: application.position || "",
        dateApplied: application.dateApplied ? new Date(application.dateApplied) : new Date(),
        status: application.status || "enviada",
        location: application.location || "",
        workType: application.workType || "presencial",
        jobUrl: application.jobUrl || "",
        notes: application.notes || "",
        salary: application.salary || "",
      })
    }
  }, [application, setValues])

  const validationRules = {
    company: (value: string) => (value ? null : "La empresa es requerida"),
    position: (value: string) => (value ? null : "El puesto es requerido"),
    dateApplied: (value: Date) => (value ? null : "La fecha de aplicación es requerida"),
    status: (value: ApplicationStatus) => (value ? null : "El estado es requerido"),
    workType: (value: WorkType) => (value ? null : "El tipo de trabajo es requerido"),
    jobUrl: (value: string) => {
      if (!value) return null
      try {
        new URL(value)
        return null
      } catch {
        return "Ingresa una URL válida"
      }
    },
  }

  const onSubmitForm = (formValues: FormValues) => {
    try {
      const updatedApplication: Application = {
        ...application,
        ...formValues,
        dateApplied: formValues.dateApplied.toISOString(),
        location: formValues.location || undefined,
        jobUrl: formValues.jobUrl || undefined,
        notes: formValues.notes || undefined,
        salary: formValues.salary || undefined,
        updatedAt: new Date().toISOString(),
      }

      updateApplication(updatedApplication)
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      console.error("Error al actualizar la postulación:", error)
    }
  }

  const handleDelete = () => {
    try {
      // Cerrar primero el modal para evitar problemas de estado
      onClose()

      // Luego eliminar la aplicación
      deleteApplication(application.id)

      // Notificar que se ha actualizado
      onUpdate()

      // Mostrar notificación de éxito
      toast({
        title: "Postulación eliminada",
        description: "La postulación ha sido eliminada correctamente.",
      })
    } catch (error) {
      console.error("Error al eliminar la postulación:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la postulación.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {isEditing ? "Editar Postulación" : application.company}
            {!isEditing && <StatusBadge status={application.status} />}
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmitForm, validationRules)} className="space-y-4 px-6 pb-6 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                name="company"
                placeholder="Nombre de la empresa"
                value={values.company}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
              {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Puesto</Label>
              <Input
                id="position"
                name="position"
                placeholder="Título del puesto"
                value={values.position}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
              {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateApplied">Fecha de Aplicación</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="dateApplied"
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700",
                        !values.dateApplied && "text-muted-foreground",
                      )}
                    >
                      {values.dateApplied ? (
                        format(values.dateApplied, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={values.dateApplied}
                      onSelect={(date) => {
                        handleDateChange("dateApplied", date)
                        setCalendarOpen(false)
                      }}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateApplied && <p className="text-sm text-red-500">{errors.dateApplied}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={values.status}
                  onValueChange={(value) => handleSelectChange("status", value as ApplicationStatus)}
                >
                  <SelectTrigger
                    id="status"
                    className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                  >
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enviada">Enviada</SelectItem>
                    <SelectItem value="entrevista">En Entrevista</SelectItem>
                    <SelectItem value="rechazada">Rechazada</SelectItem>
                    <SelectItem value="oferta">Oferta Recibida</SelectItem>
                    <SelectItem value="aceptada">Aceptada</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Ej: Ciudad de México"
                  value={values.location}
                  onChange={handleChange}
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workType">Tipo de Trabajo</Label>
                <Select
                  value={values.workType}
                  onValueChange={(value) => handleSelectChange("workType", value as WorkType)}
                >
                  <SelectTrigger
                    id="workType"
                    className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                  >
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remoto">Remoto</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                  </SelectContent>
                </Select>
                {errors.workType && <p className="text-sm text-red-500">{errors.workType}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salario (opcional)</Label>
              <Input
                id="salary"
                name="salary"
                placeholder="Ej: $50,000 MXN mensual"
                value={values.salary}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobUrl">URL de la Oferta (opcional)</Label>
              <Input
                id="jobUrl"
                name="jobUrl"
                placeholder="https://..."
                value={values.jobUrl}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
              {errors.jobUrl && <p className="text-sm text-red-500">{errors.jobUrl}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Agrega notas sobre la postulación, entrevistas, etc."
                value={values.notes}
                onChange={handleChange}
                className="min-h-[100px] bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEditing(false)}
                className="border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white"
              >
                {isSubmitting ? "Guardando..." : "Actualizar"}
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid gap-4 py-4 px-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Empresa</h3>
                  <p className="mt-1 font-medium">{application.company}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Puesto</h3>
                  <p className="mt-1">{application.position}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Fecha de Aplicación</h3>
                  <p className="mt-1">{new Date(application.dateApplied).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
                  <p className="mt-1">
                    <StatusBadge status={application.status} />
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Ubicación</h3>
                  <p className="mt-1">{application.location || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tipo de Trabajo</h3>
                  <p className="mt-1">
                    {application.workType ? <WorkTypeBadge workType={application.workType} /> : "-"}
                  </p>
                </div>
              </div>

              {application.salary && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Salario</h3>
                  <p className="mt-1">{application.salary}</p>
                </div>
              )}

              {application.jobUrl && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">URL de la Oferta</h3>
                  <p className="mt-1">
                    <a
                      href={application.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Ver oferta
                    </a>
                  </p>
                </div>
              )}

              {application.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Notas</h3>
                  <p className="mt-1 whitespace-pre-line">{application.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>

              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
