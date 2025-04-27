"use client"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Application, ApplicationStatus, WorkType } from "@/lib/types"
import { addApplication } from "@/lib/storage"
import { useSimpleForm } from "@/lib/form-utils"

interface ApplicationModalProps {
  open: boolean
  onClose: () => void
  onSave: () => void
}

interface FormValues {
  company: string
  position: string
  dateApplied: Date
  status: ApplicationStatus
  location: string
  workType: WorkType
  salary: string
  jobUrl: string
  notes: string
}

export function ApplicationModal({ open, onClose, onSave }: ApplicationModalProps) {
  const [calendarOpen, setCalendarOpen] = useState(false)

  const initialValues: FormValues = {
    company: "",
    position: "",
    dateApplied: new Date(),
    status: "enviada",
    location: "",
    workType: "presencial",
    salary: "",
    jobUrl: "",
    notes: "",
  }

  const { values, errors, isSubmitting, handleChange, handleDateChange, handleSelectChange, handleSubmit, reset } =
    useSimpleForm<FormValues>(initialValues)

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
      const newApplication: Application = {
        ...formValues,
        id: uuidv4(),
        dateApplied: formValues.dateApplied.toISOString(),
        location: formValues.location || undefined,
        salary: formValues.salary || undefined,
        jobUrl: formValues.jobUrl || undefined,
        notes: formValues.notes || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      addApplication(newApplication)
      reset()
      onSave()
    } catch (error) {
      console.error("Error al guardar la postulación:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold">Nueva Postulación</DialogTitle>
        </DialogHeader>

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
                      "w-full pl-3 text-left font-normal bg-gray-50 dark:bg-gray-800",
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
            <Input
              id="notes"
              name="notes"
              placeholder="Agrega notas sobre la postulación, entrevistas, etc."
              value={values.notes}
              onChange={handleChange}
              className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
