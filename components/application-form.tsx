"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Application, ApplicationStatus, WorkType } from "@/lib/types"
import { useSimpleForm } from "@/lib/form-utils"

interface ApplicationFormProps {
  onSubmit: (data: Omit<Application, "id" | "createdAt" | "updatedAt">) => void
  isSubmitting: boolean
  defaultValues?: Application
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

export function ApplicationForm({ onSubmit, isSubmitting, defaultValues }: ApplicationFormProps) {
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Prepare initial values
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

  const { values, errors, handleChange, handleDateChange, handleSelectChange, handleSubmit, setValues } =
    useSimpleForm<FormValues>(initialValues)

  // Update form values when defaultValues changes
  useEffect(() => {
    if (defaultValues) {
      setValues({
        company: defaultValues.company || "",
        position: defaultValues.position || "",
        dateApplied: defaultValues.dateApplied ? new Date(defaultValues.dateApplied) : new Date(),
        status: defaultValues.status || "enviada",
        location: defaultValues.location || "",
        workType: defaultValues.workType || "presencial",
        salary: defaultValues.salary || "",
        jobUrl: defaultValues.jobUrl || "",
        notes: defaultValues.notes || "",
      })
    }
  }, [defaultValues, setValues])

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
    onSubmit({
      company: formValues.company,
      position: formValues.position,
      dateApplied: formValues.dateApplied.toISOString(),
      status: formValues.status,
      location: formValues.location || undefined,
      workType: formValues.workType,
      salary: formValues.salary || undefined,
      jobUrl: formValues.jobUrl || undefined,
      notes: formValues.notes || undefined,
    })
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmitForm, validationRules)}>
        <CardContent className="grid gap-6 pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                name="company"
                placeholder="Nombre de la empresa"
                value={values.company}
                onChange={handleChange}
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
              />
              {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dateApplied">Fecha de Aplicación</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="dateApplied"
                    variant={"outline"}
                    className={cn("w-full pl-3 text-left font-normal", !values.dateApplied && "text-muted-foreground")}
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
                <SelectTrigger id="status">
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="workType">Tipo de Trabajo</Label>
              <Select
                value={values.workType}
                onValueChange={(value) => handleSelectChange("workType", value as WorkType)}
              >
                <SelectTrigger id="workType">
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

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación (opcional)</Label>
              <Input
                id="location"
                name="location"
                placeholder="Ej: Ciudad de México"
                value={values.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salary">Salario (opcional)</Label>
              <Input
                id="salary"
                name="salary"
                placeholder="Ej: $50,000 MXN mensual"
                value={values.salary}
                onChange={handleChange}
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
              />
              {errors.jobUrl && <p className="text-sm text-red-500">{errors.jobUrl}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Agrega notas sobre la postulación, entrevistas, etc."
              className="min-h-[120px]"
              value={values.notes}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={defaultValues ? `/applications/${defaultValues.id}` : "/applications"}>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : defaultValues ? "Actualizar" : "Guardar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
